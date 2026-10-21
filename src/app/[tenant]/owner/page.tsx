import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/services/tenant.service";
import { getOwnerSession } from "@/lib/auth-guard";
import { OwnerPortalView } from "@/components/owner/owner-portal-view";

interface OwnerPageProps {
  params: Promise<{ tenant: string }>;
}

export const instant = false;

export const metadata = {
  title: "Owner Command Deck | Residential Cleaning Portal",
  description: "Secure operational control panel for pricing and dispatch management.",
};

export default async function OwnerPage({ params }: OwnerPageProps) {
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
