"use server";

import { revalidateTag } from "next/cache";
import { ActionResponse } from "@/app/actions/tenant.actions";
import {
  addTenantGalleryItem,
  deleteTenantGalleryItem,
} from "@/services/tenant.service";
import { getOwnerSession } from "@/lib/auth-guard";
import { AddGalleryPairInputSchema } from "@/entities/media/schema";
import { logAuditEvent } from "@/lib/logger";

export async function addGalleryPairAction(
  slug: string,
  rawInput: unknown
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await getOwnerSession(slug);
    if (!session) {
      return { success: false, error: "Unauthorized session or session expired. Please login." };
    }

    const validation = AddGalleryPairInputSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid media input.",
      };
    }

    const input = validation.data;
    const created = await addTenantGalleryItem(slug, {
      title: input.title,
      area: input.area,
      beforeImage: input.beforeImageUrl,
      afterImage: input.afterImageUrl,
    });

    revalidateTag(`tenant-${slug}`, "max");
    revalidateTag("all-tenants", "max");

    logAuditEvent({
      action: "GALLERY_UPDATED",
      actor: { role: "owner", identifier: slug },
      target: slug,
      status: "success",
      details: { operation: "ADD", itemId: created.id },
    });

    return { success: true, data: { id: created.id } };
  } catch (error) {
    console.error("addGalleryPairAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save gallery showcase.",
    };
  }
}

export async function deleteGalleryPairAction(
  slug: string,
  galleryId: string
): Promise<ActionResponse<boolean>> {
  try {
    const session = await getOwnerSession(slug);
    if (!session) {
      return { success: false, error: "Unauthorized session or session expired." };
    }

    const deleted = await deleteTenantGalleryItem(slug, galleryId);
    if (!deleted) {
      return { success: false, error: "Showcase item not found." };
    }

    revalidateTag(`tenant-${slug}`, "max");
    revalidateTag("all-tenants", "max");

    logAuditEvent({
      action: "GALLERY_UPDATED",
      actor: { role: "owner", identifier: slug },
      target: slug,
      status: "success",
      details: { operation: "DELETE", itemId: galleryId },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("deleteGalleryPairAction error:", error);
    return { success: false, error: "Failed to remove gallery pair." };
  }
}
