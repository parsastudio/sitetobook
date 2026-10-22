import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { getAllTenants, getTenantBySlug } from "@/services/tenant.service";
import { sanitizeTenantForPublic, Tenant } from "@/entities/tenant/schema";
import TenantLoadingSkeleton from "@/app/[tenant]/loading";
import { QuoteCalculator } from "@/components/calculator/quote-calculator";
import { BeforeAfterSlider } from "@/components/visualizer/before-after-slider";
import { TenantHero } from "@/components/landing/tenant-hero";
import { TenantHowItWorks } from "@/components/landing/tenant-how-it-works";
import { TenantTrustStrip } from "@/components/landing/tenant-trust-strip";
import { TenantChecklist } from "@/components/landing/tenant-checklist";
import { TenantFaq } from "@/components/landing/tenant-faq";
import { TenantReviews } from "@/components/landing/tenant-reviews";
import { PinLocationIcon } from "@/components/ui/icons";

export const instant = false;

interface TenantPageProps {
  params: Promise<{ tenant: string }>;
}

export async function generateStaticParams() {
  const tenants = await getAllTenants();
  return tenants.map((tenant) => ({
    tenant: tenant.brand.slug,
  }));
}

async function CachedTenantLandingView({ slug }: { slug: string }) {
  "use cache";
  cacheLife("days");
  cacheTag(`tenant-${slug}`);

  const tenant: Tenant | null = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const publicTenant = sanitizeTenantForPublic(tenant);
  const { brand, trust, checklist, gallery, faqs } = publicTenant;

  return (
    <div className="flex flex-col items-center w-full">
      <TenantHero brand={brand} trust={trust} />
      <TenantTrustStrip />

      <section id="before-after" className="w-full bg-surface py-16 px-4 sm:px-6 border-b border-border-default scroll-mt-20">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Real Local Proof
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-text-primary tracking-tight">
              Before & After <span className="font-serif italic text-primary">Transformations</span>
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md">
              Slide to see the difference our deep sanitization makes in actual {brand.location.city} homes.
            </p>
          </div>
          <BeforeAfterSlider items={gallery} />
        </div>
      </section>

      <div id="how-it-works" className="w-full scroll-mt-20">
        <TenantHowItWorks />
      </div>

      <section id="quote-calculator" className="w-full px-4 py-14 sm:px-6 bg-canvas border-b border-border-default scroll-mt-20">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl sm:text-4xl font-normal text-text-primary tracking-tight">
            Calculate Your <span className="font-serif italic text-primary">Flat Rate</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mb-3 font-medium">
            Transparent upfront pricing with zero hidden fees or surprises.
          </p>
          <QuoteCalculator tenant={publicTenant} />
        </div>
      </section>

      <div id="checklist" className="w-full scroll-mt-20">
        <TenantChecklist checklist={checklist} />
      </div>

      <div id="faq" className="w-full scroll-mt-20">
        <TenantFaq faqs={faqs} />
      </div>

      <section className="w-full bg-canvas py-12 px-4 sm:px-6 border-t border-border-default">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Coverage Area
          </span>
          <h3 className="text-xl font-bold text-text-primary">
            Serving Premier Neighborhoods in {brand.location.city}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
            {brand.location.serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-surface px-4 py-1.5 text-xs font-bold text-text-secondary shadow-xs hover:border-primary/50 transition-colors"
              >
                <PinLocationIcon className="h-3.5 w-3.5 text-primary" />
                <span>{area}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div id="reviews" className="w-full scroll-mt-20">
        <TenantReviews trust={trust} city={brand.location.city} businessName={brand.name} />
      </div>
    </div>
  );
}

async function TenantLandingResolver({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  return <CachedTenantLandingView slug={slug} />;
}

export default function TenantPage({ params }: TenantPageProps) {
  return (
    <Suspense fallback={<TenantLoadingSkeleton />}>
      <TenantLandingResolver params={params} />
    </Suspense>
  );
}
