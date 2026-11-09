import { z } from "zod";

const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  ADMIN_MASTER_PASSWORD: z.string().min(8).default("AdminPristine2026!"),
  SESSION_ENCRYPTION_KEY: z
    .string()
    .min(32, "SESSION_ENCRYPTION_KEY must be at least 32 characters for AES-256")
    .default("pristine_clean_enterprise_master_key_32_bytes!!"),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  CLOUDINARY_URL: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  LEAD_WEBHOOK_URL: z.string().url().optional(),
});

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().default("sitetobook.com"),
  NEXT_PUBLIC_AGENCY_WHATSAPP: z.string().default("12145550189"),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_MASTER_PASSWORD: process.env.ADMIN_MASTER_PASSWORD,
  SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  LEAD_WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL,
  NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  NEXT_PUBLIC_AGENCY_WHATSAPP: process.env.NEXT_PUBLIC_AGENCY_WHATSAPP,
};

const isServer = typeof window === "undefined";

const serverParsed = isServer
  ? ServerEnvSchema.safeParse(processEnv)
  : ({ success: true, data: {} as z.infer<typeof ServerEnvSchema> } as const);

const clientParsed = ClientEnvSchema.safeParse(processEnv);

if ((isServer && !serverParsed.success) || !clientParsed.success) {
  const serverErrors =
    isServer && !serverParsed.success
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

const resolvedServerEnv = isServer
  ? serverParsed.success
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
        BLOB_READ_WRITE_TOKEN: processEnv.BLOB_READ_WRITE_TOKEN,
        CLOUDINARY_URL: processEnv.CLOUDINARY_URL,
        UPSTASH_REDIS_REST_URL: undefined,
        UPSTASH_REDIS_REST_TOKEN: undefined,
        LEAD_WEBHOOK_URL: undefined,
      }
  : ({} as z.infer<typeof ServerEnvSchema>);

const resolvedClientEnv = clientParsed.success
  ? clientParsed.data
  : {
      NEXT_PUBLIC_ROOT_DOMAIN: processEnv.NEXT_PUBLIC_ROOT_DOMAIN || "sitetobook.com",
      NEXT_PUBLIC_AGENCY_WHATSAPP: processEnv.NEXT_PUBLIC_AGENCY_WHATSAPP || "12145550189",
    };

export const env = {
  ...resolvedServerEnv,
  ...resolvedClientEnv,
};
