import Image from "next/image";
import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";

interface TenantHeroProps {
  brand: PublicBrandConfig;
  trust: TrustAndProof;
}

export function TenantHero({ brand, trust }: TenantHeroProps) {
  return (
    <section className="relative w-full overflow-hidden px-4 pt-8 pb-14 sm:px-6 sm:pt-14 sm:pb-20">
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-10 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface/80 backdrop-blur-xs px-3.5 py-1 text-xs font-semibold text-text-primary shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-rating font-bold">★ {trust.googleRating}</span>
            <span className="text-text-muted">·</span>
            <span>{trust.googleReviewCount}+ Five-Star Ratings in {brand.location.city}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.12]">
            Hotel-Standard House Cleaning,{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              Flat Transparent Rates
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
            {brand.tagline}. High-filtration HEPA sanitization, background-vetted specialists, and direct dispatch to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto">
            <a
              href="#quote-calculator"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-8 py-4 text-sm sm:text-base font-black text-white shadow-[0_10px_30px_-5px_rgba(5,150,105,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-400/30 transition-all hover:scale-[1.02] hover:shadow-[0_14px_35px_-5px_rgba(5,150,105,0.5)] active:scale-[0.98] whitespace-nowrap"
            >
              Calculate Flat Price in 60s ↓
            </a>
            <a
              href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent("Hi! I would like to check available cleaning slots this week.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-200/90 bg-white/95 backdrop-blur-xs px-7 py-4 text-sm sm:text-base font-extrabold text-slate-800 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-950 hover:shadow-md active:scale-[0.98] whitespace-nowrap"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-whatsapp animate-pulse shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle w-full max-w-lg">
            <div className="flex flex-col">
              <span className="text-lg font-black text-text-primary">$2M</span>
              <span className="text-[11px] text-text-muted font-medium">Policy Protected</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-text-primary">100%</span>
              <span className="text-[11px] text-text-muted font-medium">Vetted Cleaners</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-text-primary">24h</span>
              <span className="text-[11px] text-text-muted font-medium">Free Reclean Guarantee</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative w-full flex justify-center">
          <div className="relative aspect-4/3 sm:aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-border-default/80 bg-surface shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
              alt={`${brand.name} professional cleaning crew in ${brand.location.city}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/75 via-transparent to-transparent" />

            <div className="absolute bottom-4 inset-x-4 rounded-2xl border border-white/20 bg-slate-900/90 backdrop-blur-md p-4 shadow-2xl flex items-center justify-between text-white">
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {brand.location.city} Certified
                </span>
                <span className="text-sm font-extrabold text-white">
                  Residential Cleaning Standard
                </span>
                <span className="text-[11px] text-slate-300">
                  Hospital-grade eco supplies included
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-white">Dallas, TX</span>
                <span className="text-[10px] font-bold text-emerald-400">Verified Local</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
