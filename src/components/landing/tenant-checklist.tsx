"use client";

import { useState } from "react";
import { ChecklistCategory } from "@/entities/tenant/schema";

interface TenantChecklistProps {
  checklist: ChecklistCategory[];
}

export function TenantChecklist({ checklist }: TenantChecklistProps) {
  const [activeTier, setActiveTier] = useState<"standard" | "deep" | "moveInOut">("deep");

  return (
    <section className="w-full border-t border-border-default bg-canvas py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl flex flex-col gap-10">
        <div className="text-center flex flex-col items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Complete Transparency
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
            Our 40-Point Cleaning Standard
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md">
            Review exactly what our team delivers in every room before leaving your premises.
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-surface border border-border-default w-full max-w-md mx-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTier("standard")}
            className={`flex-1 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-black transition-all whitespace-nowrap text-center ${
              activeTier === "standard"
                ? "bg-primary text-text-inverse shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => setActiveTier("deep")}
            className={`flex-1 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-black transition-all whitespace-nowrap text-center ${
              activeTier === "deep"
                ? "bg-primary text-text-inverse shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Deep Clean
          </button>
          <button
            type="button"
            onClick={() => setActiveTier("moveInOut")}
            className={`flex-1 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-black transition-all whitespace-nowrap text-center ${
              activeTier === "moveInOut"
                ? "bg-primary text-text-inverse shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Move-In / Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {checklist.map((cat) => (
            <div
              key={cat.category}
              className="rounded-2xl border border-border-default bg-surface p-5 flex flex-col gap-4 shadow-sm"
            >
              <h3 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {cat.category}
              </h3>
              <div className="flex flex-col gap-2.5">
                {cat.items.map((item) => {
                  const isIncluded = item[activeTier];
                  return (
                    <div
                      key={item.task}
                      className={`flex items-start gap-2.5 text-xs leading-relaxed ${
                        isIncluded ? "text-text-primary font-medium" : "text-text-muted/40 line-through"
                      }`}
                    >
                      <span className={isIncluded ? "text-success font-black" : "text-text-muted/40"}>
                        {isIncluded ? "✓" : "–"}
                      </span>
                      <span>{item.task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
