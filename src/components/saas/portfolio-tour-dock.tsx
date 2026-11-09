"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SparkleIcon, CheckIcon } from "@/components/ui/icons";

function PortfolioTourDockInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPitchMode = searchParams.get("pitch") === "true";

  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCredential = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const navItems = [
    {
      label: "1. SaaS Platform Landing",
      href: "/",
      badge: "Home",
      active: pathname === "/",
    },
    {
      label: "2. Stripe Checkout Simulator",
      href: "/checkout?plan=growth&billing=annual",
      badge: "4242 Card",
      active: Boolean(pathname?.startsWith("/checkout")),
    },
    {
      label: "3. Dallas Client Portal (Emerald)",
      href: "/sparkle-pro",
      badge: "Live Site",
      active: pathname === "/sparkle-pro" && !isPitchMode,
    },
    {
      label: "4. Miami Client Portal (Ocean)",
      href: "/azure-breeze",
      badge: "Multi-Theme",
      active: pathname === "/azure-breeze" && !isPitchMode,
    },
    {
      label: "5. Cold Outreach Pitch Mode",
      href: "/sparkle-pro?pitch=true",
      badge: "Claim Modal",
      active: isPitchMode,
    },
    {
      label: "6. Owner PIN Command Deck",
      href: "/sparkle-pro/owner",
      badge: "PIN: 1234",
      active: Boolean(pathname?.endsWith("/owner")),
    },
    {
      label: "7. Master Admin Gateway",
      href: "/admin",
      badge: "Protected",
      active: Boolean(pathname?.startsWith("/admin")),
    },
  ];

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 z-50 flex flex-col items-start">
      {isOpen && (
        <div className="mb-2.5 w-80 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-left text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black tracking-tight text-white">
                Interactive Portfolio Tour
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-1.5 py-0.5 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
            Jump between any multi-tenant layer or copy demo credentials in 1 click:
          </p>

          <div className="mt-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition-colors ${
                  item.active
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-200 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="truncate">{item.label}</span>
                <span className="ml-2 shrink-0 rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-800">
                  {item.badge}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => copyCredential("1234", "pin")}
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-[10px] font-mono font-bold text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
            >
              {copiedKey === "pin" ? (
                <>
                  <CheckIcon className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied 1234</span>
                </>
              ) : (
                <span>Copy PIN: 1234</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => copyCredential("AdminPristine2026!", "admin")}
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-[10px] font-mono font-bold text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
            >
              {copiedKey === "admin" ? (
                <>
                  <CheckIcon className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied Key!</span>
                </>
              ) : (
                <span>Copy Admin Key</span>
              )}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/90 px-3.5 py-2 text-xs font-black text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:bg-slate-900 active:scale-95"
      >
        <SparkleIcon className="h-3.5 w-3.5 text-emerald-400" />
        <span>Explore Architecture</span>
      </button>
    </div>
  );
}

export function PortfolioTourDock() {
  return (
    <Suspense fallback={null}>
      <PortfolioTourDockInner />
    </Suspense>
  );
}
