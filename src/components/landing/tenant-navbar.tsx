"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PublicBrandConfig, TrustAndProof } from "@/entities/tenant/schema";
import { ScrollToCalculatorButton } from "@/components/landing/scroll-to-calculator-button";

interface TenantNavbarProps {
  brand: PublicBrandConfig;
  trust: TrustAndProof;
}

export function TenantNavbar({ brand }: TenantNavbarProps) {
  const pathname = usePathname();
  const isOwnerPage = pathname?.includes("/owner");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isOwnerPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOwnerPage]);

  const headerClasses = isOwnerPage
    ? "sticky top-0 z-50 w-full border-b border-border-default bg-primary text-text-inverse"
    : `absolute top-0 inset-x-0 z-50 w-full md:fixed transition-all duration-300 ${
        isScrolled
          ? "md:border-b md:border-border-default md:bg-surface/85 md:backdrop-blur-xl md:shadow-xs"
          : "border-b border-transparent bg-transparent"
      }`;

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6 gap-2">
        <Link href={`/${brand.slug}`} className="flex items-center gap-2 min-w-0 shrink group">
          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span
                className={`text-base sm:text-lg md:text-xl font-serif font-bold tracking-tight uppercase transition-colors ${
                  isScrolled
                    ? "text-text-primary group-hover:text-primary"
                    : "text-white group-hover:text-accent drop-shadow-sm"
                }`}
              >
                Sparkle
              </span>
              <span className="rounded-md bg-primary px-1.5 py-0.5 text-[9px] sm:text-[10px] font-sans font-black tracking-widest text-text-inverse shadow-xs">
                PRO
              </span>
            </div>
            <span
              className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.16em] pt-1 truncate hidden xs:inline transition-colors ${
                isScrolled ? "text-text-muted" : "text-white/70"
              }`}
            >
              Residential · {brand.location.city}, {brand.location.state}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <a
            href={`tel:${brand.phone}`}
            className={`hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap shadow-xs ${
              isScrolled
                ? "border-border-default bg-subtle text-text-secondary hover:bg-border-default hover:text-text-primary"
                : "border-white/15 bg-white/10 text-white/90 hover:bg-white/20 hover:text-white backdrop-blur-md"
            }`}
          >
            <span>📞</span>
            <span>{brand.formattedPhone}</span>
          </a>

          <a
            href={`sms:${brand.phone}?&body=${encodeURIComponent("Hi! I would like to check available cleaning slots this week in " + brand.location.city + ".")}`}
            className={`hidden sm:inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap shadow-xs ${
              isScrolled
                ? "border-border-default bg-surface text-text-primary hover:border-primary hover:text-primary"
                : "border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>Text Dispatch</span>
          </a>

          <ScrollToCalculatorButton className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover px-3.5 sm:px-4 py-2 text-xs font-black text-text-inverse shadow-sm transition-transform active:scale-95 whitespace-nowrap cursor-pointer">
            <span>Instant Quote</span>
            <span className="ml-1 text-[11px]">→</span>
          </ScrollToCalculatorButton>
        </div>
      </div>
    </header>
  );
}
