import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import {
  AddOnItem,
  BeforeAfterItem,
  ChecklistCategory,
  CleaningServiceType,
  DEFAULT_ACCENT_COLOR,
  DEFAULT_PRIMARY_COLOR,
  FAQItem,
  ReviewItem,
} from "@/entities/tenant/schema";

export const tenantsTable = pgTable("tenants", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  formattedPhone: varchar("formatted_phone", { length: 32 }).notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 32 }).notNull(),
  email: varchar("email", { length: 128 }).notNull(),
  ownerPinHash: text("owner_pin_hash").notNull(),
  customDomain: varchar("custom_domain", { length: 128 }).unique(),
  city: varchar("city", { length: 64 }).notNull(),
  state: varchar("state", { length: 8 }).notNull(),
  serviceAreas: jsonb("service_areas").$type<string[]>().notNull().default([]),
  primaryColor: varchar("primary_color", { length: 16 }).default(DEFAULT_PRIMARY_COLOR),
  accentColor: varchar("accent_color", { length: 16 }).default(DEFAULT_ACCENT_COLOR),
  operatingHours: text("operating_hours").default("Mon - Sat: 8:00 AM - 6:00 PM"),
  currencySymbol: varchar("currency_symbol", { length: 8 }).default("$").notNull(),
  baseDispatchFee: integer("base_dispatch_fee").notNull().default(49),
  ratePerBedroom: integer("rate_per_bedroom").notNull().default(35),
  ratePerBathroom: integer("rate_per_bathroom").notNull().default(40),
  services: jsonb("services").$type<CleaningServiceType[]>().notNull().default([]),
  addOns: jsonb("add_ons").$type<AddOnItem[]>().notNull().default([]),
  trust: jsonb("trust").$type<{
    bondedAndInsured: boolean;
    insurancePolicyDetails: string;
    backgroundCheckGuarantee: string;
    satisfactionGuarantee: string;
    googleRating: number;
    googleReviewCount: number;
    reviews: ReviewItem[];
  }>().notNull(),
  checklist: jsonb("checklist").$type<ChecklistCategory[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<BeforeAfterItem[]>().notNull().default([]),
  faqs: jsonb("faqs").$type<FAQItem[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TenantRecord = typeof tenantsTable.$inferSelect;
export type NewTenantRecord = typeof tenantsTable.$inferInsert;
