"use server";

import { headers } from "next/headers";
import { ActionResponse } from "@/app/actions/tenant.actions";
import { ClaimLeadInputSchema } from "@/entities/lead/schema";
import { getClientIp } from "@/lib/network";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logAuditEvent } from "@/lib/logger";

export async function submitClaimLeadAction(
  rawInput: unknown
): Promise<ActionResponse<boolean>> {
  try {
    const headersList = await headers();
    const clientIp = getClientIp(headersList);
    const rateCheck = await checkRateLimit(`lead_claim:${clientIp}`, 5, 10 * 60 * 1000);

    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Too many submissions. Please wait ${rateCheck.retryAfterSeconds}s.`,
      };
    }

    const validation = ClaimLeadInputSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid contact details.",
      };
    }

    const lead = validation.data;

    logAuditEvent({
      action: "TENANT_CREATED",
      actor: { role: "anonymous", ip: clientIp },
      target: lead.slug,
      status: "success",
      details: {
        leadType: "WEBSITE_CLAIM_REQUEST",
        businessName: lead.businessName,
        city: lead.city,
        contact: lead.contact,
      },
    });

    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "lead.claimed",
            timestamp: new Date().toISOString(),
            data: lead,
          }),
        });
      } catch (err) {
        console.error("Webhook dispatch failed:", err);
      }
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("submitClaimLeadAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record request.",
    };
  }
}
