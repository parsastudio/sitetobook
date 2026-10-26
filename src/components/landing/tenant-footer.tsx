import Link from "next/link";
import { PublicTenant } from "@/entities/tenant/schema";
import { ScrollToCalculatorButton } from "@/components/landing/scroll-to-calculator-button";
import { PhoneIcon, ClockIcon, MessageTextIcon } from "@/components/ui/icons";

interface TenantFooterProps {
  tenant: PublicTenant;
}

export function TenantFooter({ tenant }: TenantFooterProps) {
  const { brand, pricing } = tenant;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-default bg-surface pt-16 pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-left">
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg sm:text-xl font-sans font-bold tracking-tight text-text-primary">
                  {brand.name}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.18em] text-text-muted pt-1.5">
                Residential Cleaning · {brand.location.city}, {brand.location.state}
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              {brand.tagline}. Professional residential sanitization backed by strict nationwide background vetting and eco-grade supplies.
            </p>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-text-primary">
              Cleaning Packages
            </span>
            <ul className="flex flex-col gap-2 text-xs font-semibold text-text-secondary">
              {pricing.services.map((service) => (
                <li key={service.id}>
                  <ScrollToCalculatorButton className="hover:text-primary transition-colors cursor-pointer text-left">
                    {service.name}
                  </ScrollToCalculatorButton>
                </li>
              ))}
              <li>
                <a href="#before-after" className="hover:text-primary transition-colors">
                  Oven & Detail Showcase
                </a>
              </li>
              <li>
                <a href="#checklist" className="hover:text-primary transition-colors">
                  40-Point Scope Checklist
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-text-primary">
              Coverage Areas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {brand.location.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-lg border border-border-default bg-canvas px-2.5 py-1 text-[11px] font-semibold text-text-secondary"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-3.5">
            <span className="text-xs font-black uppercase tracking-wider text-text-primary">
              Direct Dispatch
            </span>

            <a
              href={`tel:${brand.phone}`}
              className="flex items-center gap-3 rounded-xl border border-border-default bg-canvas p-3 text-xs font-bold text-text-primary hover:border-primary hover:bg-surface transition-all shadow-xs group"
            >
              <PhoneIcon className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Direct Call</span>
                <span className="text-xs font-extrabold text-text-primary group-hover:text-primary transition-colors">{brand.formattedPhone}</span>
              </div>
            </a>

            <div className="flex items-center gap-2 text-xs text-text-muted font-medium px-1">
              <ClockIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{brand.operatingHours}</span>
            </div>

            <a
              href={`sms:${brand.phone}?&body=${encodeURIComponent("Hi! I would like to schedule a residential cleaning appointment in " + brand.location.city + ".")}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-4 py-3 text-xs font-black text-text-inverse shadow-xs transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageTextIcon className="h-4 w-4 shrink-0" />
              <span>Text for Instant Dispatch</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-text-muted">
          <span>
            © {currentYear} {brand.name}. All Rights Reserved.
          </span>
          <span className="text-[11px] font-semibold text-text-secondary flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Bonded & Insured · {brand.location.city}, {brand.location.state}
          </span>
        </div>
      </div>
    </footer>
  );
}
