import Image from "next/image";
import { TrustAndProof } from "@/entities/tenant/schema";
import { ArrowUpRightIcon, GoogleLogoIcon } from "@/components/ui/icons";

interface TenantReviewsProps {
  trust: TrustAndProof;
  city: string;
  businessName?: string;
}

export function TenantReviews({ trust, city, businessName }: TenantReviewsProps) {
  const googleMapsQuery = encodeURIComponent(`${businessName ?? "SparklePro Residential Cleaners"} ${city}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;

  return (
    <section className="w-full border-t border-border-default bg-surface py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-10">
        <div className="text-center flex flex-col items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-canvas px-4 py-1.5 text-xs font-semibold text-text-primary shadow-2xs">
            <GoogleLogoIcon className="h-3.5 w-3.5" />
            <span className="text-rating font-black">★ {trust.googleRating}</span>
            <span className="text-text-muted">·</span>
            <span>{trust.googleReviewCount}+ Verified Homeowner Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-normal text-text-primary tracking-tight">
            Loved by Homeowners Across <span className="font-serif italic text-primary">{city}</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md">
            Authentic client feedback curated directly from our official Google profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {trust.reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-border-default bg-canvas p-6 shadow-2xs text-left"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-0.5 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < rev.rating ? "text-rating font-bold" : "text-border-default"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center" title="Google Review">
                    <GoogleLogoIcon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border-default flex items-center gap-3">
                {rev.avatarUrl ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border-default">
                    <Image
                      src={rev.avatarUrl}
                      alt={rev.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-text-inverse font-serif text-sm font-bold">
                    {rev.author.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-text-primary tracking-tight">
                    {rev.author}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {rev.neighborhood} · {rev.serviceUsed}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-border-default bg-canvas shadow-2xs">
          <div className="flex items-center gap-3.5 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-border-default shadow-xs">
              <GoogleLogoIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                <span>Google Business Verified</span>
                <span className="text-rating">★★★★★</span>
                <span className="text-text-muted font-normal">({trust.googleRating}/5.0)</span>
              </div>
              <span className="text-[11px] text-text-muted">
                Curated from {trust.googleReviewCount}+ authentic homeowner reviews in {city}
              </span>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-surface px-5 py-2.5 text-xs font-bold text-text-primary hover:border-primary hover:text-primary transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
          >
            <span>Read all reviews on Google Maps</span>
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
