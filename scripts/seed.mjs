import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

async function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  for (const filename of [".env", ".env.local"]) {
    const envPath = path.join(process.cwd(), filename);
    if (!existsSync(envPath)) continue;

    const content = await readFile(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      if (key !== "DATABASE_URL") continue;

      let value = trimmed.slice(eqIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (value) return value;
    }
  }

  return null;
}

async function seed() {
  const databaseUrl = await loadDatabaseUrl();
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL is missing in environment or .env file.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const jsonPath = path.join(process.cwd(), "src", "data", "tenants.json");
  const raw = await readFile(jsonPath, "utf-8");
  const tenantsMap = JSON.parse(raw);

  const entries = Object.values(tenantsMap);
  console.log(`Seeding ${entries.length} tenants into PostgreSQL...`);

  for (const tenant of entries) {
    const { brand, pricing, trust, checklist, gallery, faqs } = tenant;
    const slug = brand.slug.toLowerCase().trim();

    await sql`
      INSERT INTO tenants (
        id,
        slug,
        name,
        tagline,
        phone,
        formatted_phone,
        whatsapp_number,
        email,
        owner_pin_hash,
        custom_domain,
        subscription,
        city,
        state,
        service_areas,
        primary_color,
        accent_color,
        operating_hours,
        currency_symbol,
        base_dispatch_fee,
        rate_per_bedroom,
        rate_per_bathroom,
        services,
        add_ons,
        trust,
        checklist,
        gallery,
        faqs
      )
      VALUES (
        ${randomUUID()},
        ${slug},
        ${brand.name},
        ${brand.tagline},
        ${brand.phone},
        ${brand.formattedPhone},
        ${brand.whatsappNumber},
        ${brand.email},
        ${brand.ownerPinHash},
        ${brand.customDomain ?? null},
        ${brand.subscription ? JSON.stringify(brand.subscription) : null}::jsonb,
        ${brand.location.city},
        ${brand.location.state},
        ${JSON.stringify(brand.location.serviceAreas ?? [])}::jsonb,
        ${brand.themeOverrides?.primaryColor ?? "#0a3326"},
        ${brand.themeOverrides?.accentColor ?? "#115e45"},
        ${brand.operatingHours ?? "Mon - Sat: 8:00 AM - 6:00 PM"},
        ${pricing.currencySymbol ?? "$"},
        ${pricing.baseDispatchFee},
        ${pricing.ratePerBedroom},
        ${pricing.ratePerBathroom},
        ${JSON.stringify(pricing.services ?? [])}::jsonb,
        ${JSON.stringify(pricing.addOns ?? [])}::jsonb,
        ${JSON.stringify(trust)}::jsonb,
        ${JSON.stringify(checklist ?? [])}::jsonb,
        ${JSON.stringify(gallery ?? [])}::jsonb,
        ${JSON.stringify(faqs ?? [])}::jsonb
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        tagline = EXCLUDED.tagline,
        phone = EXCLUDED.phone,
        formatted_phone = EXCLUDED.formatted_phone,
        whatsapp_number = EXCLUDED.whatsapp_number,
        email = EXCLUDED.email,
        owner_pin_hash = EXCLUDED.owner_pin_hash,
        custom_domain = EXCLUDED.custom_domain,
        subscription = EXCLUDED.subscription,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        service_areas = EXCLUDED.service_areas,
        primary_color = EXCLUDED.primary_color,
        accent_color = EXCLUDED.accent_color,
        operating_hours = EXCLUDED.operating_hours,
        currency_symbol = EXCLUDED.currency_symbol,
        base_dispatch_fee = EXCLUDED.base_dispatch_fee,
        rate_per_bedroom = EXCLUDED.rate_per_bedroom,
        rate_per_bathroom = EXCLUDED.rate_per_bathroom,
        services = EXCLUDED.services,
        add_ons = EXCLUDED.add_ons,
        trust = EXCLUDED.trust,
        checklist = EXCLUDED.checklist,
        gallery = EXCLUDED.gallery,
        faqs = EXCLUDED.faqs,
        updated_at = NOW()
    `;

    console.log(`✓ Seeded tenant: ${slug}`);
  }

  console.log("Database seed completed successfully.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
