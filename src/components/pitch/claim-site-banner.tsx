"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PublicTenant } from "@/entities/tenant/schema";
import { submitClaimLeadAction } from "@/app/actions/lead.actions";

interface ClaimSiteBannerProps {
  tenant: PublicTenant;
}

function ClaimSiteBannerInner({ tenant }: ClaimSiteBannerProps) {
  const searchParams = useSearchParams();
  const isPitchMode =
    searchParams.get("pitch") === "true" || searchParams.get("claim") === "true";

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isPitchMode || isDismissed) {
    return null;
  }

  const agencyWhatsappNumber =
    process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || tenant.brand.whatsappNumber;

  const claimWhatsappUrl = `https://wa.me/${agencyWhatsappNumber}?text=${encodeURIComponent(
    `Hi! I am the owner of ${tenant.brand.name} in ${tenant.brand.location.city}. I reviewed the custom website demo you built for us and would like to claim it and connect our custom domain.`
  )}`;

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerPhone.trim()) return;
    setErrorMessage(null);

    startTransition(async () => {
      const res = await submitClaimLeadAction({
        slug: tenant.brand.slug,
        contact: ownerPhone.trim(),
        businessName: tenant.brand.name,
        city: tenant.brand.location.city,
      });

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-xl">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-text-primary/95 p-3 sm:p-3.5 shadow-2xl backdrop-blur-lg text-text-inverse">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-text-inverse font-black text-sm">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black">
                Official Agency Demo: {tenant.brand.name}
              </span>
              <span className="text-[11px] text-text-inverse/70 hidden sm:inline">
                Turnkey dispatch site ready for transfer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-xs font-black text-text-primary shadow-xs transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Transfer Domain →
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="rounded-xl p-2 text-xs font-bold text-text-inverse/70 hover:bg-white/10 transition-colors"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Claim Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-border-default bg-surface p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-subtle text-xs font-bold text-text-secondary hover:bg-border-default"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex flex-col gap-1.5 text-left pr-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Exclusive Opportunity
              </span>
              <h3 className="text-2xl font-black tracking-tight text-text-primary">
                Own {tenant.brand.name}&apos;s Official Online Portal
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Stop losing residential cleaning clients to competitors with outdated sites. This custom platform is already configured with your pricing, brand colors, and direct WhatsApp quote dispatch.
              </p>
            </div>

            {/* 3 Killer Value Propositions */}
            <div className="flex flex-col gap-3 text-left">
              <div className="rounded-xl border border-border-default bg-subtle p-3 flex items-start gap-3">
                <span className="text-base">⚡</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">
                    Instant 0.8s Loading Speed
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Engineered with Next.js 16 modern caching. Zero lag, 100% mobile-optimized.
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border-default bg-subtle p-3 flex items-start gap-3">
                <span className="text-base">💬</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">
                    Automated Quote-to-WhatsApp Funnel
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Homeowners calculate rooms & add-ons and send pre-filled booking requests directly to your phone.
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border-default bg-subtle p-3 flex items-start gap-3">
                <span className="text-base">🛡️</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">
                    High-Trust Conversion Design
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Includes $2M liability badges, satisfaction guarantees, and before/after proof sliders.
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Options */}
            {isSubmitted ? (
              <div className="rounded-2xl border border-success/30 bg-success-subtle p-4 text-center">
                <span className="text-sm font-bold text-success">
                  ✓ Request Received!
                </span>
                <p className="text-xs text-text-secondary mt-1">
                  We will contact you shortly to transfer domain ownership and connect your official business email.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a
                  href={claimWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp px-6 py-3.5 text-sm font-bold text-text-inverse shadow-sm transition-all hover:brightness-105"
                >
                  <span className="text-base">💬</span>
                  Claim Instantly via WhatsApp
                </a>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border-subtle" />
                  <span className="text-[11px] text-text-muted font-semibold uppercase">
                    Or Request a 5-Min Walkthrough
                  </span>
                  <div className="h-px flex-1 bg-border-subtle" />
                </div>

                {errorMessage && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive-subtle px-3 py-2 text-xs font-semibold text-destructive">
                    ✕ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitLead} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="Enter your phone or email"
                    className="flex-1 rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-xs font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-text-inverse hover:bg-primary-hover disabled:opacity-50 transition-colors"
                  >
                    {isPending ? "Connecting..." : "Connect Domain"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function ClaimSiteBanner({ tenant }: ClaimSiteBannerProps) {
  return (
    <Suspense fallback={null}>
      <ClaimSiteBannerInner tenant={tenant} />
    </Suspense>
  );
}
