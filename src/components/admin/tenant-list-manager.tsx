"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Tenant } from "@/entities/tenant/schema";
import { deleteTenantAction } from "@/app/actions/tenant.actions";

interface TenantListManagerProps {
  tenants: Tenant[];
}

export function TenantListManager({ tenants }: TenantListManagerProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCopyLink = (slug: string, pitch = false) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const previewUrl = pitch ? `${origin}/${slug}?pitch=true` : `${origin}/${slug}`;
    navigator.clipboard.writeText(previewUrl);
    setCopiedSlug(pitch ? `${slug}-pitch` : slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDelete = (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to remove '${name}' (${slug})?`)) return;

    startTransition(async () => {
      await deleteTenantAction(slug);
    });
  };

  return (
    <div className="w-full flex flex-col gap-3 text-left">
      <div className="flex items-center justify-between border-b border-border-default pb-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
          Active Client Outlets ({tenants.length})
        </h2>
        <span className="text-[11px] text-text-muted">
          Edge-cached live sync
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tenants.map((t) => (
          <div
            key={t.brand.slug}
            className="flex flex-col justify-between rounded-xl border border-border-default bg-surface p-4 shadow-xs transition-all hover:border-primary"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-text-primary">
                    {t.brand.name}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {t.brand.location.city}, {t.brand.location.state}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="h-3 w-3 rounded-full border border-border-default"
                    style={{ backgroundColor: t.brand.themeOverrides?.primaryColor || "#0F766E" }}
                    title="Primary"
                  />
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-border-default"
                    style={{ backgroundColor: t.brand.themeOverrides?.accentColor || "#0D9488" }}
                    title="Accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-0.5 text-xs text-text-secondary">
                <span>Phone: <strong className="text-text-primary">{t.brand.phone}</strong></span>
                <span>SMS / WhatsApp: <strong className="font-mono text-text-primary">{t.brand.whatsappNumber}</strong></span>
                <span className="text-text-muted text-[11px]">
                  ${t.pricing.baseDispatchFee} base • ${t.pricing.ratePerBedroom}/bed • ${t.pricing.ratePerBathroom}/bath
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between gap-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleCopyLink(t.brand.slug, false)}
                  className="rounded bg-subtle px-2 py-1 text-xs font-semibold text-text-primary hover:bg-border-default transition-colors"
                >
                  {copiedSlug === t.brand.slug ? "Copied! ✓" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLink(t.brand.slug, true)}
                  className="rounded bg-primary-subtle px-2 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-text-inverse transition-colors"
                  title="Pitch Link"
                >
                  {copiedSlug === `${t.brand.slug}-pitch` ? "Copied! ✓" : "Pitch Link"}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`sms:${t.brand.phone}?&body=Test%20ping`}
                  className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                  title="Send Test SMS"
                >
                  SMS
                </a>

                <Link
                  href={`/${t.brand.slug}`}
                  target="_blank"
                  className="rounded bg-primary px-2.5 py-1 text-xs font-bold text-text-inverse hover:bg-primary-hover transition-colors"
                >
                  Live →
                </Link>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(t.brand.slug, t.brand.name)}
                  className="rounded p-1 text-xs font-bold text-destructive hover:bg-destructive-subtle transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
