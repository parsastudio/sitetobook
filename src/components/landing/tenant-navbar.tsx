import Link from "next/link";
import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";

interface TenantNavbarProps {
  brand: PublicBrandConfig;
  trust: TrustAndProof;
}

export function TenantNavbar({ brand }: TenantNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-default bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3.5 sm:px-6 gap-2">
        <Link href={`/${brand.slug}`} className="flex items-center gap-2 min-w-0 shrink group">
          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-text-primary uppercase group-hover:text-primary transition-colors">
                Sparkle
              </span>
              <span className="rounded-md bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black tracking-wider text-white shadow-xs">
                PRO
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.16em] text-text-muted pt-1 truncate hidden xs:inline">
              Residential · {brand.location.city}, {brand.location.state}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-surface px-3 py-2 text-xs font-bold text-text-primary transition-colors hover:border-whatsapp hover:text-whatsapp whitespace-nowrap shadow-xs"
          >
            <span className="h-2 w-2 rounded-full bg-whatsapp animate-pulse" />
            <span>WhatsApp</span>
          </a>

          <a
            href="#quote-calculator"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-3 sm:px-4 py-2 text-xs font-black text-white shadow-[0_4px_14px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/30 transition-transform active:scale-95 whitespace-nowrap"
          >
            <span>Instant Quote</span>
            <span className="ml-1 text-[11px]">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
