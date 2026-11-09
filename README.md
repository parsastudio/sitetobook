# SiteToBook | Direct-Booking Engine for Residential Cleaners

<p align="center">
  <strong>A multi-tenant instant-quote and SMS-dispatch SaaS platform engineered with Next.js 16.4, React 19, TypeScript, and Clean Domain Architecture.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js 16.4" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.3-20232A?style=for-the-badge&logo=react" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.x_Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" /></a>
  <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/Drizzle_ORM-Neon_Serverless-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM" /></a>
  <a href="https://zod.dev"><img src="https://img.shields.io/badge/Zod-Single_Source_of_Truth-3E67B1?style=for-the-badge&logo=zod" alt="Zod" /></a>
</p>

---

## Overview

**SiteToBook** (`sitetobook.com`) replaces slow, low-converting "Request a Callback" forms for residential cleaning companies with a 60-second flat-rate room calculator and direct RFC-5724 native SMS dispatch. 

The platform operates as a turnkey multi-tenant SaaS where cleaning founders can configure a custom-branded portal, process subscription licensing, and manage live room rates from a PIN-protected mobile command deck with instant edge cache invalidation.

---

## Architectural Engineering & Core Challenges Solved

- **Fine-Grained Edge Caching & On-Demand Invalidation (`"use cache"`)**: Tenant landing portals are statically cached at the edge via Next.js 16 `cacheTag("tenant-{slug}")`. When an owner updates room rates or toggles add-ons in their command deck, surgical `revalidateTag` calls purge only that specific tenant's edge cache in milliseconds without rebuilding sibling outlets.
- **Zero-Runtime-Cost Dynamic Multi-Tenant Theming**: Instead of generating per-tenant CSS bundles or relying on heavy JavaScript style injection, each tenant injects two root CSS variables (`--primary`, `--accent`). All interactive hover, active, focus, and subtle surface tokens are derived natively in the browser compositor using CSS `color-mix(in srgb, ...)`.
- **Subdomain & Custom Domain Proxy Resolution (`src/proxy.ts`)**: Request routing inspects host headers at the network boundary to transparently rewrite wildcard subdomains (`{slug}.sitetobook.com`) and white-label custom domains to isolated tenant trees while enforcing strict Content-Security-Policy (CSP) headers and bypassing database I/O on system routes.
- **Stateless Cryptographic Sessions & Timing-Safe Auth**: Owner PINs are hashed with salted `crypto.scrypt`. Sessions are sealed inside HTTP-only cookies using `AES-256-GCM` with strict 12-byte IV and 16-byte authentication tag verification to prevent signature truncation attacks. Admin and PIN verification execute in constant time via `crypto.timingSafeEqual`.
- **Zero-CLS Interactive Before/After Visualizer**: The touch-and-keyboard accessible comparison slider uses GPU-accelerated `clip-path: inset(...)` masking rather than layout-shifting DOM width recalculations or `ResizeObserver` loops, maintaining a 0.00 Cumulative Layout Shift (CLS) during SSR hydration.
- **Hybrid Storage & Rate-Limiting Resilience**: Data access and brute-force protection seamlessly degrade from Neon HTTP Serverless Postgres and Upstash Redis pipelines to an in-memory/file fallback, ensuring 100% uptime in both distributed production and zero-dependency sandbox environments.

---

## Core Product Loop

1. **Instant Quote-to-SMS Funnel**: Deterministic pricing engine (`src/entities/tenant/calculator.ts`) computes base dispatch fees, bedroom/bathroom rates, service tier multipliers (*Standard 1.0x*, *Deep 1.45x*, *Move-In/Out 1.8x*), and add-ons, compiling a pre-filled native SMS booking payload.
2. **Self-Serve Onboarding & Stripe Checkout Simulator (`/checkout`)**: Two-step portal provisioning flow featuring live brand palette selection, Stripe card validation, and automatic owner session hydration upon receipt generation.
3. **Cold-Outreach Pitch Mode (`?pitch=true`)**: Built-in agency acquisition banner allowing prospective business owners to preview a pre-configured portal for their company and claim domain ownership in one click.
4. **PIN-Protected Owner Command Deck (`/[tenant]/owner`)**: Mobile-first keypad interface enabling non-technical founders to adjust pricing, manage service neighborhoods, and upload binary-validated (magic-byte checked) Before/After transformations.

---

## System Topology

src/
├── app/
│   ├── [tenant]/                # Isolated tenant portal, dynamic OG image generator & owner deck
│   ├── actions/                 # Rate-limited, Zod-validated Server Actions & cache invalidators
│   ├── admin/                   # Master Admin gateway for multi-outlet fleet management
│   ├── api/                     # Magic-byte validated media upload & health telemetry endpoints
│   └── checkout/                # Self-serve SaaS configurator & Stripe checkout simulator
├── components/                  # Pure presentational UI islands (Calculator, Slider, Owner Deck)
├── db/                          # Drizzle ORM PostgreSQL schema & stateless Neon HTTP client
├── entities/                    # Pure domain schemas (Zod Single Source of Truth) & pricing math
├── lib/                         # AES-256-GCM session crypto, scrypt hashing & IP rate limiters
└── services/                    # Data Access Layer (DAL) & multi-cloud media storage adapters

---

## Tech Stack

| Layer                  | Technology                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Framework**          | [Next.js 16.4](https://nextjs.org/) (App Router, Cache Components, Partial Prefetching)    |
| **Language & Runtime** | [React 19.3](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) (Strict) |
| **Styling & Tokens**   | [Tailwind CSS v4](https://tailwindcss.com/) + Dynamic CSS `color-mix` Theme Engine         |
| **Domain Validation**  | [Zod](https://zod.dev/) (End-to-end schema inference across DB, Actions, and Forms)        |
| **Database & ORM**     | [Drizzle ORM](https://orm.drizzle.team/) + [Neon Serverless HTTP Driver](https://neon.com) |
| **Security & Crypto**  | Node `crypto` (`scrypt`, `AES-256-GCM`, `timingSafeEqual`) + Upstash Redis Rate Limiting   |

---

## License

Released under the MIT License.
