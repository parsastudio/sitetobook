"use client";

import { useState, useTransition, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tenant } from "@/entities/tenant/schema";
import {
  verifyOwnerPinAction,
  logoutOwnerAction,
  updateOwnerSettingsAction,
} from "@/app/actions/owner.actions";
import { GalleryManager } from "@/components/owner/gallery-manager";
import {
  PhoneIcon,
  CurrencyIcon,
  SparkleIcon,
  PinLocationIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";

interface OwnerPortalViewProps {
  tenant: Tenant;
  initialAuthenticated: boolean;
}

export function OwnerPortalView({
  tenant,
  initialAuthenticated,
}: OwnerPortalViewProps) {
  const { brand, pricing } = tenant;
  const router = useRouter();
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

  const [savedBaseline, setSavedBaseline] = useState(() => ({
    baseFee: pricing.baseDispatchFee,
    bedRate: pricing.ratePerBedroom,
    bathRate: pricing.ratePerBathroom,
    phone: brand.phone,
    whatsappNumber: brand.whatsappNumber,
    serviceAreas: brand.location.serviceAreas,
    addOns: pricing.addOns.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
      enabled: a.enabled !== false,
    })),
  }));

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isSaving, startSaveTransition] = useTransition();

  const submitPin = useCallback(
    (pinToTest: string) => {
      startVerifyTransition(async () => {
        const res = await verifyOwnerPinAction(brand.slug, pinToTest);
        if (res.success) {
          setIsAuthenticated(true);
        } else {
          setPinError(res.error);
          setPin("");
        }
      });
    },
    [brand.slug]
  );

  const handleKeyClick = useCallback(
    (digit: string) => {
      if (isVerifying || pin.length >= 4) return;
      setPinError(null);
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        submitPin(nextPin);
      }
    },
    [pin, isVerifying, submitPin]
  );

  const handleBackspace = useCallback(() => {
    if (isVerifying) return;
    setPinError(null);
    setPin((prev) => prev.slice(0, -1));
  }, [isVerifying]);

  const handleClear = useCallback(() => {
    if (isVerifying) return;
    setPinError(null);
    setPin("");
  }, [isVerifying]);

  useEffect(() => {
    if (isAuthenticated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (isVerifying) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeyClick(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape" || e.key === "Delete") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, isVerifying, handleKeyClick, handleBackspace, handleClear]);

  const isDirty = useMemo(() => {
    if (baseFee !== savedBaseline.baseFee) return true;
    if (bedRate !== savedBaseline.bedRate) return true;
    if (bathRate !== savedBaseline.bathRate) return true;
    if (phone !== savedBaseline.phone) return true;
    if (whatsappNumber !== savedBaseline.whatsappNumber) return true;
    if (newAreaInput.trim().length > 0) return true;
    if (JSON.stringify(serviceAreas) !== JSON.stringify(savedBaseline.serviceAreas)) return true;

    return addOnsState.some((current) => {
      const original = savedBaseline.addOns.find((a) => a.id === current.id);
      return (
        !original ||
        original.price !== current.price ||
        original.enabled !== current.enabled
      );
    });
  }, [
    baseFee,
    bedRate,
    bathRate,
    phone,
    whatsappNumber,
    newAreaInput,
    serviceAreas,
    addOnsState,
    savedBaseline,
  ]);

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
    setBaseFee(savedBaseline.baseFee);
    setBedRate(savedBaseline.bedRate);
    setBathRate(savedBaseline.bathRate);
    setAddOnsState(savedBaseline.addOns.map((a) => ({ ...a })));
    setPhone(savedBaseline.phone);
    setWhatsappNumber(savedBaseline.whatsappNumber);
    setServiceAreas([...savedBaseline.serviceAreas]);
    setNewAreaInput("");
    setSaveStatus("idle");
    setSaveErrorMsg(null);
  };

  const handleSaveAllSettings = () => {
    setSaveStatus("idle");
    setSaveErrorMsg(null);

    const pendingArea = newAreaInput.trim();
    const nextServiceAreas =
      pendingArea && !serviceAreas.includes(pendingArea)
        ? [...serviceAreas, pendingArea]
        : serviceAreas;

    const cleanPhone = phone.trim();
    const cleanWhatsapp = whatsappNumber.replace(/\D/g, "");

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
        phone: cleanPhone,
        whatsappNumber: cleanWhatsapp,
        serviceAreas: nextServiceAreas,
      });

      if (res.success) {
        setServiceAreas(nextServiceAreas);
        setNewAreaInput("");
        setPhone(cleanPhone);
        setWhatsappNumber(cleanWhatsapp);
        setSavedBaseline({
          baseFee,
          bedRate,
          bathRate,
          phone: cleanPhone,
          whatsappNumber: cleanWhatsapp,
          serviceAreas: nextServiceAreas,
          addOns: addOnsState.map((a) => ({ ...a })),
        });
        setSaveStatus("success");
        setLastSyncTime(
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        router.refresh();
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setSaveErrorMsg(res.error);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-12 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm rounded-3xl border border-primary/20 bg-surface/90 p-7 sm:p-9 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-text-inverse shadow-md border border-white/20">
              <SparkleIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-serif font-bold tracking-tight text-text-primary">
                {brand.name}
              </h1>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">
                Owner Command Deck
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 my-1">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-200 ${
                    isFilled
                      ? "border-primary bg-primary scale-125 shadow-xs"
                      : "border-border-default bg-canvas/80"
                  }`}
                />
              );
            })}
          </div>

          {pinError && (
            <div className="w-full rounded-xl border border-destructive/30 bg-destructive-subtle px-3.5 py-2 text-xs font-bold text-destructive text-center">
              ✕ {pinError}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[250px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={isVerifying}
                onClick={() => handleKeyClick(digit)}
                className="flex h-13 items-center justify-center rounded-2xl border border-border-default/90 bg-canvas/70 text-lg font-black text-text-primary shadow-xs transition-all hover:border-primary/50 hover:bg-surface hover:scale-[1.03] active:scale-95 disabled:opacity-50"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="flex h-13 items-center justify-center rounded-2xl border border-transparent bg-transparent text-xs font-extrabold text-text-muted hover:text-text-primary transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={isVerifying}
              onClick={() => handleKeyClick("0")}
              className="flex h-13 items-center justify-center rounded-2xl border border-border-default/90 bg-canvas/70 text-lg font-black text-text-primary shadow-xs transition-all hover:border-primary/50 hover:bg-surface hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="flex h-13 items-center justify-center rounded-2xl border border-transparent bg-transparent text-sm font-extrabold text-text-muted hover:text-text-primary transition-colors"
            >
              ⌫
            </button>
          </div>

          <div className="flex flex-col items-center gap-1.5 border-t border-border-default/80 pt-4 w-full text-center">
            <span className="text-[11px] text-text-muted font-medium">
              Physical keyboard input supported
            </span>
            <span className="text-[11px] text-text-secondary font-bold">
              Default demo PIN: <strong className="font-mono text-primary">1234</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10 flex flex-col gap-6 pb-28">
      <div className="flex items-center justify-between gap-4 border-b border-border-default pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-text-inverse shadow-xs">
            <SparkleIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-serif font-bold text-text-primary">
                {brand.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-subtle px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                Active
              </span>
            </div>
            <span className="text-xs text-text-muted">
              {brand.location.city}, {brand.location.state} · Operational Controls
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
            Lock Session
          </button>
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="rounded-xl border border-primary/30 bg-primary-subtle p-3 text-xs font-semibold text-primary flex items-center justify-between shadow-xs">
          <span>✓ Changes synced live across edge caches {lastSyncTime && `(${lastSyncTime})`}</span>
          <Link href={`/${brand.slug}`} className="underline font-bold">
            Preview →
          </Link>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive-subtle p-3 text-xs font-semibold text-destructive">
          ✕ {saveErrorMsg || "Failed to save updates. Please try again."}
        </div>
      )}

      <div className="rounded-2xl border border-primary/25 bg-surface p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                {brand.subscription?.planName ?? "Growth Fleet"} License
              </span>
              <span className="rounded-md bg-subtle px-2 py-0.5 font-mono text-[10px] font-bold text-text-secondary">
                VISA •••• {brand.subscription?.cardLast4 ?? "4242"}
              </span>
              <span className="rounded-md bg-primary-subtle px-2 py-0.5 text-[10px] font-bold text-primary">
                {brand.subscription?.billingCycle === "monthly" ? "Monthly" : "Annual"} · Active
              </span>
            </div>
            <span className="text-xs text-text-secondary mt-1">
              Route: <strong className="font-mono text-text-primary">/{brand.slug}</strong>{" "}
              {brand.customDomain ? `(${brand.customDomain})` : "· Edge SSL & Zero Commission"}
            </span>
          </div>
        </div>

        <Link
          href={`/checkout?plan=agency&billing=annual&claimSlug=${brand.slug}&claimName=${encodeURIComponent(brand.name)}&claimCity=${encodeURIComponent(brand.location.city)}`}
          className="inline-flex items-center justify-center rounded-xl border border-border-default bg-canvas hover:border-primary px-3.5 py-2 text-xs font-bold text-text-primary transition-colors shrink-0"
        >
          Upgrade Plan ↗
        </Link>
      </div>

      <div className="rounded-2xl border border-border-default bg-surface p-5 shadow-xs flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-0.5 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-primary" />
            <span>Direct Dispatch Lines</span>
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
              SMS / Mobile Line (Digits Only)
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
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <CurrencyIcon className="h-4 w-4 text-primary" />
            <span>Base Pricing & Room Rates</span>
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
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <SparkleIcon className="h-4 w-4 text-primary" />
            <span>Add-On Services</span>
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
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <PinLocationIcon className="h-4 w-4 text-primary" />
            <span>Key Service Neighborhoods</span>
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
              {isSaving ? "Syncing..." : "Save & Publish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
