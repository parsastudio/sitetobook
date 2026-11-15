# SiteToBook | Direct-Booking Engine for Residential Cleaners

<p align="center">
  <strong>Multi-tenant instant-quote SaaS and native SMS-dispatch infrastructure built with Next.js 16.4, React 19, TypeScript (Strict), and Clean Domain Architecture.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js 16.4" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.3-20232A?style=for-the-badge&logo=react" alt="React 19.3" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5_Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript Strict" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" /></a>
  <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/Drizzle_ORM-Neon_HTTP-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM" /></a>
  <a href="https://zod.dev"><img src="https://img.shields.io/badge/Zod-Single_Source_of_Truth-3E67B1?style=for-the-badge&logo=zod" alt="Zod" /></a>
</p>

---

## Why SiteToBook?

Residential cleaning companies lose high-intent mobile traffic to slow "Request a Callback" forms. **SiteToBook** turns visitors into pre-priced bookings in under 60 seconds—combining a deterministic room-rate calculator, RFC-5724 native SMS dispatch, and a PIN-locked mobile Owner Command Deck with zero booking commissions.

---

## Hard Engineering Problems Solved

| Challenge | Architectural Solution |
| --- | --- |
| **Isolated Edge Caching at Scale** | Tenant portals use Next.js 16 Cache Components (`"use cache"` + `cacheTag("tenant-{slug}")`). Updating room prices in `/[tenant]/owner` surgically purges only that tenant's edge cache via `revalidateTag` in milliseconds. |
| **Zero-Bundle Multi-Tenant Theming** | Injects only 2 CSS variables (`--primary`, `--accent`) at the route boundary; hover, active, focus, and subtle surface tokens are computed natively by the browser compositor via CSS `color-mix(in srgb, ...)`. |
| **Subdomain & Custom Domain Proxy** | `src/proxy.ts` resolves `{slug}.sitetobook.com` and white-label custom domains (`getTenantSlugByCustomDomain`) at the network boundary while skipping DB I/O on system paths and enforcing strict CSP / HSTS headers. |
| **Stateless Crypto & Auth Hardening** | Owner PINs are hashed with salted `crypto.scrypt`. HTTP-only sessions are sealed with `AES-256-GCM` (enforcing exact 12-byte IV & 16-byte AuthTag lengths against truncation), verified in constant time via `crypto.timingSafeEqual`. |
| **Distributed Rate Limiting & Fallback** | Brute-force protection on PIN/Admin/Checkout gates executes atomic Upstash Redis pipelines (`INCR`/`EXPIRE`/`TTL`) and degrades seamlessly to a bounded in-memory limiter in zero-dependency environments. |
| **Magic-Byte Media Upload Guard** | `src/services/storage.service.ts` inspects raw binary signatures (JPEG, PNG, WebP) beyond MIME headers, enforces 5MB limits, and routes uploads across Vercel Blob, Cloudinary, or Base64 fallback. |
| **Zero External Asset Dependency** | All hero, before/after split gallery, and review assets are self-hosted locally (`/public/images/`) with `next/font/google` bundled at build time—eliminating external image network failures and CLS. |

---

## Core Product & Revenue Loops

- **60-Second Quote-to-SMS Funnel**: Pure domain pricing math (`src/entities/tenant/calculator.ts`) computes base dispatch fees, bedroom/bathroom rates, tier multipliers (`1.0x` / `1.45x` / `1.8x`), and add-ons into a pre-filled native SMS booking payload.
- **PIN-Protected Owner Command Deck (`/[tenant]/owner`)**: Mobile-first keypad interface for non-technical founders to update rates, toggle add-ons, manage service neighborhoods, and publish Before/After transformations live.
- **Self-Serve Onboarding & Checkout Simulator (`/checkout`)**: Two-step tenant provisioning flow with live brand palette selection, Stripe validation simulation, receipt generation, and automatic owner session hydration.
- **Cold-Outreach Pitch Mode (`?pitch=true`)**: Built-in agency acquisition overlay allowing prospective cleaning owners to preview a pre-configured portal and claim domain ownership in one click.

---

## System Topology

src/
├── app/
│   ├── [tenant]/          # Edge-cached tenant portal, dynamic OG generator & owner deck
│   ├── actions/           # Rate-limited, Zod-validated Server Actions & cache invalidators
│   ├── admin/             # Master Admin multi-outlet provisioning gateway
│   ├── api/               # Magic-byte validated media upload & DB/memory health telemetry
│   └── checkout/          # Self-serve SaaS configurator & Stripe checkout simulator
├── components/            # Pure presentational UI islands (Calculator, Gallery, Owner Deck)
├── db/                    # Drizzle ORM PostgreSQL schema & stateless Neon HTTP client
├── entities/              # Zod Single Source of Truth schemas & deterministic pricing engine
├── lib/                   # AES-256-GCM sessions, scrypt hashing, audit logs & rate limiters
└── services/              # DAL (Neon Postgres -> JSON/memory fallback) & media adapters

---

## Quick Start & Live Sandbox

### 1. Run Locally (Zero External Services Required)

pnpm install
pnpm dev

Open `http://localhost:3000`. The platform automatically falls back to `src/data/tenants.json` and in-memory persistence if `DATABASE_URL` or `UPSTASH_REDIS_REST_URL` are not configured.

### 2. Interactive Evaluation Routes

| Route | Purpose | Demo Credentials |
| --- | --- | --- |
| `/` | SaaS Platform Landing & Live Tenant Directory | — |
| `/sparkle-pro` | Dallas Flagship Portal (`?pitch=true` for Pitch Mode) | — |
| `/azure-breeze` | Miami Multi-Theme Portal (Ocean Palette) | — |
| `/sparkle-pro/owner` | PIN-Protected Owner Command Deck | PIN: `1234` |
| `/checkout` | Self-Serve Onboarding & Stripe Checkout Flow | Test Card: `4242...` |
| `/admin` | Master Multi-Outlet Gateway | Key: `AdminPristine2026!` |
| `/api/health` | Runtime Latency, DB & Memory Telemetry | — |
