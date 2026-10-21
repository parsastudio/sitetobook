import { CreateTenantInput, Tenant, TenantSchema } from "@/entities/tenant/schema";

export function createDefaultTenant(
  input: CreateTenantInput,
  ownerPinHash: string
): Tenant {
  return TenantSchema.parse({
    brand: {
      name: input.name,
      tagline: input.tagline,
      slug: input.slug,
      phone: input.phone,
      formattedPhone: input.phone,
      whatsappNumber: input.whatsappNumber,
      email: input.email,
      ownerPinHash,
      location: {
        city: input.city,
        state: input.state,
        serviceAreas:
          input.serviceAreas.length > 0
            ? input.serviceAreas
            : [`Downtown ${input.city}`, `North ${input.city}`, `Metro ${input.city}`],
      },
      themeOverrides: {
        primaryColor: input.primaryColor,
        accentColor: input.accentColor,
      },
      operatingHours: "Mon - Sat: 8:00 AM - 6:00 PM",
    },
    pricing: {
      currencySymbol: "$",
      baseDispatchFee: input.baseDispatchFee,
      ratePerBedroom: input.ratePerBedroom,
      ratePerBathroom: input.ratePerBathroom,
      services: [
        {
          id: "standard",
          name: "Standard Maintenance Clean",
          tagline: "Essential recurring upkeep for tidy homes",
          description:
            "Surfaces dusted, floors vacuumed and mopped, bathrooms sanitized and kitchen cleared.",
          multiplier: 1.0,
          isPopular: false,
        },
        {
          id: "deep",
          name: "Deep Sanitization Detail",
          tagline: "Intensive scrub for homes needing extra love",
          description:
            "Baseboards, tile grout, door frames, light fixtures, and heavy build-up scrubbed.",
          multiplier: 1.45,
          isPopular: true,
        },
        {
          id: "move-in-out",
          name: "Move-In / Move-Out Clean",
          tagline: "Vacant property 100% deposit return standard",
          description:
            "Comprehensive top-to-bottom scrub including inside empty closets, drawers and full wall detailing.",
          multiplier: 1.8,
          isPopular: false,
        },
      ],
      addOns: [
        {
          id: "oven",
          name: "Inside Oven Restoration",
          description: "Heavy-duty baked-on grease removal",
          price: 45,
          icon: "flame",
          enabled: true,
        },
        {
          id: "fridge",
          name: "Inside Refrigerator Sanitization",
          description: "Shelves removed, washed and deodorized",
          price: 39,
          icon: "snowflake",
          enabled: true,
        },
        {
          id: "windows",
          name: "Interior Window Panes",
          description: "Streak-free crystal clear glass",
          price: 55,
          icon: "sun",
          enabled: true,
        },
        {
          id: "cabinets",
          name: "Inside Kitchen Cabinets",
          description: "Interior shelving wiped and vacuumed",
          price: 49,
          icon: "archive",
          enabled: true,
        },
      ],
    },
    trust: {
      bondedAndInsured: true,
      insurancePolicyDetails: "$2,000,000 Commercial General Liability Policy",
      backgroundCheckGuarantee: "100% Verified Criminal Background Checked Staff",
      satisfactionGuarantee:
        "24-Hour Sparkle Guarantee: If anything is missed, we return and reclean free.",
      googleRating: 4.9,
      googleReviewCount: 88,
      reviews: [
        {
          id: "rev-new-1",
          author: "Jessica T.",
          neighborhood: `Metro ${input.city}`,
          rating: 5,
          text: `The ${input.name} crew arrived right on schedule and made our home look like a luxury hotel suite. Extremely professional and courteous!`,
          serviceUsed: "Deep Sanitization Detail",
          date: "Yesterday",
          avatarUrl:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
        },
        {
          id: "rev-new-2",
          author: "Mark B.",
          neighborhood: `Downtown ${input.city}`,
          rating: 5,
          text: "Booking online through the instant estimate took 1 minute. No back and forth calls or surprise fees. Highly recommend!",
          serviceUsed: "Standard Maintenance Clean",
          date: "Last week",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        },
      ],
    },
    checklist: [
      {
        category: "Kitchen & Dining",
        items: [
          {
            task: "Sanitize countertops & backsplash",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Clean exterior of appliances",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Scrub sink & polish fixtures",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Hand-wipe baseboards & cabinets",
            standard: false,
            deep: true,
            moveInOut: true,
          },
        ],
      },
      {
        category: "Bathrooms & Sanitation",
        items: [
          {
            task: "Scrub & disinfect toilet bowl & base",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Disinfect vanity, sink & mirrors",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Deep grout scrub & soap scum removal",
            standard: false,
            deep: true,
            moveInOut: true,
          },
        ],
      },
      {
        category: "Living Rooms & Bedrooms",
        items: [
          {
            task: "Dust all reachable furniture surfaces",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Vacuum carpets & mop hard floors",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Empty wastebaskets & replace liners",
            standard: true,
            deep: true,
            moveInOut: true,
          },
          {
            task: "Hand-wipe door frames & trim",
            standard: false,
            deep: true,
            moveInOut: true,
          },
        ],
      },
    ],
    gallery: [
      {
        id: "gal-default-1",
        title: "Chef's Gas Range & Backsplash Restoration",
        area: "Kitchen Detail",
        beforeImage:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
        afterImage:
          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
      },
    ],
  });
}
