import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/services/tenant.service";
import { getOwnerSession } from "@/lib/auth-guard";
import { OwnerPortalView } from "@/components/owner/owner-portal-view";

export const instant = false;

interface OwnerPageProps {
  params: Promise<{ tenant: string }>;
}

export const metadata = {
  title: "Owner Command Deck | Residential Cleaning Portal",
  description: "Secure operational control panel for pricing and dispatch management.",
};

async function OwnerPortalResolver({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const session = await getOwnerSession(slug);
  const isAuthenticated = Boolean(session);

  return (
    <div className="min-h-screen bg-canvas">
      <OwnerPortalView
        tenant={tenant}
        initialAuthenticated={isAuthenticated}
      />
    </div>
  );
}

export default function OwnerPage({ params }: OwnerPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <OwnerPortalResolver params={params} />
    </Suspense>
  );
}
