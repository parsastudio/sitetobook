"use server";

import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { formatPhoneDisplay, OwnerSettingsUpdateSchema } from "@/entities/tenant/schema";
import { getTenantBySlug, saveTenant } from "@/services/tenant.service";
import { ActionResponse } from "@/app/actions/tenant.actions";
import { verifyPasscode } from "@/lib/security";
import {
  clearOwnerSession,
  getOwnerSession,
  setOwnerSession,
} from "@/lib/auth-guard";
import { getClientIp } from "@/lib/network";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limiter";
import { logAuditEvent } from "@/lib/logger";

export async function verifyOwnerPinAction(
  slug: string,
  enteredPin: string
): Promise<ActionResponse<boolean>> {
  try {
    const headersList = await headers();
    const clientIp = getClientIp(headersList);
    const rateLimitKey = `owner_pin:${clientIp}:${slug.toLowerCase()}`;

    const rateCheck = await checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      logAuditEvent({
        action: "OWNER_PIN_FAILED",
        actor: { role: "anonymous", identifier: slug, ip: clientIp },
        target: slug,
        status: "failure",
        details: { reason: "RATE_LIMITED", retryAfter: rateCheck.retryAfterSeconds },
      });
      return {
        success: false,
        error: `Too many failed attempts. Locked for ${rateCheck.retryAfterSeconds}s to protect your account.`,
      };
    }

    const tenant = await getTenantBySlug(slug);
    if (!tenant) {
      return { success: false, error: "Business outlet not found" };
    }

    const isValid = await verifyPasscode(
      enteredPin.trim(),
      tenant.brand.ownerPinHash
    );

    if (!isValid) {
      logAuditEvent({
        action: "OWNER_PIN_FAILED",
        actor: { role: "anonymous", identifier: slug, ip: clientIp },
        target: slug,
        status: "failure",
        details: { remainingAttempts: rateCheck.remaining },
      });
      return {
        success: false,
        error: `Incorrect passcode. (${rateCheck.remaining} attempt${rateCheck.remaining === 1 ? "" : "s"} remaining)`,
      };
    }

    await resetRateLimit(rateLimitKey);
    logAuditEvent({
      action: "OWNER_PIN_SUCCESS",
      actor: { role: "owner", identifier: slug, ip: clientIp },
      target: slug,
      status: "success",
    });

    await setOwnerSession(slug);
    return { success: true, data: true };
  } catch (error) {
    console.error("verifyOwnerPinAction error:", error);
    return { success: false, error: "Authentication system error" };
  }
}

export async function logoutOwnerAction(
  slug: string
): Promise<ActionResponse<boolean>> {
  try {
    await clearOwnerSession(slug);
    return { success: true, data: true };
  } catch {
    return { success: false, error: "Failed to logout session" };
  }
}

export async function updateOwnerSettingsAction(
  slug: string,
  rawInput: unknown
): Promise<ActionResponse<boolean>> {
  try {
    const session = await getOwnerSession(slug);
    if (!session) {
      return { success: false, error: "Unauthorized session or session expired. Please re-authenticate." };
    }

    const validation = OwnerSettingsUpdateSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid operational inputs",
      };
    }

    const input = validation.data;
    const tenant = await getTenantBySlug(slug);
    if (!tenant) {
      return { success: false, error: "Tenant outlet not found" };
    }

    // 1. Update pricing structure
    tenant.pricing.baseDispatchFee = input.baseDispatchFee;
    tenant.pricing.ratePerBedroom = input.ratePerBedroom;
    tenant.pricing.ratePerBathroom = input.ratePerBathroom;

    // 2. Update add-ons pricing & feature toggles
    tenant.pricing.addOns = tenant.pricing.addOns.map((original) => {
      const match = input.addOns.find((item) => item.id === original.id);
      if (match) {
        return {
          ...original,
          price: match.price,
          enabled: match.enabled,
        };
      }
      return original;
    });

    // 3. Update direct dispatch lines
    tenant.brand.phone = input.phone;
    tenant.brand.formattedPhone = formatPhoneDisplay(input.phone);
    tenant.brand.whatsappNumber = input.whatsappNumber;

    // 4. Update service territories
    tenant.brand.location.serviceAreas = input.serviceAreas;

    await saveTenant(tenant);

    // Instant On-Demand Cache Invalidation for Edge Caches
    revalidateTag(`tenant-${slug}`, "max");
    revalidateTag("all-tenants", "max");

    logAuditEvent({
      action: "OWNER_SETTINGS_UPDATED",
      actor: { role: "owner", identifier: slug },
      target: slug,
      status: "success",
      details: { baseFee: input.baseDispatchFee, bedRate: input.ratePerBedroom },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("updateOwnerSettingsAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}
