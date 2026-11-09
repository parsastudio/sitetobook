"use client";

import { useState, useMemo } from "react";
import { buildSmsHref, CleaningType, PublicTenant } from "@/entities/tenant/schema";
import { calculateCleaningQuote } from "@/entities/tenant/calculator";
import {
  MinusIcon,
  PlusIcon,
  CheckIcon,
  MessageTextIcon,
  PhoneIcon,
  OvenIcon,
  FridgeIcon,
  WindowIcon,
  CabinetIcon,
  SparkleIcon,
} from "@/components/ui/icons";

interface QuoteCalculatorProps {
  tenant: PublicTenant;
}

export function QuoteCalculator({ tenant }: QuoteCalculatorProps) {
  const { brand, pricing } = tenant;

  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [serviceType, setServiceType] = useState<CleaningType>("deep");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(() => {
    const defaultOven = pricing.addOns.find(
      (a) => a.id === "oven" && a.enabled !== false
    );
    return defaultOven ? ["oven"] : [];
  });

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

  const smsUrl = useMemo(() => {
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

    return buildSmsHref(brand.phone, text);
  }, [brand, pricing, serviceType, bedrooms, bathrooms, selectedAddOns, quote]);

  const getAddOnIcon = (id: string) => {
    switch (id) {
      case "oven":
        return <OvenIcon className="h-4 w-4" />;
      case "fridge":
        return <FridgeIcon className="h-4 w-4" />;
      case "windows":
        return <WindowIcon className="h-4 w-4" />;
      case "cabinets":
        return <CabinetIcon className="h-4 w-4" />;
      default:
        return <SparkleIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-border-default bg-surface p-4 sm:p-8 lg:p-10 shadow-xl flex flex-col gap-6 sm:gap-8 text-left overflow-hidden">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-text-inverse text-[10px] font-bold">1</span>
            <span>Home Specifications</span>
          </span>
          <span className="text-[11px] font-semibold text-text-muted">
            Base dispatch: {pricing.currencySymbol}{pricing.baseDispatchFee}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-border-default bg-subtle/60 p-3.5 sm:p-4 transition-all">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-text-primary">Bedrooms</span>
              <span className="text-[11px] text-text-muted">
                +{pricing.currencySymbol}{pricing.ratePerBedroom} per room
              </span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setBedrooms((b) => Math.max(1, b - 1))}
                aria-label="Decrease bedrooms"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-surface border border-border-default text-text-primary hover:border-primary active:scale-95 transition-all shadow-2xs"
              >
                <MinusIcon className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center font-serif text-2xl sm:text-3xl font-bold text-text-primary leading-none">
                {bedrooms}
              </span>
              <button
                type="button"
                onClick={() => setBedrooms((b) => Math.min(8, b + 1))}
                aria-label="Increase bedrooms"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-surface border border-border-default text-text-primary hover:border-primary active:scale-95 transition-all shadow-2xs"
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-border-default bg-subtle/60 p-3.5 sm:p-4 transition-all">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-text-primary">Bathrooms</span>
              <span className="text-[11px] text-text-muted">
                +{pricing.currencySymbol}{pricing.ratePerBathroom} per room
              </span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setBathrooms((b) => Math.max(1, b - 1))}
                aria-label="Decrease bathrooms"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-surface border border-border-default text-text-primary hover:border-primary active:scale-95 transition-all shadow-2xs"
              >
                <MinusIcon className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center font-serif text-2xl sm:text-3xl font-bold text-text-primary leading-none">
                {bathrooms}
              </span>
              <button
                type="button"
                onClick={() => setBathrooms((b) => Math.min(6, b + 1))}
                aria-label="Increase bathrooms"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-surface border border-border-default text-text-primary hover:border-primary active:scale-95 transition-all shadow-2xs"
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-text-inverse text-[10px] font-bold">2</span>
            <span>Service Protocol</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pricing.services.map((srv) => {
            const isSelected = serviceType === srv.id;
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => setServiceType(srv.id)}
                className={`relative flex flex-col justify-between rounded-xl sm:rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary-subtle/80 ring-1 ring-primary shadow-xs"
                    : "border-border-default bg-surface hover:border-border-focus"
                }`}
              >
                {srv.isPopular && (
                  <span className="absolute -top-2.5 right-3.5 rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-inverse shadow-2xs">
                    Popular
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-bold text-text-primary">
                      {srv.name}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
                    {srv.tagline}
                  </span>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-border-default/60 flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="font-medium text-text-muted">
                    {srv.multiplier === 1 ? "1.0x Base" : `${srv.multiplier}x Multiplier`}
                  </span>
                  <span className={`font-semibold ${isSelected ? "text-primary" : "text-text-muted"}`}>
                    {isSelected ? "Selected ✓" : "Select"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-text-inverse text-[10px] font-bold">3</span>
            <span>Detail Add-Ons</span>
          </span>
          <span className="text-[11px] text-text-muted">Optional</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {pricing.addOns.filter((a) => a.enabled !== false).map((addon) => {
            const isChecked = selectedAddOns.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddOn(addon.id)}
                className={`flex items-center justify-between rounded-xl sm:rounded-2xl border p-3 sm:p-3.5 text-left transition-all ${
                  isChecked
                    ? "border-primary bg-primary-subtle/50 ring-1 ring-primary shadow-2xs"
                    : "border-border-default bg-surface hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 pr-2 min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    isChecked ? "border-primary bg-primary text-text-inverse" : "border-border-default bg-subtle text-text-muted"
                  }`}>
                    {getAddOnIcon(addon.id)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-text-primary truncate">
                      {addon.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-text-muted truncate">
                      {addon.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-text-primary">
                    +{pricing.currencySymbol}{addon.price}
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
                      isChecked
                        ? "border-primary bg-primary text-text-inverse"
                        : "border-border-default bg-surface text-transparent"
                    }`}
                  >
                    <CheckIcon className="h-3 w-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="-mx-4 -mb-4 sm:mx-0 sm:mb-0 rounded-b-2xl sm:rounded-3xl border-t sm:border border-border-default bg-subtle/70 p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 sm:shadow-xs">
        <div className="flex flex-col text-center md:text-left gap-0.5 w-full md:w-auto">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Guaranteed Upfront Quote
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-2.5">
            <span className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-text-primary">
              {quote.currencySymbol}{quote.finalEstimatedTotal}
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-text-muted">
              Flat rate · Tax & eco-supplies included
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5 font-medium">
            {quote.summaryText}
          </p>
        </div>

        <div className="flex flex-col w-full md:w-auto gap-2 shrink-0">
          <a
            href={smsUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary-hover px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-text-inverse shadow-[0_10px_28px_-4px_rgba(10,51,38,0.4)] transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <MessageTextIcon className="h-4 w-4 shrink-0" />
            <span>Text This Quote to Book</span>
          </a>
          <a
            href={`tel:${brand.phone}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-default bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:border-primary hover:text-primary transition-colors text-center shadow-2xs"
          >
            <PhoneIcon className="h-3.5 w-3.5 text-text-muted shrink-0" />
            <span>Or Call: {brand.formattedPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
