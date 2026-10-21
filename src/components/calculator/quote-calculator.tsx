"use client";

import { useState, useMemo } from "react";
import { CleaningType, PublicTenant } from "@/entities/tenant/schema";
import { calculateCleaningQuote } from "@/entities/tenant/calculator";

interface QuoteCalculatorProps {
  tenant: PublicTenant;
}

export function QuoteCalculator({ tenant }: QuoteCalculatorProps) {
  const { brand, pricing, trust } = tenant;

  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [serviceType, setServiceType] = useState<CleaningType>("deep");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(["oven"]);

  const quote = useMemo(() => {
    return calculateCleaningQuote(tenant, {
      bedrooms,
      bathrooms,
      serviceType,
      selectedAddOnIds: selectedAddOns,
    });
  }, [tenant, bedrooms, bathrooms, serviceType, selectedAddOns]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const whatsappUrl = useMemo(() => {
    const selectedServiceName =
      pricing.services.find((s) => s.id === serviceType)?.name ?? serviceType;

    const addOnsList =
      selectedAddOns.length > 0
        ? selectedAddOns
            .map((id) => pricing.addOns.find((a) => a.id === id)?.name)
            .filter(Boolean)
            .join(", ")
        : "None";

    const text = [
      `Hi ${brand.name}! I just calculated an instant quote on your website for ${brand.location.city}:`,
      ``,
      `• Package: ${selectedServiceName}`,
      `• Layout: ${bedrooms} Bedroom(s), ${bathrooms} Bathroom(s)`,
      `• Requested Add-ons: ${addOnsList}`,
      `• Estimated Total: ${quote.currencySymbol}${quote.finalEstimatedTotal}`,
      ``,
      `What is your earliest available booking slot?`,
    ].join("\n");

    return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [brand, pricing, serviceType, bedrooms, bathrooms, selectedAddOns, quote]);

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-border-default bg-surface p-6 sm:p-10 shadow-xl flex flex-col gap-8 text-left">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-text-inverse text-[11px]">1</span>
            Select Home Size
          </span>
          <span className="rounded-md bg-subtle px-2.5 py-1 text-xs font-semibold text-text-muted">
            Base fee: {pricing.currencySymbol}{pricing.baseDispatchFee}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-border-default bg-canvas p-4 shadow-xs">
            <div className="flex flex-col">
              <span className="text-sm font-black text-text-primary">Bedrooms</span>
              <span className="text-xs text-text-muted">
                +{pricing.currencySymbol}{pricing.ratePerBedroom} per room
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBedrooms((b) => Math.max(1, b - 1))}
                aria-label="Decrease bedrooms"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface border border-border-default text-base font-bold text-text-primary hover:border-primary active:scale-95 transition-all shadow-xs"
              >
                -
              </button>
              <span className="w-6 text-center text-lg font-black text-text-primary">
                {bedrooms}
              </span>
              <button
                type="button"
                onClick={() => setBedrooms((b) => Math.min(8, b + 1))}
                aria-label="Increase bedrooms"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface border border-border-default text-base font-bold text-text-primary hover:border-primary active:scale-95 transition-all shadow-xs"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border-default bg-canvas p-4 shadow-xs">
            <div className="flex flex-col">
              <span className="text-sm font-black text-text-primary">Bathrooms</span>
              <span className="text-xs text-text-muted">
                +{pricing.currencySymbol}{pricing.ratePerBathroom} per room
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBathrooms((b) => Math.max(1, b - 1))}
                aria-label="Decrease bathrooms"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface border border-border-default text-base font-bold text-text-primary hover:border-primary active:scale-95 transition-all shadow-xs"
              >
                -
              </button>
              <span className="w-6 text-center text-lg font-black text-text-primary">
                {bathrooms}
              </span>
              <button
                type="button"
                onClick={() => setBathrooms((b) => Math.min(6, b + 1))}
                aria-label="Increase bathrooms"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface border border-border-default text-base font-bold text-text-primary hover:border-primary active:scale-95 transition-all shadow-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-text-inverse text-[11px]">2</span>
          Choose Cleaning Tier
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {pricing.services.map((srv) => {
            const isSelected = serviceType === srv.id;
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => setServiceType(srv.id)}
                className={`relative flex flex-col justify-between rounded-2xl border p-4.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary-subtle/70 ring-2 ring-primary shadow-sm"
                    : "border-border-default bg-canvas hover:border-border-focus hover:bg-surface"
                }`}
              >
                {srv.isPopular && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-black uppercase text-text-inverse shadow-xs">
                    Most Popular
                  </span>
                )}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-black text-text-primary">
                      {srv.name}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary leading-relaxed">
                    {srv.tagline}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-border-default flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-muted">
                    {srv.multiplier === 1 ? "1.0x Base" : `${srv.multiplier}x Multiplier`}
                  </span>
                  <span className={`font-bold ${isSelected ? "text-primary" : "text-text-muted"}`}>
                    {isSelected ? "Selected ✓" : "Select"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-text-inverse text-[11px]">3</span>
          Deep Detail Add-Ons (Optional)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pricing.addOns.filter((a) => a.enabled !== false).map((addon) => {
            const isChecked = selectedAddOns.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddOn(addon.id)}
                className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                  isChecked
                    ? "border-primary bg-primary-subtle/50 ring-1 ring-primary shadow-xs"
                    : "border-border-default bg-canvas hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col pr-2">
                  <span className="text-xs font-bold text-text-primary">
                    {addon.name}
                  </span>
                  <span className="text-[11px] text-text-muted line-clamp-1">
                    {addon.description}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="rounded-lg bg-surface border border-border-default px-2.5 py-1 text-xs font-bold text-text-primary">
                    +{pricing.currencySymbol}{addon.price}
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-lg border text-[11px] font-black transition-colors ${
                      isChecked
                        ? "border-primary bg-primary text-text-inverse"
                        : "border-border-default bg-surface text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary-subtle/90 via-surface to-primary-subtle/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex flex-col text-center md:text-left gap-1">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            Guaranteed Upfront Quote
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-4xl sm:text-5xl font-black text-text-primary">
              {quote.currencySymbol}{quote.finalEstimatedTotal}
            </span>
            <span className="text-xs font-semibold text-text-muted">
              Flat rate · All supplies included
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            {quote.summaryText}
          </p>
        </div>

        <div className="flex flex-col w-full md:w-auto gap-2.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-8 py-4 text-sm font-black text-white shadow-[0_10px_28px_-4px_rgba(5,150,105,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-400/30 transition-all hover:scale-[1.02] hover:shadow-[0_14px_32px_-4px_rgba(5,150,105,0.55)] active:scale-[0.98]"
          >
            <span className="text-base">💬</span>
            <span>Book on WhatsApp Now</span>
          </a>
          <a
            href={`tel:${brand.phone}`}
            className="inline-flex items-center justify-center rounded-xl border border-border-default bg-surface/90 px-4 py-2.5 text-xs font-bold text-text-primary transition-colors hover:border-emerald-600 hover:text-emerald-700 text-center shadow-xs"
          >
            Or Call: {brand.formattedPhone}
          </a>
        </div>
      </div>
    </div>
  );
}
