import Image from "next/image";
import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";
import { ScrollToCalculatorButton } from "@/components/landing/scroll-to-calculator-button";

interface TenantHeroProps {
  brand: PublicBrandConfig;
  trust?: TrustAndProof;
}

export function TenantHero({ brand }: TenantHeroProps) {
  return (
    <section className="relative w-full overflow-hidden px-4 pt-6 pb-14 sm:px-6 sm:pt-12 sm:pb-20">
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-10 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
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
            <ScrollToCalculatorButton className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-8 py-4 text-sm sm:text-base font-black text-white shadow-[0_10px_30px_-5px_rgba(5,150,105,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-400/30 transition-all hover:scale-[1.02] hover:shadow-[0_14px_35px_-5px_rgba(5,150,105,0.5)] active:scale-[0.98] whitespace-nowrap cursor-pointer">
              Calculate Flat Price in 60s ↓
            </ScrollToCalculatorButton>
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

          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-border-default/60 w-full max-w-lg">
            <div className="flex flex-col gap-0.5 sm:gap-1 rounded-xl sm:rounded-2xl border border-border-default/80 bg-surface/80 backdrop-blur-xs p-2.5 sm:p-3.5 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-sm min-w-0">
              <span className="font-mono text-base sm:text-2xl font-black text-text-primary tracking-tight">
                $2M
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-primary uppercase tracking-wider truncate">
                Hiscox Policy
              </span>
              <span className="text-[9px] sm:text-[10px] text-text-muted font-medium truncate">
                Full Coverage
              </span>
            </div>

            <div className="flex flex-col gap-0.5 sm:gap-1 rounded-xl sm:rounded-2xl border border-border-default/80 bg-surface/80 backdrop-blur-xs p-2.5 sm:p-3.5 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-sm min-w-0">
              <span className="font-mono text-base sm:text-2xl font-black text-text-primary tracking-tight">
                100%
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-primary uppercase tracking-wider truncate">
                Vetted Staff
              </span>
              <span className="text-[9px] sm:text-[10px] text-text-muted font-medium truncate">
                Nationwide Clearance
              </span>
            </div>

            <div className="flex flex-col gap-0.5 sm:gap-1 rounded-xl sm:rounded-2xl border border-border-default/80 bg-surface/80 backdrop-blur-xs p-2.5 sm:p-3.5 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-sm min-w-0">
              <span className="font-mono text-base sm:text-2xl font-black text-text-primary tracking-tight">
                24h
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-primary uppercase tracking-wider truncate">
                Sparkle Pledge
              </span>
              <span className="text-[9px] sm:text-[10px] text-text-muted font-medium truncate">
                Free Reclean
              </span>
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 inset-x-3 sm:right-auto sm:bottom-4 sm:left-4 rounded-xl sm:rounded-2xl border border-white/25 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-xl flex items-center gap-3 text-white">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-xs">
                🛡️
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 truncate">
                  <span>{brand.location.city} Verified Standard</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/15 px-1 py-0.2 rounded">✓</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">
                  Hospital-grade eco supplies included
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
