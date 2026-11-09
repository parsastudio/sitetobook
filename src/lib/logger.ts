import "server-only";

export type AuditAction =
  | "ADMIN_LOGIN_SUCCESS"
  | "ADMIN_LOGIN_FAILED"
  | "ADMIN_LOGOUT"
  | "OWNER_PIN_SUCCESS"
  | "OWNER_PIN_FAILED"
  | "OWNER_SETTINGS_UPDATED"
  | "TENANT_CREATED"
  | "TENANT_DELETED"
  | "GALLERY_UPDATED"
  | "LEAD_CLAIM_SUBMITTED"
  | "SAAS_CHECKOUT_COMPLETED";

export interface AuditLogPayload {
  action: AuditAction;
  actor: {
    role: "master-admin" | "owner" | "anonymous";
    identifier?: string;
    ip?: string;
  };
  target?: string;
  status: "success" | "failure";
  details?: Record<string, unknown>;
}

export function logAuditEvent(payload: AuditLogPayload): void {
  const structuredEntry = {
    timestamp: new Date().toISOString(),
    service: "sitetobook-platform",
    environment: process.env.NODE_ENV || "development",
    ...payload,
  };

  console.log(`[AUDIT] ${JSON.stringify(structuredEntry)}`);
}
