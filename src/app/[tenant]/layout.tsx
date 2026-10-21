import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTenants, getTenantBySlug } from "@/services/tenant.service";
import { sanitizeTenantForPublic } from "@/entities/tenant/schema";
import { ClaimSiteBanner } from "@/components/pitch/claim-site-banner";
import { TenantNavbar } from "@/components/landing/tenant-navbar";
import { TenantFooter } from "@/components/landing/tenant-footer";
import { TenantMobileBar } from "@/components/landing/tenant-mobile-bar";

export const instant = false;

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export async function generateStaticParams() {
  const tenants = await getAllTenants();
  return tenants.map((tenant) => ({
    tenant: tenant.brand.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    return {
      title: "Cleaner Not Found | PristineClean",
      description: "Verified residential cleaning provider.",
    };
  }

  const { brand, trust } = tenant;

  return {
    metadataBase: new URL(`https://${brand.slug}.pristineclean.com`),
    title: `${brand.name} | ${brand.location.city} Residential Cleaning`,
    description: `${brand.tagline}. Bonded, insured, and background-checked home cleaning in ${brand.location.city}, ${brand.location.state}. Rated ${trust.googleRating}★ by local homeowners.`,
    openGraph: {
      title: `${brand.name} - Instant Home Cleaning Quote`,
      description: `Get an instant pricing estimate for 5-star house cleaning in ${brand.location.city}.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} | ${brand.location.city} Residential Cleaning`,
      description: `${brand.tagline}. Bonded, insured, and verified 5-star home cleaning.`,
    },
  };
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const publicTenant = sanitizeTenantForPublic(tenant);
  const dynamicStyles: Record<string, string> = {};
  if (tenant.brand.themeOverrides?.primaryColor) {
    dynamicStyles["--primary"] = tenant.brand.themeOverrides.primaryColor;
  }
  if (tenant.brand.themeOverrides?.accentColor) {
    dynamicStyles["--accent"] = tenant.brand.themeOverrides.accentColor;
  }

  return (
    <div
      style={dynamicStyles as React.CSSProperties}
      className="min-h-screen flex flex-col bg-canvas text-text-primary selection:bg-primary-subtle selection:text-primary"
    >
      <TenantNavbar brand={publicTenant.brand} trust={publicTenant.trust} />

      <main className="flex-1">{children}</main>

      <ClaimSiteBanner tenant={publicTenant} />

      <TenantMobileBar brand={publicTenant.brand} trust={publicTenant.trust} />

      <TenantFooter tenant={publicTenant} />
    </div>
  );
}
