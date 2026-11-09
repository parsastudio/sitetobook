"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BillingCycle,
  SAAS_PLANS,
  SaasPlanId,
} from "@/entities/saas/plans";
import {
  DEFAULT_ACCENT_COLOR,
  DEFAULT_PRIMARY_COLOR,
} from "@/entities/tenant/schema";
import {
  CheckoutReceiptData,
  processStripeCheckoutAction,
} from "@/app/actions/checkout.actions";
import {
  CheckIcon,
  ShieldCheckIcon,
  ArrowUpRightIcon,
} from "@/components/ui/icons";

const BRAND_THEMES = [
  { name: "Emerald Heritage", primary: DEFAULT_PRIMARY_COLOR, accent: DEFAULT_ACCENT_COLOR },
  { name: "Ocean Navy", primary: "#1E3A8A", accent: "#0284C7" },
  { name: "Royal Purple", primary: "#4C1D95", accent: "#7C3AED" },
  { name: "Spruce & Mint", primary: "#0F766E", accent: "#0D9488" },
];

export function StripeCheckoutFlow() {
  const searchParams = useSearchParams();

  const initialPlanParam = searchParams.get("plan") as SaasPlanId | null;
  const initialBillingParam = searchParams.get("billing") as BillingCycle | null;
  const claimSlugParam = searchParams.get("claimSlug") || "";
  const claimNameParam = searchParams.get("claimName") || "";
  const claimCityParam = searchParams.get("claimCity") || "";
  const claimStateParam = searchParams.get("claimState") || "TX";
  const claimPhoneParam = searchParams.get("claimPhone") || "";

  const [selectedPlanId, setSelectedPlanId] = useState<SaasPlanId>(
    SAAS_PLANS.some((p) => p.id === initialPlanParam)
      ? (initialPlanParam as SaasPlanId)
      : "growth"
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initialBillingParam === "monthly" ? "monthly" : "annual"
  );

  const [step, setStep] = useState<"configure" | "payment" | "receipt">(
    claimSlugParam ? "payment" : "configure"
  );

  // Step 1: Portal Configuration State
  const [name, setName] = useState(claimNameParam);
  const [slug, setSlug] = useState(claimSlugParam);
  const [tagline, setTagline] = useState(
    claimCityParam
      ? `${claimCityParam}'s Premier Hotel-Standard Home Cleaning Crew`
      : ""
  );
  const [city, setCity] = useState(claimCityParam);
  const [state, setState] = useState(claimStateParam);
  const [phone, setPhone] = useState(
    claimPhoneParam || (claimSlugParam ? "+1 (214) 555-0189" : "")
  );
  const [email, setEmail] = useState(
    claimSlugParam ? `founder@${claimSlugParam.replace(/[^a-z0-9]/g, "")}.com` : ""
  );
  const [ownerPin, setOwnerPin] = useState("1234");
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);

  // Step 2: Stripe Card Simulator State
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [billingZip, setBillingZip] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<CheckoutReceiptData | null>(null);
  const [isPending, startTransition] = useTransition();

  const activePlan =
    SAAS_PLANS.find((p) => p.id === selectedPlanId) ?? SAAS_PLANS[1];
  const monthlyPrice =
    billingCycle === "annual"
      ? activePlan.annualMonthlyPrice
      : activePlan.monthlyPrice;
  const totalDueToday =
    billingCycle === "annual" ? monthlyPrice * 12 : monthlyPrice;
  const annualSavings =
    (activePlan.monthlyPrice - activePlan.annualMonthlyPrice) * 12;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!claimSlugParam) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleAutoFillDemoCompany = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setName("CrownLux Residential Maids");
    setSlug(`crownlux-${randomSuffix}`);
    setCity("Austin");
    setState("TX");
    setPhone("+1 (512) 555-0198");
    setEmail("founder@crownluxclean.com");
    setTagline("Austin's Five-Star Eco-Luxury Home Sanitization Team");
    setOwnerPin("1234");
    setPrimaryColor("#1E3A8A");
    setAccentColor("#0284C7");
    setErrorMsg(null);
  };

  const handleFillStripeTestCard = () => {
    setCardHolderName(name ? `${name} Corporate` : "Alex Rivera");
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/29");
    setCardCvc("424");
    setBillingZip("75201");
    setErrorMsg(null);
  };

  const formatCardNumberInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    setCardNumber(groups ? groups.join(" ") : digits);
  };

  const formatExpiryInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !city.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg("Please complete all required business fields.");
      return;
    }
    if (!/^\d{4}$/.test(ownerPin)) {
      setErrorMsg("Owner PIN must be exactly 4 digits.");
      return;
    }
    setErrorMsg(null);
    setStep("payment");
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCardDigits = cardNumber.replace(/\D/g, "");
    if (rawCardDigits.length < 15) {
      setErrorMsg("Please enter a valid 16-digit card number or click 'Fill Test Card (4242)'.");
      return;
    }
    const expiryMatch = cardExpiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!expiryMatch || Number(expiryMatch[2]) < 26) {
      setErrorMsg("Please enter a valid future expiration date (MM/YY).");
      return;
    }
    if (cardCvc.length < 3) {
      setErrorMsg("Please enter a valid 3 or 4 digit security CVC code.");
      return;
    }

    setErrorMsg(null);

    startTransition(async () => {
      const cleanDigitsPhone = phone.replace(/\D/g, "");
      const whatsappNumber =
        cleanDigitsPhone.length >= 10
          ? cleanDigitsPhone.startsWith("1")
            ? cleanDigitsPhone
            : `1${cleanDigitsPhone}`
          : "12145550199";

      const res = await processStripeCheckoutAction({
        name: name.trim() || "Premier Residential Cleaners",
        tagline:
          tagline.trim() ||
          `${city.trim() || "Metro"}'s Premier Hotel-Standard Home Cleaning Crew`,
        slug: slug.trim(),
        city: city.trim() || "Dallas",
        state: state.trim() || "TX",
        phone: phone.trim() || "+1 (214) 555-0199",
        whatsappNumber,
        email: email.trim() || "hello@sitetobook.com",
        primaryColor,
        accentColor,
        baseDispatchFee: 49,
        ratePerBedroom: 35,
        ratePerBathroom: 40,
        serviceAreas: [
          `Downtown ${city.trim() || "Metro"}`,
          `North ${city.trim() || "Metro"}`,
          `Uptown ${city.trim() || "Metro"}`,
        ],
        planId: selectedPlanId,
        billingCycle,
        ownerPin,
        cardHolderName: cardHolderName.trim() || "Verified Founder",
        cardLast4: rawCardDigits.slice(-4) || "4242",
        claimExistingSlug: Boolean(claimSlugParam),
      });

      if (!res.success) {
        setErrorMsg(res.error);
      } else {
        setReceipt(res.data);
        setStep("receipt");
      }
    });
  };

  if (step === "receipt" && receipt) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
        <div className="rounded-3xl border border-primary/30 bg-surface p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-text-inverse shadow-lg">
            <CheckIcon className="h-8 w-8" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              Stripe Payment Confirmed · {receipt.receiptId}
            </span>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-text-primary">
              <span className="font-serif italic text-primary">{receipt.businessName}</span>{" "}
              is Live!
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
              Your multi-tenant residential cleaning portal, 60-second quote engine, and owner command deck have been provisioned on the edge.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-border-default bg-canvas p-5 flex flex-col gap-3 text-left text-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <span className="font-bold text-text-muted uppercase">Subscription Tier</span>
              <span className="font-extrabold text-text-primary">
                {receipt.planName} ({receipt.billingCycle})
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <span className="font-bold text-text-muted uppercase">Amount Paid (Simulated)</span>
              <span className="font-extrabold text-primary">${receipt.amountCharged}.00 USD</span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <span className="font-bold text-text-muted uppercase">Live Portal Route</span>
              <span className="font-mono font-bold text-text-primary">/{receipt.slug}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-muted uppercase">Owner Command PIN</span>
              <span className="rounded-lg bg-primary-subtle px-2.5 py-1 font-mono font-black text-primary">
                {receipt.ownerPin} (Auto-Logged In ✓)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
            <Link
              href={`/${receipt.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover px-6 py-4 text-xs sm:text-sm font-black text-text-inverse shadow-md transition-all hover:scale-[1.01]"
            >
              <span>Visit Live Client Portal</span>
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>

            <Link
              href={`/${receipt.slug}/owner`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border-default bg-canvas hover:border-primary px-6 py-4 text-xs sm:text-sm font-extrabold text-text-primary transition-all"
            >
              <span>Open Owner Command Deck</span>
            </Link>
          </div>

          <div className="flex items-center justify-between w-full pt-4 border-t border-border-subtle text-xs text-text-muted">
            <Link href={`/${receipt.slug}?pitch=true`} className="font-bold text-primary hover:underline">
              Preview in Agency Pitch Mode →
            </Link>
            <Link href="/" className="hover:text-text-primary">
              ← Back to SaaS Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Stripe-Style Order Summary */}
        <div className="lg:col-span-5 rounded-3xl border border-border-default bg-slate-950 text-white p-6 sm:p-8 shadow-2xl flex flex-col justify-between gap-8 text-left">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
                <span>← Back to sitetobook.com</span>
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                Sandbox Mode
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Subscribe to {activePlan.name}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  ${totalDueToday}.00
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {billingCycle === "annual" ? "per year" : "per month"}
                </span>
              </div>
              {billingCycle === "annual" && (
                <span className="text-xs font-semibold text-emerald-400">
                  ✓ Includes 20% annual discount (${annualSavings}/yr saved)
                </span>
              )}
            </div>

            {/* Plan Switcher Pill */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Licensing Tier
              </span>
              <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800">
                {SAAS_PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`rounded-lg py-2 px-2 text-[11px] font-bold transition-all ${
                      selectedPlanId === p.id
                        ? "bg-white text-slate-950 shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  Annual Billing (Save 20%)
                </span>
                <span className="text-[11px] text-slate-400">
                  ${activePlan.annualMonthlyPrice}/mo billed yearly
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBillingCycle((b) => (b === "annual" ? "monthly" : "annual"))
                }
                className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                  billingCycle === "annual" ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                    billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Invoice Line Items */}
            <div className="flex flex-col gap-2.5 border-t border-slate-800 pt-4 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{activePlan.name} License</span>
                <span className="font-semibold">${monthlyPrice}/mo</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Instant Edge Subdomain & SSL</span>
                <span className="text-emerald-400 font-semibold">Included</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>0% Booking Commission Guarantee</span>
                <span className="text-emerald-400 font-semibold">Included</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3 text-sm font-black text-white">
                <span>Total due today</span>
                <span>${totalDueToday}.00 USD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-t border-slate-800 pt-4 text-[11px] text-slate-400">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Interactive portfolio checkout simulator. No real credit card is charged.
            </span>
          </div>
        </div>

        {/* Right Column: Multi-Step Configuration & Stripe Card Form */}
        <div className="lg:col-span-7 rounded-3xl border border-border-default bg-surface p-6 sm:p-10 shadow-xl flex flex-col gap-6 text-left">
          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-border-default pb-4">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep("configure")}
                className={`flex items-center gap-2 text-xs font-extrabold ${
                  step === "configure" ? "text-primary" : "text-text-muted"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                    step === "configure"
                      ? "bg-primary text-text-inverse"
                      : "bg-primary-subtle text-primary"
                  }`}
                >
                  1
                </span>
                <span>1. Portal Setup</span>
              </button>
              <span className="text-border-default">/</span>
              <span
                className={`flex items-center gap-2 text-xs font-extrabold ${
                  step === "payment" ? "text-primary" : "text-text-muted"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                    step === "payment"
                      ? "bg-primary text-text-inverse"
                      : "bg-subtle text-text-muted"
                  }`}
                >
                  2
                </span>
                <span>2. Stripe Checkout</span>
              </span>
            </div>

            {step === "configure" ? (
              <button
                type="button"
                onClick={handleAutoFillDemoCompany}
                className="inline-flex items-center rounded-xl border border-primary/25 bg-primary-subtle px-3 py-1.5 text-[11px] font-black text-primary hover:bg-primary hover:text-text-inverse transition-colors"
              >
                Auto-Fill Demo Company
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFillStripeTestCard}
                className="inline-flex items-center rounded-xl border border-primary/25 bg-primary-subtle px-3 py-1.5 text-[11px] font-black text-primary hover:bg-primary hover:text-text-inverse transition-colors"
              >
                Fill Test Card (4242)
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-destructive/30 bg-destructive-subtle p-3 text-xs font-bold text-destructive">
              ✕ {errorMsg}
            </div>
          )}

          {step === "configure" ? (
            <form onSubmit={handleContinueToPayment} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Cleaning Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Emerald City Maids"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Portal URL Slug *
                  </label>
                  <div className="flex items-center rounded-xl border border-border-default bg-subtle px-3 py-2.5 focus-within:border-border-focus focus-within:bg-surface">
                    <span className="text-xs font-mono text-text-muted">/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) =>
                        setSlug(
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                        )
                      }
                      placeholder="emerald-maids"
                      className="w-full bg-transparent text-sm font-mono font-bold text-text-primary outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Primary City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Seattle"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    State Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="WA"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Direct SMS / Dispatch Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (206) 555-0149"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Founder Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@emeraldmaids.com"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Hero Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Five-Star Hotel Standard Residential Cleaning"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    4-Digit Owner PIN *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={ownerPin}
                    onChange={(e) =>
                      setOwnerPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="1234"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-mono font-black text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-xs font-bold text-text-secondary">
                  Select Brand Color Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BRAND_THEMES.map((theme) => {
                    const active = primaryColor === theme.primary;
                    return (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(theme.primary);
                          setAccentColor(theme.accent);
                        }}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all ${
                          active
                            ? "border-primary bg-primary-subtle ring-1 ring-primary"
                            : "border-border-default bg-canvas hover:border-primary/40"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full shrink-0"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="font-bold text-[11px] text-text-primary truncate">
                          {theme.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-primary hover:bg-primary-hover py-4 text-xs sm:text-sm font-black text-text-inverse shadow-md transition-all active:scale-[0.99]"
              >
                Continue to Stripe Checkout →
              </button>
            </form>
          ) : (
            <form onSubmit={handleCompletePayment} className="flex flex-col gap-4">
              <div className="rounded-2xl border border-border-default bg-canvas p-3.5 flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="font-extrabold text-text-primary">
                    {name || "Your Cleaning Portal"} (/{slug || "demo"})
                  </span>
                  <span className="text-text-muted">
                    {city || "Dallas"}, {state} · Owner PIN: {ownerPin}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("configure")}
                  className="font-bold text-primary hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text-secondary">
                      Card Information (Simulated Stripe Element) *
                    </label>
                    <span className="text-[11px] font-mono font-bold text-primary">
                      VISA · MASTERCARD · AMEX
                    </span>
                  </div>
                  <div className="rounded-2xl border border-border-default bg-subtle overflow-hidden focus-within:border-border-focus focus-within:bg-surface">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => formatCardNumberInput(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full border-b border-border-default bg-transparent px-3.5 py-3 text-sm font-mono font-bold text-text-primary outline-hidden"
                    />
                    <div className="grid grid-cols-2 divide-x divide-border-default">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => formatExpiryInput(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full bg-transparent px-3.5 py-2.5 text-sm font-mono font-semibold text-text-primary outline-hidden"
                      />
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) =>
                          setCardCvc(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="CVC"
                        className="w-full bg-transparent px-3.5 py-2.5 text-sm font-mono font-semibold text-text-primary outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-secondary">
                    Billing ZIP / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    placeholder="75201"
                    className="rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-primary hover:bg-primary-hover py-4 text-xs sm:text-sm font-black text-text-inverse shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {isPending
                  ? "Provisioning Edge Route..."
                  : `Pay $${totalDueToday}.00 & Launch Portal →`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
