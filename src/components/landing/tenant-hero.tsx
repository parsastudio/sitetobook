import Image from "next/image";
import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";
import { ScrollToCalculatorButton } from "@/components/landing/scroll-to-calculator-button";

interface TenantHeroProps {
  brand: PublicBrandConfig;
  trust?: TrustAndProof;
}

export function TenantHero({ brand, trust }: TenantHeroProps) {
  const ratingValue = trust?.googleRating ?? 4.9;
  const reviewCount = trust?.googleReviewCount ?? 190;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-3.5 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20">
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt={`${brand.name} luxury spotless home interior`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-slate-950/50 backdrop-brightness-[0.92]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl flex flex-col items-center">
        <div className="w-full max-w-3xl rounded-2xl sm:rounded-4xl border border-white/60 bg-white/95 p-4 sm:p-10 lg:p-12 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl flex flex-col items-center text-center gap-5 sm:gap-6">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-text-primary leading-[1.14] sm:leading-[1.12]">
              Hotel-Standard Cleaning,{" "}
              <span className="font-serif italic font-medium text-primary">
                Flat Upfront Rates
              </span>
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-medium">
              {brand.tagline}. High-filtration HEPA equipment, verified background-cleared specialists, and direct dispatch to your doorstep.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 pt-1 w-full sm:w-auto">
            <ScrollToCalculatorButton className="inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-primary hover:bg-primary-hover px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-base font-black text-text-inverse shadow-[0_10px_28px_-4px_rgba(10,51,38,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20 transition-all hover:scale-[1.02] hover:shadow-[0_14px_32px_-4px_rgba(10,51,38,0.55)] active:scale-[0.98] whitespace-nowrap cursor-pointer">
              Calculate Flat Price in 60s ↓
            </ScrollToCalculatorButton>

            <a
              href={`sms:${brand.phone}?&body=${encodeURIComponent("Hi! I would like to check available cleaning slots this week in " + brand.location.city + ".")}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-border-default bg-surface hover:border-primary hover:text-primary px-5 py-3.5 sm:px-7 sm:py-4 text-xs sm:text-base font-extrabold text-text-primary shadow-xs transition-all active:scale-[0.98] whitespace-nowrap"
            >
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />
              <span>Text Us Now</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 pt-3 sm:pt-4 border-t border-border-default w-full max-w-xl">
            <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl sm:rounded-2xl border border-border-default bg-subtle/80 p-1.5 sm:p-3 min-w-0">
              <span className="font-serif lining-nums text-base sm:text-2xl font-bold text-text-primary tracking-tight leading-none">
                $2M
              </span>
              <span className="text-[9px] sm:text-[11px] font-extrabold text-primary uppercase tracking-tight sm:tracking-wider text-center mt-0.5">
                Hiscox Policy
              </span>
              <span className="text-[8px] sm:text-[10px] text-text-muted font-semibold text-center leading-none mt-0.5">
                Full Coverage
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl sm:rounded-2xl border border-border-default bg-subtle/80 p-1.5 sm:p-3 min-w-0">
              <span className="font-serif lining-nums text-base sm:text-2xl font-bold text-text-primary tracking-tight leading-none">
                100%
              </span>
              <span className="text-[9px] sm:text-[11px] font-extrabold text-primary uppercase tracking-tight sm:tracking-wider text-center mt-0.5">
                Vetted Staff
              </span>
              <span className="text-[8px] sm:text-[10px] text-text-muted font-semibold text-center leading-none mt-0.5">
                Background Checked
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl sm:rounded-2xl border border-border-default bg-subtle/80 p-1.5 sm:p-3 min-w-0">
              <span className="font-serif lining-nums text-base sm:text-2xl font-bold text-text-primary tracking-tight leading-none">
                24h
              </span>
              <span className="text-[9px] sm:text-[11px] font-extrabold text-primary uppercase tracking-tight sm:tracking-wider text-center mt-0.5">
                Clean Pledge
              </span>
              <span className="text-[8px] sm:text-[10px] text-text-muted font-semibold text-center leading-none mt-0.5">
                Free Reclean
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-white/20 bg-slate-950/75 px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-xl backdrop-blur-xl text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold">
              <span className="text-rating font-black text-xs sm:text-sm">★ {ratingValue}</span>
              <span className="text-white/60">·</span>
              <span className="text-slate-200">{reviewCount}+ Verified Homeowner Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
