import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getAllTenants } from "@/services/tenant.service";
import { SaasPricingSection } from "@/components/saas/saas-pricing-section";
import {
  SparkleIcon,
  SpeedIcon,
  MessageTextIcon,
  ShieldCheckIcon,
  CurrencyIcon,
  ArrowUpRightIcon,
} from "@/components/ui/icons";

export const instant = false;

export default async function HomePage() {
  "use cache";
  cacheLife("days");
  cacheTag("all-tenants");

  const tenants = await getAllTenants();
  const flagship = tenants[0];

  const platformPillars = [
    {
      title: "60-Second Flat-Rate Quote Engine",
      description:
        "Eliminate phone tag. Homeowners select bedrooms, bathrooms, service tier, and add-ons for an instant guaranteed price.",
      Icon: CurrencyIcon,
      metric: "3.4x Higher Conversion",
    },
    {
      title: "Direct Quote-to-SMS Dispatch",
      description:
        "Zero app downloads or complex CRMs. Estimates pre-fill directly into native iOS/Android SMS with full room breakdowns.",
      Icon: MessageTextIcon,
      metric: "< 90s Avg Response",
    },
    {
      title: "Interactive Before & After Proof",
      description:
        "Touch-responsive comparison sliders showcase real local kitchen, oven, and bathroom restorations to justify premium rates.",
      Icon: SparkleIcon,
      metric: "+42% Deep-Clean Upsell",
    },
    {
      title: "PIN-Protected Owner Command Deck",
      description:
        "Adjust room rates, toggle add-on pricing, and upload new gallery transformations from your phone in 10 seconds.",
      Icon: SpeedIcon,
      metric: "Zero Technical Skills",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary">
      {/* SaaS Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border-default bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-text-inverse shadow-xs">
              <SparkleIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-base font-extrabold tracking-tight text-text-primary">
                PristineClean<span className="text-primary">.os</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted mt-0.5">
                Multi-Tenant Cleaning SaaS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-text-secondary">
            <a href="#live-demos" className="hover:text-primary transition-colors">
              Live Client Portals
            </a>
            <a href="#architecture" className="hover:text-primary transition-colors">
              Platform Features
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing Plans
            </a>
            {flagship && (
              <Link
                href={`/${flagship.brand.slug}/owner`}
                className="hover:text-primary transition-colors"
              >
                Owner Deck Demo (PIN: 1234)
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center rounded-xl border border-border-default bg-canvas px-3.5 py-2 text-xs font-bold text-text-primary hover:border-primary transition-colors"
            >
              Admin Gateway
            </Link>
            <Link
              href="/checkout?plan=growth&billing=annual"
              className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover px-4 py-2 text-xs font-black text-text-inverse shadow-xs transition-all active:scale-95"
            >
              <span>Launch Your Portal</span>
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 border-b border-border-default">
          <div className="mx-auto max-w-5xl flex flex-col items-center text-center gap-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-subtle px-4 py-1.5 text-xs font-bold text-primary shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Turnkey Operating System for Residential Cleaning Founders</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-text-primary leading-[1.08] max-w-4xl">
              Turn Website Visitors Into{" "}
              <span className="font-serif italic font-medium text-primary">
                Pre-Priced SMS Bookings
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-text-secondary max-w-2xl leading-relaxed font-medium">
              Stop losing high-margin residential jobs to slow quote forms. Deploy a custom-branded cleaning portal with an instant room calculator, $2M trust proof, and direct SMS dispatch in 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto pt-2">
              <Link
                href="/checkout?plan=growth&billing=annual"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover px-8 py-4 text-sm sm:text-base font-black text-text-inverse shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Build Your Cleaning Portal Now</span>
                <span>→</span>
              </Link>

              {flagship && (
                <Link
                  href={`/${flagship.brand.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border-default bg-surface hover:border-primary px-7 py-4 text-sm sm:text-base font-extrabold text-text-primary shadow-xs transition-all"
                >
                  <span>Explore Flagship Demo</span>
                  <ArrowUpRightIcon className="h-4 w-4 text-primary" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-8 mt-4 border-t border-border-default w-full max-w-3xl text-center">
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">0.4s</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                  Edge Load Time
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">60s</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                  Instant Quote Flow
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">0%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                  Booking Commission
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">100%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                  Mobile SMS Native
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Multi-Tenant Showcase */}
        <section id="live-demos" className="w-full py-20 px-4 sm:px-6 bg-surface border-b border-border-default scroll-mt-16">
          <div className="mx-auto max-w-6xl flex flex-col items-center gap-12">
            <div className="flex flex-col items-center text-center gap-2.5 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                Live Multi-Tenant Production Outlets
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-text-primary">
                Test-Drive Active <span className="font-serif italic text-primary">Client Portals</span>
              </h2>
              <p className="text-xs sm:text-base text-text-secondary">
                Each outlet below runs on our isolated tenant engine with custom brand theming, localized city SEO, and real-time PIN pricing controls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {tenants.map((t) => {
                const primaryHex = t.brand.themeOverrides?.primaryColor || "#0a3326";
                const accentHex = t.brand.themeOverrides?.accentColor || "#115e45";

                return (
                  <div
                    key={t.brand.slug}
                    className="group flex flex-col justify-between rounded-3xl border border-border-default bg-canvas p-6 shadow-xs transition-all hover:border-primary hover:shadow-xl text-left"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-surface px-3 py-1 text-[11px] font-extrabold text-text-primary">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: primaryHex }}
                          />
                          <span>
                            {t.brand.location.city}, {t.brand.location.state}
                          </span>
                        </span>
                        <span className="rounded-lg bg-rating-subtle px-2.5 py-1 text-xs font-black text-rating">
                          ★ {t.trust.googleRating} ({t.trust.googleReviewCount})
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-serif font-bold text-text-primary group-hover:text-primary transition-colors">
                          {t.brand.name}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {t.brand.tagline}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border-default bg-surface p-3 text-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase text-text-muted">Base Fee</span>
                          <span className="text-sm font-black text-text-primary">
                            ${t.pricing.baseDispatchFee}
                          </span>
                        </div>
                        <div className="flex flex-col border-x border-border-subtle">
                          <span className="text-[10px] font-bold uppercase text-text-muted">Per Bed</span>
                          <span className="text-sm font-black text-text-primary">
                            +${t.pricing.ratePerBedroom}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase text-text-muted">Per Bath</span>
                          <span className="text-sm font-black text-text-primary">
                            +${t.pricing.ratePerBathroom}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {t.brand.location.serviceAreas.slice(0, 4).map((area) => (
                          <span
                            key={area}
                            className="rounded-lg border border-border-default bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-muted"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border-default flex flex-col gap-2">
                      <Link
                        href={`/${t.brand.slug}`}
                        style={{ backgroundColor: primaryHex }}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black text-white shadow-xs transition-transform hover:opacity-95 active:scale-[0.98]"
                      >
                        <span>Launch Live Site</span>
                        <ArrowUpRightIcon className="h-3.5 w-3.5" />
                      </Link>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/${t.brand.slug}?pitch=true`}
                          className="inline-flex items-center justify-center rounded-xl border border-border-default bg-surface px-3 py-2 text-[11px] font-bold text-text-primary hover:border-primary transition-colors"
                        >
                          Pitch Mode
                        </Link>
                        <Link
                          href={`/${t.brand.slug}/owner`}
                          style={{ color: accentHex }}
                          className="inline-flex items-center justify-center rounded-xl border border-border-default bg-surface px-3 py-2 text-[11px] font-extrabold hover:border-primary transition-colors"
                        >
                          Owner Deck
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Architecture & Conversion Pillars */}
        <section id="architecture" className="w-full py-20 px-4 sm:px-6 bg-canvas scroll-mt-16">
          <div className="mx-auto max-w-6xl flex flex-col items-center gap-12">
            <div className="flex flex-col items-center text-center gap-2.5 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                Engineered for High-Ticket Residential Bookings
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-text-primary">
                Why Top Cleaning Crews Switch to{" "}
                <span className="font-serif italic text-primary">PristineClean</span>
              </h2>
              <p className="text-xs sm:text-base text-text-secondary">
                Every component is purpose-built to remove homeowner hesitation and lock in recurring bi-weekly and deep-cleaning clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {platformPillars.map(({ title, description, Icon, metric }) => (
                <div
                  key={title}
                  className="flex flex-col justify-between rounded-3xl border border-border-default bg-surface p-7 shadow-2xs text-left hover:border-primary/40 transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/15">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-subtle px-3 py-1 text-[11px] font-extrabold text-primary border border-border-default">
                        {metric}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Owner Command Deck Callout */}
            {flagship && (
              <div className="w-full rounded-3xl border border-primary/25 bg-surface p-6 sm:p-10 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 text-left">
                <div className="flex flex-col gap-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Interactive Sandbox Available</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-normal text-text-primary tracking-tight">
                    Test the <span className="font-serif italic text-primary">Owner Command Deck</span> Live
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Enter demo PIN <strong className="font-mono text-primary bg-primary-subtle px-1.5 py-0.5 rounded">1234</strong> on our flagship outlet to modify room rates, toggle add-ons, and watch edge caches update in real time.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                  <Link
                    href={`/${flagship.brand.slug}/owner`}
                    className="inline-flex items-center justify-center rounded-2xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-xs sm:text-sm font-black text-text-inverse shadow-sm transition-all"
                  >
                    Open Owner Deck (PIN: 1234) →
                  </Link>
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center rounded-2xl border border-border-default bg-canvas hover:border-primary px-5 py-3.5 text-xs sm:text-sm font-bold text-text-primary transition-all"
                  >
                    Master Admin Gateway
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SaaS Pricing Section */}
        <SaasPricingSection />
      </main>

      {/* SaaS Footer */}
      <footer className="w-full border-t border-border-default bg-canvas py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-text-muted">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-text-inverse">
              <SparkleIcon className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-text-primary">
              PristineClean.os
            </span>
            <span>·</span>
            <span>Multi-Tenant Residential Cleaning Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold text-text-secondary">
            <a href="#live-demos" className="hover:text-primary transition-colors">
              Live Outlets
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
            <Link href="/checkout?plan=growth&billing=annual" className="hover:text-primary transition-colors">
              Self-Serve Onboarding
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Shield
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
