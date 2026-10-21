import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  tenantsTable,
  tenantGalleryTable,
  TenantRecord,
} from "@/db/schema";
import {
  BeforeAfterItem,
  Tenant,
  TenantSchema,
} from "@/entities/tenant/schema";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "tenants.json");

// Helper: Convert Database Row to Validated Domain Entity
function mapRecordToEntity(record: TenantRecord): Tenant {
  return TenantSchema.parse({
    brand: {
      name: record.name,
      tagline: record.tagline,
      slug: record.slug,
      phone: record.phone,
      formattedPhone: record.formattedPhone,
      whatsappNumber: record.whatsappNumber,
      email: record.email,
      ownerPinHash: record.ownerPinHash,
      customDomain: record.customDomain || undefined,
      location: {
        city: record.city,
        state: record.state,
        serviceAreas: record.serviceAreas || [],
      },
      themeOverrides: {
        primaryColor: record.primaryColor || "#0F766E",
        accentColor: record.accentColor || "#0D9488",
      },
      operatingHours: record.operatingHours || "Mon - Sat: 8:00 AM - 6:00 PM",
    },
    pricing: {
      currencySymbol: record.currencySymbol,
      baseDispatchFee: record.baseDispatchFee,
      ratePerBedroom: record.ratePerBedroom,
      ratePerBathroom: record.ratePerBathroom,
      services: record.services,
      addOns: record.addOns,
    },
    trust: record.trust,
    checklist: record.checklist,
    gallery: record.gallery,
  });
}

// Fallback JSON File Helpers (for local development without DB setup)
async function readTenantsFile(): Promise<Record<string, Tenant>> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const json = JSON.parse(raw);
    const parsedStore: Record<string, Tenant> = {};

    for (const [key, value] of Object.entries(json)) {
      const validation = TenantSchema.safeParse(value);
      if (validation.success) {
        parsedStore[key.toLowerCase()] = validation.data;
      }
    }

    return parsedStore;
  } catch {
    return {};
  }
}

async function writeTenantsFile(store: Record<string, Tenant>): Promise<void> {
  const serialized = JSON.stringify(store, null, 2);
  await fs.writeFile(DATA_FILE_PATH, serialized, "utf-8");
}

// -------------------------------------------------------------
// PUBLIC DATA ACCESS LAYER (DAL) METHODS
// -------------------------------------------------------------

export async function getTenantSlugByCustomDomain(
  customDomain: string
): Promise<string | null> {
  const normalizedDomain = customDomain.toLowerCase().trim();

  if (db) {
    try {
      const records = await db
        .select({ slug: tenantsTable.slug })
        .from(tenantsTable)
        .where(eq(tenantsTable.customDomain, normalizedDomain))
        .limit(1);

      if (records.length > 0) {
        return records[0].slug;
      }
      return null;
    } catch (error) {
      console.error(
        `Drizzle error fetching tenant by custom domain '${normalizedDomain}':`,
        error
      );
    }
  }

  const fileStore = await readTenantsFile();
  for (const tenant of Object.values(fileStore)) {
    if (tenant.brand.customDomain?.toLowerCase().trim() === normalizedDomain) {
      return tenant.brand.slug;
    }
  }
  return null;
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Production Mode: Query Drizzle ORM via Serverless HTTP Pooler
  if (db) {
    try {
      const records = await db
        .select()
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, normalizedSlug))
        .limit(1);

      if (records.length > 0) {
        const entity = mapRecordToEntity(records[0]);
        const galleryRecords = await db
          .select()
          .from(tenantGalleryTable)
          .where(eq(tenantGalleryTable.tenantId, records[0].id));

        if (galleryRecords.length > 0) {
          entity.gallery = galleryRecords.map((g) => ({
            id: g.id,
            title: g.title,
            area: g.area,
            beforeImage: g.beforeImage,
            afterImage: g.afterImage,
          }));
        }

        return entity;
      }
      return null;
    } catch (error) {
      console.error(`Drizzle error fetching tenant '${normalizedSlug}':`, error);
    }
  }

  // 2. Fallback Mode: Local File Store
  const fileStore = await readTenantsFile();
  return fileStore[normalizedSlug] ?? null;
}

export async function getAllTenants(): Promise<Tenant[]> {
  // 1. Production Mode: Fetch all via Drizzle
  if (db) {
    try {
      const records = await db.select().from(tenantsTable);
      return records.map(mapRecordToEntity);
    } catch (error) {
      console.error("Drizzle error fetching all tenants:", error);
    }
  }

  // 2. Fallback Mode: Local File Store
  const fileStore = await readTenantsFile();
  return Object.values(fileStore);
}

export async function saveTenant(tenant: Tenant): Promise<void> {
  const validated = TenantSchema.parse(tenant);
  const slug = validated.brand.slug.toLowerCase().trim();

  // 1. Production Mode: Upsert into PostgreSQL via Drizzle
  if (db) {
    try {
      await db
        .insert(tenantsTable)
        .values({
          slug,
          name: validated.brand.name,
          tagline: validated.brand.tagline,
          phone: validated.brand.phone,
          formattedPhone: validated.brand.formattedPhone,
          whatsappNumber: validated.brand.whatsappNumber,
          email: validated.brand.email,
          ownerPinHash: validated.brand.ownerPinHash,
          customDomain: validated.brand.customDomain,
          city: validated.brand.location.city,
          state: validated.brand.location.state,
          serviceAreas: validated.brand.location.serviceAreas,
          zipCodes: [],
          primaryColor: validated.brand.themeOverrides?.primaryColor || "#0F766E",
          accentColor: validated.brand.themeOverrides?.accentColor || "#0D9488",
          operatingHours: validated.brand.operatingHours,
          currencySymbol: validated.pricing.currencySymbol,
          baseDispatchFee: validated.pricing.baseDispatchFee,
          ratePerBedroom: validated.pricing.ratePerBedroom,
          ratePerBathroom: validated.pricing.ratePerBathroom,
          services: validated.pricing.services,
          addOns: validated.pricing.addOns,
          trust: validated.trust,
          checklist: validated.checklist,
          gallery: validated.gallery,
        })
        .onConflictDoUpdate({
          target: tenantsTable.slug,
          set: {
            name: validated.brand.name,
            tagline: validated.brand.tagline,
            phone: validated.brand.phone,
            formattedPhone: validated.brand.formattedPhone,
            whatsappNumber: validated.brand.whatsappNumber,
            email: validated.brand.email,
            ownerPinHash: validated.brand.ownerPinHash,
            customDomain: validated.brand.customDomain,
            city: validated.brand.location.city,
            state: validated.brand.location.state,
            serviceAreas: validated.brand.location.serviceAreas,
            primaryColor: validated.brand.themeOverrides?.primaryColor || "#0F766E",
            accentColor: validated.brand.themeOverrides?.accentColor || "#0D9488",
            operatingHours: validated.brand.operatingHours,
            currencySymbol: validated.pricing.currencySymbol,
            baseDispatchFee: validated.pricing.baseDispatchFee,
            ratePerBedroom: validated.pricing.ratePerBedroom,
            ratePerBathroom: validated.pricing.ratePerBathroom,
            services: validated.pricing.services,
            addOns: validated.pricing.addOns,
            trust: validated.trust,
            checklist: validated.checklist,
            gallery: validated.gallery,
            updatedAt: new Date(),
          },
        });
      return;
    } catch (error) {
      console.error(`Drizzle error upserting tenant '${slug}':`, error);
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Database connection is unconfigured. File mutation is forbidden in production."
    );
  }

  const fileStore = await readTenantsFile();
  fileStore[slug] = validated;
  await writeTenantsFile(fileStore);
}

export async function deleteTenant(slug: string): Promise<boolean> {
  const normalizedSlug = slug.toLowerCase().trim();

  if (db) {
    try {
      const res = await db
        .delete(tenantsTable)
        .where(eq(tenantsTable.slug, normalizedSlug));
      return (res.rowCount ?? 0) > 0;
    } catch (error) {
      console.error(`Drizzle error deleting tenant '${normalizedSlug}':`, error);
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Database connection is unconfigured. File mutation is forbidden in production."
    );
  }

  const fileStore = await readTenantsFile();
  if (!fileStore[normalizedSlug]) return false;

  delete fileStore[normalizedSlug];
  await writeTenantsFile(fileStore);
  return true;
}

export async function addTenantGalleryItem(
  slug: string,
  item: Omit<BeforeAfterItem, "id">
): Promise<BeforeAfterItem> {
  const normalizedSlug = slug.toLowerCase().trim();
  const newItemId = `gal-${Date.now()}`;

  if (db) {
    try {
      const records = await db
        .select({ id: tenantsTable.id, gallery: tenantsTable.gallery })
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, normalizedSlug))
        .limit(1);

      if (records.length > 0) {
        const tenantId = records[0].id;
        await db.insert(tenantGalleryTable).values({
          id: newItemId,
          tenantId,
          title: item.title,
          area: item.area,
          beforeImage: item.beforeImage,
          afterImage: item.afterImage,
        });

        const updatedGallery = [
          { id: newItemId, ...item },
          ...(records[0].gallery || []),
        ];

        await db
          .update(tenantsTable)
          .set({ gallery: updatedGallery, updatedAt: new Date() })
          .where(eq(tenantsTable.id, tenantId));

        return { id: newItemId, ...item };
      }
    } catch (error) {
      console.error(`Drizzle error inserting gallery item for '${normalizedSlug}':`, error);
    }
  }

  const fileStore = await readTenantsFile();
  const tenant = fileStore[normalizedSlug];
  if (!tenant) {
    throw new Error("Tenant outlet not found.");
  }

  const createdItem: BeforeAfterItem = { id: newItemId, ...item };
  tenant.gallery = [createdItem, ...tenant.gallery];
  await writeTenantsFile(fileStore);
  return createdItem;
}

export async function deleteTenantGalleryItem(
  slug: string,
  itemId: string
): Promise<boolean> {
  const normalizedSlug = slug.toLowerCase().trim();

  if (db) {
    try {
      const records = await db
        .select({ id: tenantsTable.id, gallery: tenantsTable.gallery })
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, normalizedSlug))
        .limit(1);

      if (records.length > 0) {
        const tenantId = records[0].id;
        await db
          .delete(tenantGalleryTable)
          .where(eq(tenantGalleryTable.id, itemId));

        const updatedGallery = (records[0].gallery || []).filter(
          (g) => g.id !== itemId
        );

        await db
          .update(tenantsTable)
          .set({ gallery: updatedGallery, updatedAt: new Date() })
          .where(eq(tenantsTable.id, tenantId));

        return true;
      }
    } catch (error) {
      console.error(`Drizzle error deleting gallery item for '${normalizedSlug}':`, error);
    }
  }

  const fileStore = await readTenantsFile();
  const tenant = fileStore[normalizedSlug];
  if (!tenant) return false;

  tenant.gallery = tenant.gallery.filter((g) => g.id !== itemId);
  await writeTenantsFile(fileStore);
  return true;
}
