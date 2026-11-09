import { z } from "zod";

const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  ADMIN_MASTER_PASSWORD: z.string().min(8).default("AdminPristine2026!"),
  SESSION_ENCRYPTION_KEY: z
    .string()
    .min(32, "SESSION_ENCRYPTION_KEY must be at least 32 characters for AES-256")
    .default("pristine_clean_enterprise_master_key_32_bytes!!"),
});

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().default("pristineclean.com"),
  NEXT_PUBLIC_AGENCY_WHATSAPP: z.string().default("12145550189"),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_MASTER_PASSWORD: process.env.ADMIN_MASTER_PASSWORD,
  SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY,
  NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  NEXT_PUBLIC_AGENCY_WHATSAPP: process.env.NEXT_PUBLIC_AGENCY_WHATSAPP,
};

const serverParsed = ServerEnvSchema.safeParse(processEnv);
const clientParsed = ClientEnvSchema.safeParse(processEnv);

if (!serverParsed.success || !clientParsed.success) {
  const serverErrors = !serverParsed.success
    ? serverParsed.error.flatten().fieldErrors
    : {};
  const clientErrors = !clientParsed.success
    ? clientParsed.error.flatten().fieldErrors
    : {};

  console.error("❌ Invalid environment variables:", {
    ...serverErrors,
    ...clientErrors,
  });

  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment configuration for production.");
  }
}

const resolvedServerEnv = serverParsed.success
  ? serverParsed.data
  : {
      NODE_ENV: "development" as const,
      DATABASE_URL: undefined,
      ADMIN_MASTER_PASSWORD:
        processEnv.ADMIN_MASTER_PASSWORD && processEnv.ADMIN_MASTER_PASSWORD.length >= 8
          ? processEnv.ADMIN_MASTER_PASSWORD
          : "AdminPristine2026!",
      SESSION_ENCRYPTION_KEY:
        processEnv.SESSION_ENCRYPTION_KEY && processEnv.SESSION_ENCRYPTION_KEY.length >= 32
          ? processEnv.SESSION_ENCRYPTION_KEY
          : "pristine_clean_enterprise_master_key_32_bytes!!",
    };

const resolvedClientEnv = clientParsed.success
  ? clientParsed.data
  : {
      NEXT_PUBLIC_ROOT_DOMAIN: processEnv.NEXT_PUBLIC_ROOT_DOMAIN || "pristineclean.com",
      NEXT_PUBLIC_AGENCY_WHATSAPP: processEnv.NEXT_PUBLIC_AGENCY_WHATSAPP || "12145550189",
    };

export const env = {
  ...resolvedServerEnv,
  ...resolvedClientEnv,
};
