import { z } from "zod";

export const BillingCycleSchema = z.enum(["monthly", "annual"]);
export type BillingCycle = z.infer<typeof BillingCycleSchema>;

export const SaasPlanIdSchema = z.enum(["starter", "growth", "agency"]);
export type SaasPlanId = z.infer<typeof SaasPlanIdSchema>;

export const SaasPlanSchema = z.object({
  id: SaasPlanIdSchema,
  name: z.string(),
  badge: z.string(),
  description: z.string(),
  monthlyPrice: z.number().positive(),
  annualMonthlyPrice: z.number().positive(),
  isPopular: z.boolean().default(false),
  ctaLabel: z.string(),
  features: z.array(z.string()),
});
export type SaasPlan = z.infer<typeof SaasPlanSchema>;

export const SAAS_PLANS: SaasPlan[] = [
  {
    id: "starter",
    name: "Solo Operator",
    badge: "Essential",
    description: "Built for independent residential cleaners replacing manual phone estimates.",
    monthlyPrice: 49,
    annualMonthlyPrice: 39,
    isPopular: false,
    ctaLabel: "Launch Starter Portal",
    features: [
      "Instant 60-Second Room & Add-On Calculator",
      "Direct Pre-Filled SMS Quote Dispatch",
      "40-Point Interactive Scope Checklist",
      "PIN-Protected Owner Pricing Deck",
      "Hosted on Ultra-Fast Edge Subdomain",
    ],
  },
  {
    id: "growth",
    name: "Growth Fleet",
    badge: "Most Popular",
    description: "Complete conversion engine for growing crews scaling local residential routes.",
    monthlyPrice: 99,
    annualMonthlyPrice: 79,
    isPopular: true,
    ctaLabel: "Start Growth Plan",
    features: [
      "Everything in Solo Operator, plus:",
      "Interactive Before & After Photo Sliders",
      "Custom Domain Connection + Auto SSL",
      "Dynamic Brand Theme & Color Engine",
      "Verified Google Reviews & $2M Trust Strip",
      "Unlimited Gallery Showcase Uploads",
    ],
  },
  {
    id: "agency",
    name: "Multi-City Enterprise",
    badge: "White-Label",
    description: "Turnkey multi-tenant command center for franchises and lead-gen agencies.",
    monthlyPrice: 249,
    annualMonthlyPrice: 199,
    isPopular: false,
    ctaLabel: "Deploy Agency Suite",
    features: [
      "Everything in Growth Fleet, plus:",
      "Up to 15 Active City Portals Included",
      "Built-In 'Claim This Site' Cold Pitch Mode",
      "Real-Time Webhook Lead Dispatch Pipeline",
      "Master Admin Multi-Outlet Command Gateway",
      "Priority Edge Cache & Custom Onboarding",
    ],
  },
];
