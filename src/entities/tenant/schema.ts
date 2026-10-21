import { z } from "zod";

export const CleaningTypeSchema = z.enum(["standard", "deep", "move-in-out"]);
export type CleaningType = z.infer<typeof CleaningTypeSchema>;

export const AddOnItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  icon: z.string(),
  enabled: z.boolean().default(true),
});
export type AddOnItem = z.infer<typeof AddOnItemSchema>;

export const CleaningServiceTypeSchema = z.object({
  id: CleaningTypeSchema,
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  multiplier: z.number().positive(),
  isPopular: z.boolean().default(false),
  imageUrl: z.string().optional(),
});
export type CleaningServiceType = z.infer<typeof CleaningServiceTypeSchema>;

export const PricingConfigSchema = z.object({
  currencySymbol: z.string().default("$"),
  baseDispatchFee: z.number().nonnegative(),
  ratePerBedroom: z.number().positive(),
  ratePerBathroom: z.number().positive(),
  services: z.array(CleaningServiceTypeSchema),
  addOns: z.array(AddOnItemSchema),
});
export type PricingConfig = z.infer<typeof PricingConfigSchema>;

export const ReviewItemSchema = z.object({
  id: z.string(),
  author: z.string(),
  neighborhood: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  serviceUsed: z.string(),
  date: z.string(),
  avatarUrl: z.string().optional(),
});
export type ReviewItem = z.infer<typeof ReviewItemSchema>;

export const TrustAndProofSchema = z.object({
  bondedAndInsured: z.boolean().default(true),
  insurancePolicyDetails: z.string(),
  backgroundCheckGuarantee: z.string(),
  satisfactionGuarantee: z.string(),
  googleRating: z.number().min(1).max(5),
  googleReviewCount: z.number().int().positive(),
  reviews: z.array(ReviewItemSchema),
});
export type TrustAndProof = z.infer<typeof TrustAndProofSchema>;

export const ChecklistTaskSchema = z.object({
  task: z.string(),
  standard: z.boolean(),
  deep: z.boolean(),
  moveInOut: z.boolean(),
});
export type ChecklistTask = z.infer<typeof ChecklistTaskSchema>;

export const ChecklistCategorySchema = z.object({
  category: z.string(),
  items: z.array(ChecklistTaskSchema),
});
export type ChecklistCategory = z.infer<typeof ChecklistCategorySchema>;

export const BeforeAfterItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  area: z.string(),
  beforeImage: z.string(),
  afterImage: z.string(),
});
export type BeforeAfterItem = z.infer<typeof BeforeAfterItemSchema>;

export const FAQItemSchema = z.object({
  id: z.string(),
  question: z.string().min(5),
  answer: z.string().min(10),
  category: z.string().optional(),
});
export type FAQItem = z.infer<typeof FAQItemSchema>;

export const BrandConfigSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  phone: z.string(),
  formattedPhone: z.string(),
  whatsappNumber: z.string(),
  email: z.string().email(),
  ownerPinHash: z.string().min(10),
  customDomain: z.string().optional(),
  location: z.object({
    city: z.string(),
    state: z.string(),
    serviceAreas: z.array(z.string()),
  }),
  themeOverrides: z
    .object({
      primaryColor: z.string().optional(),
      accentColor: z.string().optional(),
    })
    .optional(),
  operatingHours: z.string(),
});
export type BrandConfig = z.infer<typeof BrandConfigSchema>;

export const OwnerSettingsUpdateSchema = z.object({
  baseDispatchFee: z.coerce.number().min(0),
  ratePerBedroom: z.coerce.number().min(1),
  ratePerBathroom: z.coerce.number().min(1),
  addOns: z.array(
    z.object({
      id: z.string(),
      price: z.coerce.number().min(0),
      enabled: z.boolean(),
    })
  ),
  phone: z.string().min(7, "Valid phone number required"),
  whatsappNumber: z
    .string()
    .regex(/^\d+$/, "WhatsApp number must be numeric only (e.g. 12145550189)"),
  serviceAreas: z.array(z.string()).default([]),
});
export type OwnerSettingsUpdate = z.infer<typeof OwnerSettingsUpdateSchema>;

export const TenantSchema = z.object({
  brand: BrandConfigSchema,
  pricing: PricingConfigSchema,
  trust: TrustAndProofSchema,
  checklist: z.array(ChecklistCategorySchema),
  gallery: z.array(BeforeAfterItemSchema),
  faqs: z.array(FAQItemSchema).default([]),
});
export type Tenant = z.infer<typeof TenantSchema>;

export const PublicBrandConfigSchema = BrandConfigSchema.omit({
  ownerPinHash: true,
});
export type PublicBrandConfig = z.infer<typeof PublicBrandConfigSchema>;

export const PublicTenantSchema = TenantSchema.extend({
  brand: PublicBrandConfigSchema,
});
export type PublicTenant = z.infer<typeof PublicTenantSchema>;

export function sanitizeTenantForPublic(tenant: Tenant): PublicTenant {
  const { ownerPinHash: _omitted, ...safeBrand } = tenant.brand;
  return {
    ...tenant,
    brand: safeBrand,
  };
}

export const QuoteCalculationInputSchema = z.object({
  bedrooms: z.number().int().min(0).max(10),
  bathrooms: z.number().min(1).max(10),
  serviceType: CleaningTypeSchema,
  selectedAddOnIds: z.array(z.string()),
});
export type QuoteCalculationInput = z.infer<typeof QuoteCalculationInputSchema>;

export const QuoteCalculationResultSchema = z.object({
  baseSubtotal: z.number(),
  serviceMultiplier: z.number(),
  serviceTotal: z.number(),
  addOnsTotal: z.number(),
  finalEstimatedTotal: z.number(),
  currencySymbol: z.string(),
  summaryText: z.string(),
});
export type QuoteCalculationResult = z.infer<typeof QuoteCalculationResultSchema>;

export const CreateTenantInputSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  tagline: z.string().min(5, "Tagline is required").default("Premier Hotel-Standard Residential Cleaning"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State abbreviation is required (e.g. TX, CA)"),
  phone: z.string().min(7, "Phone number is required"),
  whatsappNumber: z
    .string()
    .regex(/^\d+$/, "WhatsApp number must be numeric only including country code (e.g. 12145550189)"),
  email: z.string().email("Valid business email required"),
  primaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid primary hex color")
    .default("#0F766E"),
  accentColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid accent hex color")
    .default("#0D9488"),
  baseDispatchFee: z.coerce.number().min(0).default(49),
  ratePerBedroom: z.coerce.number().min(1).default(35),
  ratePerBathroom: z.coerce.number().min(1).default(40),
  serviceAreas: z.array(z.string()).default([]),
});
export type CreateTenantInput = z.infer<typeof CreateTenantInputSchema>;
