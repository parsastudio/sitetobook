"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActionResponse } from "@/app/actions/tenant.actions";
import { clearAdminSession, setAdminSession } from "@/lib/auth-guard";
import { getClientIp } from "@/lib/network";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limiter";
import { logAuditEvent } from "@/lib/logger";
import { verifyTimingSafeString } from "@/lib/security";
import { env } from "@/env";

const MASTER_PASSWORD = env.ADMIN_MASTER_PASSWORD;

export async function loginAdminAction(
  password: string
): Promise<ActionResponse<boolean>> {
  try {
    const headersList = await headers();
    const clientIp = getClientIp(headersList);
    const rateLimitKey = `admin_login:${clientIp}`;

    // Rate Limiting (5 attempts in 15 minutes)
    const rateCheck = await checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      logAuditEvent({
        action: "ADMIN_LOGIN_FAILED",
        actor: { role: "anonymous", ip: clientIp },
        target: "system-admin",
        status: "failure",
        details: { reason: "RATE_LIMITED", retryAfter: rateCheck.retryAfterSeconds },
      });
      return {
        success: false,
        error: `Admin login locked. Please wait ${rateCheck.retryAfterSeconds}s before trying again.`,
      };
    }

    if (!verifyTimingSafeString(password, MASTER_PASSWORD)) {
      logAuditEvent({
        action: "ADMIN_LOGIN_FAILED",
        actor: { role: "anonymous", ip: clientIp },
        target: "system-admin",
        status: "failure",
        details: { remainingAttempts: rateCheck.remaining },
      });
      return {
        success: false,
        error: `Invalid master password. (${rateCheck.remaining} attempt${rateCheck.remaining === 1 ? "" : "s"} remaining)`,
      };
    }

    await resetRateLimit(rateLimitKey);
    logAuditEvent({
      action: "ADMIN_LOGIN_SUCCESS",
      actor: { role: "master-admin", ip: clientIp },
      target: "system-admin",
      status: "success",
    });

    await setAdminSession();
    return { success: true, data: true };
  } catch (error) {
    console.error("loginAdminAction error:", error);
    return { success: false, error: "Failed to authenticate master admin" };
  }
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  logAuditEvent({
    action: "ADMIN_LOGOUT",
    actor: { role: "master-admin" },
    target: "system-admin",
    status: "success",
  });
  redirect("/admin/login");
}
