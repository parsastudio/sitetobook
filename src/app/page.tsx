import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getAllTenants } from "@/services/tenant.service";

export const instant = false;

export default async function HomePage() {
  "use cache";
  cacheLife("days");
  cacheTag("all-tenants");

  const tenants = await getAllTenants();

  const flagship = tenants[0];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-canvas px-4 py-12 sm:px-8 sm:py-20">
      <main className="w-full max-w-3xl flex flex-col items-center gap-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-4 py-1 text-xs font-bold text-text-primary shadow-xs">
          <span className="h-2 w-2 rounded-full bg-primary" />
          High-Converting Residential Cleaning Platform
        </div>

        <div className="flex flex-col gap-3 max-w-xl">
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-text-primary leading-tight">
            Flagship Client Site <span className="font-serif italic text-primary">Demo</span>
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Engineered for residential cleaning founders. Instant room calculators, direct SMS dispatch pipeline, and $2M liability proof.
          </p>
        </div>

        {flagship && (
          <div className="w-full rounded-3xl border border-primary/20 bg-surface p-6 sm:p-8 shadow-xl flex flex-col gap-6 text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Flagship Demo
                </span>
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  {flagship.brand.name}
                </h2>
                <span className="text-xs font-medium text-text-secondary">
                  {flagship.brand.location.city}, {flagship.brand.location.state}
                </span>
              </div>
              <span className="rounded-xl bg-subtle px-3 py-1 text-xs font-bold text-rating">
                ★ {flagship.trust.googleRating} ({flagship.trust.googleReviewCount})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {flagship.brand.tagline}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-border-default">
              <span className="text-xs text-text-muted font-medium">
                /{flagship.brand.slug}
              </span>
              <div className="flex items-center gap-2.5">
                <Link
                  href={`/${flagship.brand.slug}?pitch=true`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl border border-border-default bg-surface px-5 py-2.5 text-xs font-bold text-text-primary hover:border-primary transition-colors text-center"
                >
                  Pitch Mode 🎯
                </Link>
                <Link
                  href={`/${flagship.brand.slug}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-text-inverse hover:bg-primary-hover shadow-md transition-all active:scale-[0.98] text-center"
                >
                  Launch Live Demo →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs font-bold text-text-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">
            Admin Gateway 🔒
          </Link>
          <span>·</span>
          <Link href={`/${flagship?.brand.slug}/owner`} className="hover:text-primary transition-colors">
            Owner Command Portal ⚙️
          </Link>
        </div>
      </main>
    </div>
  );
}
