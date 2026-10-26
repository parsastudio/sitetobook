"use client";

import { useState, useTransition } from "react";
import { createTenantAction } from "@/app/actions/tenant.actions";

const COLOR_PRESETS = [
  { name: "Spruce & Mint", primary: "#0F766E", accent: "#0D9488" },
  { name: "Ocean Navy", primary: "#1E3A8A", accent: "#0284C7" },
  { name: "Botanical Forest", primary: "#065F46", accent: "#059669" },
  { name: "Royal Purple", primary: "#4C1D95", accent: "#7C3AED" },
];

export function TenantCreatorForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("TX");
  const [serviceAreasInput, setServiceAreasInput] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0F766E");
  const [accentColor, setAccentColor] = useState("#0D9488");
  const [baseDispatchFee, setBaseDispatchFee] = useState(49);
  const [ratePerBedroom, setRatePerBedroom] = useState(35);
  const [ratePerBathroom, setRatePerBathroom] = useState(40);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(autoSlug);
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    const digitsOnly = val.replace(/\D/g, "");
    if (digitsOnly.length >= 10 && !whatsappNumber) {
      setWhatsappNumber(digitsOnly.startsWith("1") ? digitsOnly : `1${digitsOnly}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreatedSlug(null);

    startTransition(async () => {
      const parsedAreas = serviceAreasInput
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const result = await createTenantAction({
        name,
        tagline: tagline.trim() || undefined,
        slug,
        city,
        state,
        phone,
        whatsappNumber,
        email,
        primaryColor,
        accentColor,
        baseDispatchFee,
        ratePerBedroom,
        ratePerBathroom,
        serviceAreas: parsedAreas.length > 0 ? parsedAreas : [`Downtown ${city}`, `Metro ${city}`],
      });

      if (!result.success) {
        setError(result.error);
      } else {
        setCreatedSlug(result.data.slug);
        setName("");
        setSlug("");
        setCity("");
        setPhone("");
        setWhatsappNumber("");
        setEmail("");
      }
    });
  };

  return (
    <div className="w-full rounded-2xl border border-border-default bg-surface p-5 sm:p-6 shadow-xs text-left">
      <div className="flex flex-col gap-0.5 border-b border-border-subtle pb-3">
        <h2 className="text-base font-extrabold text-text-primary">
          Generate New Client Site
        </h2>
        <p className="text-xs text-text-muted">
          Automated provisioning of custom portal, quote calculator and WhatsApp pipeline.
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive-subtle p-2.5 text-xs font-semibold text-destructive">
          ✕ {error}
        </div>
      )}

      {createdSlug && (
        <div className="mt-3 rounded-xl border border-success/30 bg-success-subtle p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-success">
            ✓ Site created: <strong className="font-mono">{createdSlug}</strong>
          </span>
          <a
            href={`/${createdSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1 text-xs font-bold text-text-inverse hover:bg-primary-hover"
          >
            Open Portal →
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-secondary">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Apex Luxury Cleaners"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-secondary">
              Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="e.g. apex-cleaners"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-mono font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-secondary">
              Business Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dispatch@apexclean.com"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-secondary">
              City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Dallas"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-secondary">
              State *
            </label>
            <input
              type="text"
              required
              maxLength={2}
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              placeholder="TX"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-secondary">
              Phone *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+1 (214) 555-0199"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-bold text-text-secondary">
              Brand Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Austin's Premier Hotel-Standard Home Cleaning Crew"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-bold text-text-secondary">
              Service Neighborhoods (comma-separated)
            </label>
            <input
              type="text"
              value={serviceAreasInput}
              onChange={(e) => setServiceAreasInput(e.target.value)}
              placeholder="e.g. Downtown, South Congress, Zilker, Domain"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-text-secondary">
              WhatsApp (Digits Only) *
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="12145550199"
              className="rounded-lg border border-border-default bg-subtle px-3 py-2 text-sm font-mono font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
          <label className="text-xs font-bold text-text-secondary">
            Color Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isActive = primaryColor === preset.primary && accentColor === preset.accent;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setAccentColor(preset.accent);
                  }}
                  className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${
                    isActive
                      ? "border-primary bg-primary-subtle ring-1 ring-primary"
                      : "border-border-default bg-surface hover:border-primary/50"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-border-default"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span className="font-semibold text-text-primary text-[11px]">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
          <label className="text-xs font-bold text-text-secondary">
            Pricing Defaults ($ USD)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted">Base Setup Fee</span>
              <input
                type="number"
                min={0}
                value={baseDispatchFee}
                onChange={(e) => setBaseDispatchFee(Number(e.target.value) || 0)}
                className="rounded-lg border border-border-default bg-subtle px-3 py-1.5 text-sm font-bold text-text-primary outline-hidden"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted">Per Bedroom</span>
              <input
                type="number"
                min={1}
                value={ratePerBedroom}
                onChange={(e) => setRatePerBedroom(Number(e.target.value) || 1)}
                className="rounded-lg border border-border-default bg-subtle px-3 py-1.5 text-sm font-bold text-text-primary outline-hidden"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted">Per Bathroom</span>
              <input
                type="number"
                min={1}
                value={ratePerBathroom}
                onChange={(e) => setRatePerBathroom(Number(e.target.value) || 1)}
                className="rounded-lg border border-border-default bg-subtle px-3 py-1.5 text-sm font-bold text-text-primary outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-text-inverse shadow-xs transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? "Provisioning..." : "Launch Portal Instantly 🚀"}
          </button>
        </div>
      </form>
    </div>
  );
}
