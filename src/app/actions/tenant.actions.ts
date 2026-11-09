"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CreateTenantInputSchema } from "@/entities/tenant/schema";
import { createDefaultTenant } from "@/entities/tenant/factory";
import { saveTenant, deleteTenant, getTenantBySlug } from "@/services/tenant.service";
import { hashPasscode } from "@/lib/security";
import { getAdminSession } from "@/lib/auth-guard";
import { logAuditEvent } from "@/lib/logger";

export type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createTenantAction(
  rawInput: unknown
): Promise<ActionResponse<{ slug: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        error: "Unauthorized. Master Admin session is required.",
      };
    }

    const validation = CreateTenantInputSchema.safeParse(rawInput);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message ?? "Invalid input data";
      return { success: false, error: firstIssue };
    }

    const input = validation.data;
    const existing = await getTenantBySlug(input.slug);
    if (existing) {
      return {
        success: false,
        error: `Subdomain '${input.slug}' is already taken. Please pick another slug.`,
      };
    }

    const defaultHashedPin = await hashPasscode("1234");
    const newTenant = createDefaultTenant(input, defaultHashedPin);

    await saveTenant(newTenant);

    revalidateTag(`tenant-${newTenant.brand.slug}`, "max");
    revalidateTag("all-tenants", "max");
    revalidatePath("/admin");

    logAuditEvent({
      action: "TENANT_CREATED",
      actor: { role: "master-admin" },
      target: newTenant.brand.slug,
      status: "success",
      details: { name: newTenant.brand.name, city: newTenant.brand.location.city },
    });

    return { success: true, data: { slug: newTenant.brand.slug } };
  } catch (error) {
    console.error("createTenantAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create tenant",
    };
  }
}

export async function deleteTenantAction(
  slug: string
): Promise<ActionResponse<boolean>> {
  try {
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        error: "Unauthorized. Master Admin session is required.",
      };
    }

    const deleted = await deleteTenant(slug);
    if (!deleted) {
      return { success: false, error: "Tenant not found or already deleted" };
    }

    revalidateTag(`tenant-${slug}`, "max");
    revalidateTag("all-tenants", "max");
    revalidatePath("/admin");

    logAuditEvent({
      action: "TENANT_DELETED",
      actor: { role: "master-admin" },
      target: slug,
      status: "success",
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("deleteTenantAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete tenant",
    };
  }
}
