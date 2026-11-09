import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllTenants } from "@/services/tenant.service";
import { TenantCreatorForm } from "@/components/admin/tenant-creator-form";
import { TenantListManager } from "@/components/admin/tenant-list-manager";
import { getAdminSession } from "@/lib/auth-guard";
import { logoutAdminAction } from "@/app/actions/admin.actions";

export const instant = false;

export const metadata = {
  title: "Admin Command Center | Instant Client Site Generator",
  description: "Rapidly provision custom residential cleaning portals in under 2 minutes.",
};

async function AdminDashboardContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const tenants = await getAllTenants();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary px-4 py-8 sm:px-8 sm:py-12">
      <main className="mx-auto w-full max-w-5xl flex flex-col gap-10">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-default pb-6">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
              Direct Pitch & Cold Outreach Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Client Site Generator & Outlets
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-border-default bg-surface px-4 py-2 text-xs font-bold text-text-primary transition-colors hover:border-primary"
            >
              ← Master Directory
            </Link>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-destructive-subtle px-3.5 py-2 text-xs font-bold text-destructive hover:bg-destructive hover:text-text-inverse transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Rapid Provisioning Form Island */}
        <TenantCreatorForm />

        {/* Existing Outlets Manager Island */}
        <TenantListManager tenants={tenants} />
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
