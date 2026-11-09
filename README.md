# SiteToBook (`sitetobook.com`)

Multi-tenant direct-booking and instant-quote platform engineered for residential cleaning companies. Built with **Next.js 16.4 (App Router, Cache Components, Partial Prefetching)**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, **Drizzle ORM (Neon Serverless Postgres)**, and **Zod**.

## Core Architecture & Features

- **Multi-Tenant Dynamic Engine (`/[tenant]`):** Isolated tenant portals with dynamic CSS `color-mix` theming, localized SEO metadata, OpenGraph image generation, and custom domain routing via `src/proxy.ts`.
- **60-Second Flat-Rate Quote Calculator:** Real-time room, service multiplier, and add-on calculation with pre-filled native SMS dispatch (`sms:` RFC 5724).
- **Self-Serve Onboarding & Stripe Checkout Simulator (`/checkout`):** Interactive 2-step portal configurator and Stripe payment simulator (`4242` test card) with instant edge provisioning.
- **PIN-Protected Owner Command Deck (`/[tenant]/owner`):** Scrypt-hashed 4-digit PIN authentication, AES-256-GCM encrypted HTTP-only sessions, rate limiting, live pricing controls, and Before/After gallery management.
- **Cold-Outreach Pitch Mode (`?pitch=true`):** Turnkey agency claim banner and domain transfer workflow.
- **Master Admin Shield (`/admin`):** Timing-safe authenticated command center for multi-outlet provisioning.

## Demo Credentials

- **Owner Command Deck PIN:** `1234` (e.g. `/sparkle-pro/owner`)
- **Master Admin Gateway (`/admin`):** `AdminPristine2026!`
- **Stripe Checkout Test Card (`/checkout`):** `4242 4242 4242 4242`

## Development & Production Build

pnpm install
pnpm dev
pnpm build
