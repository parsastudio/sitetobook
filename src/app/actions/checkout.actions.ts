"use server";

import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { ActionResponse } from "@/app/actions/tenant.actions";
import { CheckoutProvisionInputSchema, SAAS_PLANS } from "@/entities/saas/plans";
import { createDefaultTenant } from "@/entities/tenant/factory";
import { formatPhoneDisplay } from "@/entities/tenant/schema";
import { getTenantBySlug, saveTenant } from "@/services/tenant.service";
import { hashPasscode } from "@/lib/security";
import { setOwnerSession } from "@/lib/auth-guard";
import { getClientIp } from "@/lib/network";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logAuditEvent } from "@/lib/logger";

export interface CheckoutReceiptData {
  slug: string;
  businessName: string;
  planName: string;
  amountCharged: number;
  billingCycle: "monthly" | "annual";
  ownerPin: string;
  receiptId: string;
}

export async function processStripeCheckoutAction(
  rawInput: unknown
): Promise<ActionResponse<CheckoutReceiptData>> {
  try {
    const headersList = await headers();
    const clientIp = getClientIp(headersList);

    const rateCheck = await checkRateLimit(
      `saas_checkout:${clientIp}`,
      5,
      15 * 60 * 1000
    );
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Too many checkout attempts. Please wait ${rateCheck.retryAfterSeconds}s.`,
      };
    }

    const validation = CheckoutProvisionInputSchema.safeParse(rawInput);
    if (!validation.success) {
      const firstIssue =
        validation.error.issues[0]?.message ?? "Invalid checkout configuration.";
      return { success: false, error: firstIssue };
    }

    const input = validation.data;
    const plan =
      SAAS_PLANS.find((p) => p.id === input.planId) ?? SAAS_PLANS[1];
    const monthlyRate =
      input.billingCycle === "annual"
        ? plan.annualMonthlyPrice
        : plan.monthlyPrice;
    const amountCharged =
      input.billingCycle === "annual" ? monthlyRate * 12 : monthlyRate;

    const existing = await getTenantBySlug(input.slug);
    if (existing && !input.claimExistingSlug) {
      return {
        success: false,
        error: `Portal slug '${input.slug}' is already registered. Please choose another URL slug.`,
      };
    }

    const hashedPin = await hashPasscode(input.ownerPin);
    const subscriptionMeta = {
      planId: plan.id,
      planName: plan.name,
      billingCycle: input.billingCycle,
      cardLast4: input.cardLast4,
      status: "active" as const,
    };

    let finalBusinessName = input.name;

    if (existing && input.claimExistingSlug) {
      existing.brand.ownerPinHash = hashedPin;
      existing.brand.subscription = subscriptionMeta;
      if (input.name.trim()) {
        existing.brand.name = input.name.trim();
      }
      if (input.tagline.trim()) {
        existing.brand.tagline = input.tagline.trim();
      }
      if (input.city.trim()) {
        existing.brand.location.city = input.city.trim();
      }
      if (input.state.trim()) {
        existing.brand.location.state = input.state.trim();
      }
      if (input.phone.trim()) {
        existing.brand.phone = input.phone.trim();
        existing.brand.formattedPhone = formatPhoneDisplay(input.phone.trim());
        existing.brand.whatsappNumber = input.whatsappNumber;
      }
      if (input.email && input.email !== "hello@pristineclean.com") {
        existing.brand.email = input.email;
      }
      existing.brand.themeOverrides = {
        primaryColor: input.primaryColor,
        accentColor: input.accentColor,
      };
      finalBusinessName = existing.brand.name;
      await saveTenant(existing);
    } else {
      const newTenant = createDefaultTenant(input, hashedPin);
      newTenant.brand.subscription = subscriptionMeta;
      await saveTenant(newTenant);
    }

    await setOwnerSession(input.slug);

    revalidateTag(`tenant-${input.slug}`, "max");
    revalidateTag("all-tenants", "max");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/${input.slug}`);
    revalidatePath(`/${input.slug}/owner`);

    const receiptId = `rcpt_${Date.now().toString(36).toUpperCase()}`;

    logAuditEvent({
      action: "SAAS_CHECKOUT_COMPLETED",
      actor: { role: "owner", identifier: input.slug, ip: clientIp },
      target: input.slug,
      status: "success",
      details: {
        planId: plan.id,
        billingCycle: input.billingCycle,
        amountCharged,
        cardLast4: input.cardLast4,
        receiptId,
      },
    });

    return {
      success: true,
      data: {
        slug: input.slug,
        businessName: finalBusinessName,
        planName: plan.name,
        amountCharged,
        billingCycle: input.billingCycle,
        ownerPin: input.ownerPin,
        receiptId,
      },
    };
  } catch (error) {
    console.error("processStripeCheckoutAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Payment processing failed. Please try again.",
    };
  }
}
