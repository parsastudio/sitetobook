"use client";

import { useState } from "react";
import Link from "next/link";
import { BillingCycle, SAAS_PLANS } from "@/entities/saas/plans";
import { CheckIcon } from "@/components/ui/icons";

export function SaasPricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("annual");

  return (
    <section id="pricing" className="w-full py-20 px-4 sm:px-6 bg-surface border-t border-border-default scroll-mt-16">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
            Flat-Rate Licensing
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-text-primary leading-tight">
            One New Cleaning Client Pays for{" "}
            <span className="font-serif italic text-primary">Your Entire Year</span>
          </h2>
          <p className="text-xs sm:text-base text-text-secondary leading-relaxed">
            Zero commission on your bookings. Flat subscription pricing with instant automated provisioning.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-2xl border border-border-default bg-canvas p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                billing === "monthly"
                  ? "bg-surface text-text-primary shadow-xs border border-border-default"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                billing === "annual"
                  ? "bg-primary text-text-inverse shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span>Annual Billing</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                  billing === "annual"
                    ? "bg-white/20 text-white"
                    : "bg-primary-subtle text-primary"
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
          {SAAS_PLANS.map((plan) => {
            const activePrice =
              billing === "annual" ? plan.annualMonthlyPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 sm:p-8 text-left transition-all ${
                  plan.isPopular
                    ? "border-primary bg-canvas shadow-xl ring-2 ring-primary/20 lg:-translate-y-2"
                    : "border-border-default bg-surface shadow-xs hover:border-primary/40"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-widest text-text-inverse shadow-md whitespace-nowrap">
                    Most Popular Choice
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-extrabold text-text-primary">
                        {plan.name}
                      </span>
                      <span className="rounded-lg border border-border-default bg-subtle px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                        {plan.badge}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 border-y border-border-default py-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
                        ${activePrice}
                      </span>
                      <span className="text-xs font-semibold text-text-muted">
                        / month
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-text-muted">
                      {billing === "annual"
                        ? `Billed annually ($${activePrice * 12}/yr) · Cancel anytime`
                        : "Billed monthly · No long-term contract"}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-xs font-medium text-text-primary leading-snug"
                      >
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary mt-0.5">
                          <CheckIcon className="h-2.5 w-2.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={`/checkout?plan=${plan.id}&billing=${billing}`}
                    className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-black transition-all active:scale-[0.98] ${
                      plan.isPopular
                        ? "bg-primary text-text-inverse hover:bg-primary-hover shadow-md"
                        : "border border-border-default bg-canvas text-text-primary hover:border-primary hover:bg-primary hover:text-text-inverse"
                    }`}
                  >
                    <span>{plan.ctaLabel}</span>
                    <span className="ml-1.5">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
