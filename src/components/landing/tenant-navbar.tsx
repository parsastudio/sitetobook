import Link from "next/link";
import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";

interface TenantNavbarProps {
  brand: PublicBrandConfig;
  trust: TrustAndProof;
}

export function TenantNavbar({ brand }: TenantNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-default bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${brand.slug}`} className="flex items-center gap-3 shrink-0 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-emerald-600 to-teal-800 text-text-inverse shadow-md shadow-primary/20 border border-white/20 transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" fill="currentColor" fillOpacity="0.3" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm sm:text-base font-black tracking-tight text-text-primary whitespace-nowrap group-hover:text-primary transition-colors">
              {brand.name}
            </span>
            <span className="text-[11px] font-semibold text-text-muted whitespace-nowrap">
              Residential Cleaning · {brand.location.city}, {brand.location.state}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={`tel:${brand.phone}`}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl hover:bg-subtle transition-colors whitespace-nowrap"
          >
            <span>📞</span>
            <span>{brand.formattedPhone}</span>
          </a>

          <a
            href={`https://wa.me/${brand.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-surface px-3 sm:px-3.5 py-2 text-xs font-bold text-text-primary transition-colors hover:border-whatsapp hover:text-whatsapp whitespace-nowrap shadow-xs"
          >
            <span className="h-2 w-2 rounded-full bg-whatsapp animate-pulse" />
            <span>WhatsApp</span>
          </a>

          <a
            href="#quote-calculator"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 sm:px-5 py-2 text-xs font-black text-white shadow-[0_4px_16px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/30 transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <span>Instant Quote</span>
            <span className="ml-1 text-[11px]">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
