"use client";

import { useState } from "react";
import { ChecklistCategory } from "@/entities/tenant/schema";
import { CheckIcon } from "@/components/ui/icons";

interface TenantChecklistProps {
  checklist: ChecklistCategory[];
}

export function TenantChecklist({ checklist }: TenantChecklistProps) {
  const [activeTier, setActiveTier] = useState<"standard" | "deep" | "moveInOut">("deep");

  return (
    <section className="w-full border-t border-border-default bg-canvas py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl flex flex-col gap-10">
        <div className="text-center flex flex-col items-center gap-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary">
            Standard of Excellence
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-text-primary tracking-tight">
            The 40-Point Hotel-Grade <span className="font-serif italic text-primary">Scope of Work</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md">
            Review exactly what our team inspects and delivers in every room before leaving your premises.
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-surface border border-border-default w-full max-w-md mx-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTier("standard")}
            className={`flex-1 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-all whitespace-nowrap text-center ${
              activeTier === "standard"
                ? "bg-primary text-text-inverse shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => setActiveTier("deep")}
            className={`flex-1 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-all whitespace-nowrap text-center ${
              activeTier === "deep"
                ? "bg-primary text-text-inverse shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Deep Clean
          </button>
          <button
            type="button"
            onClick={() => setActiveTier("moveInOut")}
            className={`flex-1 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-all whitespace-nowrap text-center ${
              activeTier === "moveInOut"
                ? "bg-primary text-text-inverse shadow-xs"
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
              className="rounded-2xl border border-border-default bg-surface p-5 sm:p-6 flex flex-col gap-4 shadow-2xs"
            >
              <h3 className="font-serif text-base font-bold text-text-primary tracking-tight flex items-center gap-2 border-b border-border-subtle pb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{cat.category}</span>
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
                      {isIncluded ? (
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary mt-0.5">
                          <CheckIcon className="h-2.5 w-2.5" />
                        </div>
                      ) : (
                        <span className="w-4 text-center text-text-muted/40 font-bold shrink-0">–</span>
                      )}
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
