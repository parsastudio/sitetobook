import { Suspense } from "react";
import type { Metadata } from "next";
import { StripeCheckoutFlow } from "@/components/saas/stripe-checkout-flow";

export const metadata: Metadata = {
  title: "Checkout & Instant Portal Onboarding | SiteToBook",
  description:
    "Configure your residential cleaning portal and complete instant onboarding on SiteToBook.",
};

function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-5 h-[520px] rounded-3xl bg-subtle" />
      <div className="lg:col-span-7 h-[520px] rounded-3xl bg-surface border border-border-default" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col justify-center">
      <Suspense fallback={<CheckoutSkeleton />}>
        <StripeCheckoutFlow />
      </Suspense>
    </div>
  );
}
