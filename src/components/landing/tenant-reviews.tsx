import Image from "next/image";
import { TrustAndProof } from "@/entities/tenant/schema";

interface TenantReviewsProps {
  trust: TrustAndProof;
  city: string;
}

export function TenantReviews({ trust, city }: TenantReviewsProps) {
  return (
    <section className="w-full border-t border-border-default bg-surface py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-10">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-canvas px-3.5 py-1 text-xs font-semibold text-text-primary shadow-xs">
            <span className="text-rating font-black">★ {trust.googleRating}</span>
            <span className="text-text-muted">·</span>
            <span>{trust.googleReviewCount}+ Verified Google Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
            Loved by Homeowners Across {city}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Verified feedback from local residential clients who booked online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {trust.reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-border-default bg-canvas p-6 shadow-xs text-left"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rating font-black tracking-wider">★★★★★</span>
                  <span className="text-[11px] text-text-muted font-medium">{rev.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-black text-primary">
                    {rev.author.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-black text-text-primary flex items-center gap-1.5">
                    {rev.author}
                    <span className="text-[9px] font-bold text-success bg-success-subtle px-1.5 py-0.2 rounded-full">✓ Verified</span>
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {rev.neighborhood} · {rev.serviceUsed}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
