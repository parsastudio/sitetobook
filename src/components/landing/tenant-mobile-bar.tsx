"use client";

import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";
import { ScrollToCalculatorButton } from "@/components/landing/scroll-to-calculator-button";
import { PhoneIcon } from "@/components/ui/icons";

interface TenantMobileBarProps {
  brand: PublicBrandConfig;
  trust: TrustAndProof;
}

export function TenantMobileBar({ brand, trust }: TenantMobileBarProps) {
  return (
    <aside
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border-default bg-surface/90 backdrop-blur-xl px-4 py-2.5 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] shadow-2xl animate-in slide-in-from-bottom duration-200"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1 leading-none">
              <span className="font-sans text-xs sm:text-sm font-bold tracking-tight text-text-primary truncate">
                {brand.name}
              </span>
            </div>
            <span className="text-[10px] font-bold text-rating flex items-center gap-0.5 pt-0.5">
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
            <PhoneIcon className="h-4 w-4" />
          </a>

          <ScrollToCalculatorButton className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover px-4 py-2 text-xs font-bold text-text-inverse shadow-sm transition-transform active:scale-95 whitespace-nowrap cursor-pointer">
            <span>Instant Quote</span>
            <span className="ml-1 text-[10px]">→</span>
          </ScrollToCalculatorButton>
        </div>
      </div>
    </aside>
  );
}
