"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { Tenant } from "@/entities/tenant/schema";
import {
  verifyOwnerPinAction,
  logoutOwnerAction,
  updateOwnerSettingsAction,
} from "@/app/actions/owner.actions";
import { GalleryManager } from "@/components/owner/gallery-manager";

interface OwnerPortalViewProps {
  tenant: Tenant;
  initialAuthenticated: boolean;
}

export function OwnerPortalView({
  tenant,
  initialAuthenticated,
}: OwnerPortalViewProps) {
  const { brand, pricing } = tenant;
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);

  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, startVerifyTransition] = useTransition();

  const [baseFee, setBaseFee] = useState(pricing.baseDispatchFee);
  const [bedRate, setBedRate] = useState(pricing.ratePerBedroom);
  const [bathRate, setBathRate] = useState(pricing.ratePerBathroom);
  const [addOnsState, setAddOnsState] = useState(
    pricing.addOns.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
      enabled: a.enabled !== false,
    }))
  );

  const [phone, setPhone] = useState(brand.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(brand.whatsappNumber);

  const [serviceAreas, setServiceAreas] = useState<string[]>(
    brand.location.serviceAreas
  );
  const [newAreaInput, setNewAreaInput] = useState("");

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isSaving, startSaveTransition] = useTransition();

  const isDirty = useMemo(() => {
    if (baseFee !== pricing.baseDispatchFee) return true;
    if (bedRate !== pricing.ratePerBedroom) return true;
    if (bathRate !== pricing.ratePerBathroom) return true;
    if (phone !== brand.phone) return true;
    if (whatsappNumber !== brand.whatsappNumber) return true;
    if (JSON.stringify(serviceAreas) !== JSON.stringify(brand.location.serviceAreas)) return true;

    return addOnsState.some((current) => {
      const original = pricing.addOns.find((a) => a.id === current.id);
      return (
        !original ||
        original.price !== current.price ||
        (original.enabled !== false) !== current.enabled
      );
    });
  }, [baseFee, bedRate, bathRate, phone, whatsappNumber, serviceAreas, addOnsState, pricing, brand]);

  const handleKeyClick = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setPinError(null);

      if (nextPin.length === 4) {
        submitPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleClear = () => {
    setPin("");
    setPinError(null);
  };

  const submitPin = (pinToTest: string) => {
    startVerifyTransition(async () => {
      const res = await verifyOwnerPinAction(brand.slug, pinToTest);
      if (res.success) {
        setIsAuthenticated(true);
      } else {
        setPinError(res.error);
        setPin("");
      }
    });
  };

  const handleLogout = () => {
    startVerifyTransition(async () => {
      await logoutOwnerAction(brand.slug);
      setIsAuthenticated(false);
      setPin("");
    });
  };

  const handleToggleAddOn = (id: string) => {
    setAddOnsState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    setSaveStatus("idle");
  };

  const handleAddOnPriceChange = (id: string, newPrice: number) => {
    setAddOnsState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: Math.max(0, newPrice) } : item
      )
    );
    setSaveStatus("idle");
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanArea = newAreaInput.trim();
    if (cleanArea && !serviceAreas.includes(cleanArea)) {
      setServiceAreas((prev) => [...prev, cleanArea]);
      setNewAreaInput("");
      setSaveStatus("idle");
    }
  };

  const handleRemoveArea = (areaToRemove: string) => {
    setServiceAreas((prev) => prev.filter((a) => a !== areaToRemove));
    setSaveStatus("idle");
  };

  const handleDiscardChanges = () => {
    setBaseFee(pricing.baseDispatchFee);
    setBedRate(pricing.ratePerBedroom);
    setBathRate(pricing.ratePerBathroom);
    setAddOnsState(
      pricing.addOns.map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
        enabled: a.enabled !== false,
      }))
    );
    setPhone(brand.phone);
    setWhatsappNumber(brand.whatsappNumber);
    setServiceAreas(brand.location.serviceAreas);
    setSaveStatus("idle");
    setSaveErrorMsg(null);
  };

  const handleSaveAllSettings = () => {
    setSaveStatus("idle");
    setSaveErrorMsg(null);

    startSaveTransition(async () => {
      const res = await updateOwnerSettingsAction(brand.slug, {
        baseDispatchFee: baseFee,
        ratePerBedroom: bedRate,
        ratePerBathroom: bathRate,
        addOns: addOnsState.map((a) => ({
          id: a.id,
          price: a.price,
          enabled: a.enabled,
        })),
        phone: phone.trim(),
        whatsappNumber: whatsappNumber.replace(/\D/g, ""),
        serviceAreas,
      });

      if (res.success) {
        setSaveStatus("success");
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setSaveErrorMsg(res.error);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xs rounded-2xl border border-border-default bg-surface p-6 shadow-lg flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-text-inverse font-black text-lg shadow-xs">
              {brand.name.charAt(0)}
            </div>
            <h1 className="text-base font-extrabold text-text-primary">
              {brand.name}
            </h1>
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Owner Access
            </span>
          </div>

          <div className="flex items-center gap-3 my-1">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`h-3 w-3 rounded-full border transition-all ${
                  pin.length > idx
                    ? "border-primary bg-primary scale-110"
                    : "border-border-default bg-subtle"
                }`}
              />
            ))}
          </div>

          {pinError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive-subtle px-3 py-1 text-xs font-semibold text-destructive text-center">
              {pinError}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 w-full max-w-[220px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={isVerifying}
                onClick={() => handleKeyClick(digit)}
                className="flex h-12 items-center justify-center rounded-xl border border-border-default bg-subtle text-lg font-bold text-text-primary transition-all hover:bg-border-default active:scale-95 disabled:opacity-50"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="flex h-12 items-center justify-center rounded-xl bg-surface text-xs font-semibold text-text-muted hover:text-text-primary"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={isVerifying}
              onClick={() => handleKeyClick("0")}
              className="flex h-12 items-center justify-center rounded-xl border border-border-default bg-subtle text-lg font-bold text-text-primary transition-all hover:bg-border-default active:scale-95 disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="flex h-12 items-center justify-center rounded-xl bg-surface text-sm font-semibold text-text-muted hover:text-text-primary"
            >
              ⌫
            </button>
          </div>

          <div className="text-center text-[11px] text-text-muted border-t border-border-subtle pt-2.5 w-full">
            Default demo PIN: <strong className="font-mono text-text-primary">1234</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10 flex flex-col gap-6 pb-28">
      <div className="flex items-center justify-between gap-4 border-b border-border-default pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-text-inverse font-black text-lg shadow-xs">
            {brand.name.charAt(0)}
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-text-primary">
                {brand.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle px-2 py-0.5 text-[10px] font-bold uppercase text-success">
                Active
              </span>
            </div>
            <span className="text-xs text-text-muted">
              {brand.location.city}, {brand.location.state} • Operational Controls
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${brand.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-lg border border-border-default bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-primary transition-colors"
          >
            Live Site ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center rounded-lg bg-subtle px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive-subtle transition-colors"
          >
            Lock 🔒
          </button>
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="rounded-xl border border-success/30 bg-success-subtle p-3 text-xs font-semibold text-success flex items-center justify-between shadow-xs">
          <span>✓ Changes synced live across edge caches {lastSyncTime && `(${lastSyncTime})`}</span>
          <Link href={`/${brand.slug}#quote-calculator`} className="underline font-bold">
            Preview →
          </Link>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive-subtle p-3 text-xs font-semibold text-destructive">
          ✕ {saveErrorMsg || "Failed to save updates. Please try again."}
        </div>
      )}

      <div className="rounded-2xl border border-border-default bg-surface p-5 shadow-xs flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-0.5 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <span>📞</span> Direct Dispatch Lines
          </h2>
          <p className="text-xs text-text-muted">
            Incoming quote requests route directly to these destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 rounded-xl border border-border-default bg-subtle p-3">
            <label className="text-xs font-bold text-text-primary">
              Display Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSaveStatus("idle");
              }}
              placeholder="+1 (214) 555-0189"
              className="rounded-lg border border-border-default bg-surface px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus"
            />
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-border-default bg-subtle p-3">
            <label className="text-xs font-bold text-text-primary">
              WhatsApp Dispatch (Digits Only)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => {
                setWhatsappNumber(e.target.value.replace(/\D/g, ""));
                setSaveStatus("idle");
              }}
              placeholder="12145550189"
              className="rounded-lg border border-border-default bg-surface px-3 py-2 text-sm font-mono font-semibold text-text-primary outline-hidden focus:border-border-focus"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-default bg-surface p-5 shadow-xs flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-0.5 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <span>💰</span> Base Pricing & Room Rates
          </h2>
          <p className="text-xs text-text-muted">
            Directly controls the calculations in your website&apos;s instant quote engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col justify-between rounded-xl border border-border-default bg-subtle p-3.5 gap-2">
            <span className="text-xs font-bold text-text-primary">Base Setup Fee</span>
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setBaseFee((p) => Math.max(0, p - 5));
                  setSaveStatus("idle");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border-default text-xs font-bold text-text-primary hover:border-primary active:scale-95"
              >
                -5
              </button>
              <div className="flex items-center font-black text-lg text-text-primary">
                <span>$</span>
                <input
                  type="number"
                  min={0}
                  value={baseFee}
                  onChange={(e) => {
                    setBaseFee(Math.max(0, Number(e.target.value) || 0));
                    setSaveStatus("idle");
                  }}
                  className="w-14 bg-transparent text-center font-black outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setBaseFee((p) => p + 5);
                  setSaveStatus("idle");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border-default text-xs font-bold text-text-primary hover:border-primary active:scale-95"
              >
                +5
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border-default bg-subtle p-3.5 gap-2">
            <span className="text-xs font-bold text-text-primary">Per Bedroom</span>
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setBedRate((p) => Math.max(5, p - 5));
                  setSaveStatus("idle");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border-default text-xs font-bold text-text-primary hover:border-primary active:scale-95"
              >
                -5
              </button>
              <div className="flex items-center font-black text-lg text-text-primary">
                <span>$</span>
                <input
                  type="number"
                  min={1}
                  value={bedRate}
                  onChange={(e) => {
                    setBedRate(Math.max(1, Number(e.target.value) || 1));
                    setSaveStatus("idle");
                  }}
                  className="w-14 bg-transparent text-center font-black outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setBedRate((p) => p + 5);
                  setSaveStatus("idle");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border-default text-xs font-bold text-text-primary hover:border-primary active:scale-95"
              >
                +5
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border-default bg-subtle p-3.5 gap-2">
            <span className="text-xs font-bold text-text-primary">Per Bathroom</span>
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setBathRate((p) => Math.max(5, p - 5));
                  setSaveStatus("idle");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border-default text-xs font-bold text-text-primary hover:border-primary active:scale-95"
              >
                -5
              </button>
              <div className="flex items-center font-black text-lg text-text-primary">
                <span>$</span>
                <input
                  type="number"
                  min={1}
                  value={bathRate}
                  onChange={(e) => {
                    setBathRate(Math.max(1, Number(e.target.value) || 1));
                    setSaveStatus("idle");
                  }}
                  className="w-14 bg-transparent text-center font-black outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setBathRate((p) => p + 5);
                  setSaveStatus("idle");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border-default text-xs font-bold text-text-primary hover:border-primary active:scale-95"
              >
                +5
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-default bg-surface p-5 shadow-xs flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-0.5 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <span>✨</span> Add-On Services
          </h2>
          <p className="text-xs text-text-muted">
            Toggle services on/off or modify their price in the quote engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {addOnsState.map((addon) => (
            <div
              key={addon.id}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                addon.enabled
                  ? "border-border-default bg-surface"
                  : "border-border-subtle bg-subtle opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToggleAddOn(addon.id)}
                  className={`flex h-5 w-9 items-center rounded-full transition-colors p-0.5 ${
                    addon.enabled ? "bg-primary" : "bg-border-default"
                  }`}
                  aria-label={`Toggle ${addon.name}`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-surface shadow-xs transition-transform ${
                      addon.enabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold text-text-primary">
                  {addon.name}
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-border-default bg-subtle px-2 py-1">
                <span className="text-xs font-bold text-text-muted">$</span>
                <input
                  type="number"
                  min={0}
                  value={addon.price}
                  onChange={(e) =>
                    handleAddOnPriceChange(addon.id, Number(e.target.value) || 0)
                  }
                  className="w-10 bg-transparent text-right text-xs font-bold text-text-primary outline-hidden"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border-default bg-surface p-5 shadow-xs flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-0.5 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <span>📍</span> Key Service Neighborhoods
          </h2>
          <p className="text-xs text-text-muted">
            Neighborhoods displayed on the website as verified service coverage areas.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 rounded-lg border border-border-default bg-subtle px-2.5 py-1 text-xs font-semibold text-text-primary"
              >
                <span>{area}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveArea(area)}
                  className="text-text-muted hover:text-destructive"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddArea} className="flex gap-2 max-w-sm mt-1">
            <input
              type="text"
              value={newAreaInput}
              onChange={(e) => setNewAreaInput(e.target.value)}
              placeholder="e.g. Highland Park"
              className="flex-1 rounded-lg border border-border-default bg-subtle px-3 py-1.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-text-inverse hover:bg-primary-hover shrink-0"
            >
              + Add Area
            </button>
          </form>
        </div>
      </div>

      <GalleryManager slug={brand.slug} gallery={tenant.gallery} />

      {isDirty && (
        <div className="fixed bottom-3 inset-x-3 z-40 mx-auto max-w-2xl">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary bg-surface/95 p-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
              <span className="font-bold text-primary">Unsaved updates</span>
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="rounded bg-subtle px-2 py-0.5 text-[11px] font-semibold text-text-muted hover:text-text-primary"
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAllSettings}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-extrabold text-text-inverse shadow-xs transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? "Syncing..." : "⚡ Save & Publish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
