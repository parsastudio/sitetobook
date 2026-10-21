import { z } from "zod";

export const ClaimLeadInputSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  contact: z.string().min(5, "Please enter a valid phone number or email address"),
  businessName: z.string().min(1, "Business name is required"),
  city: z.string().min(1, "City is required"),
});

export type ClaimLeadInput = z.infer<typeof ClaimLeadInputSchema>;
