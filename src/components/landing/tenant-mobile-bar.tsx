"use client";

import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";

interface TenantMobileBarProps {
  brand: PublicBrandConfig;
  trust: TrustAndProof;
}

export function TenantMobileBar({ brand, trust }: TenantMobileBarProps) {
  return (
    <aside
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border-default bg-surface/95 backdrop-blur-lg px-4 py-2.5 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] shadow-2xl animate-in slide-in-from-bottom duration-200"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-emerald-600 to-teal-800 text-text-inverse shadow-xs border border-white/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.2">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" fill="currentColor" fillOpacity="0.3" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-text-primary truncate">
              {brand.name}
            </span>
            <span className="text-[10px] font-bold text-rating flex items-center gap-0.5">
              <span>★ {trust.googleRating}</span>
              <span className="text-text-muted font-normal">({trust.googleReviewCount})</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${brand.phone}`}
            aria-label="Direct Phone Call"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-default bg-canvas text-text-primary hover:bg-surface active:scale-95 transition-all shadow-xs"
          >
            <span className="text-sm">📞</span>
          </a>

          <a
            href="#quote-calculator"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-2 text-xs font-black text-white shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/30 transition-transform active:scale-95 whitespace-nowrap"
          >
            <span>Instant Quote</span>
            <span className="ml-1 text-[10px]">→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
