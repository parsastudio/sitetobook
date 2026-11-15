"use client";

import { useState } from "react";
import Image from "next/image";
import { BeforeAfterItem } from "@/entities/tenant/schema";

interface BeforeAfterSliderProps {
  items: BeforeAfterItem[];
}

export function BeforeAfterSlider({ items }: BeforeAfterSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeIndex = selectedIndex < items.length ? selectedIndex : 0;
  const activeItem = items[safeIndex];

  if (!activeItem) return null;

  return (
    <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
      {items.length > 1 && (
        <div
          role="tablist"
          aria-label="Room transformation categories"
          className="flex flex-wrap items-center justify-center gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-surface border border-border-default shadow-xs w-full sm:w-auto max-w-full"
        >
          {items.map((item, idx) => {
            const isActive = safeIndex === idx;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedIndex(idx)}
                type="button"
                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-text-inverse shadow-xs"
                    : "bg-subtle/70 text-text-secondary hover:bg-subtle hover:text-text-primary"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-white" : "bg-primary"
                  }`}
                />
                <span>{item.area}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="relative aspect-16/10 sm:aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border-default bg-surface shadow-xl">
          <Image
            key={activeItem.id}
            src={activeItem.image}
            alt={activeItem.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover transition-opacity duration-300"
          />

          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full border border-white/20 bg-slate-950/75 backdrop-blur-md px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-white uppercase shadow-md">
            BEFORE
          </span>

          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full border border-white/20 bg-slate-950/75 backdrop-blur-md px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-white uppercase shadow-md">
            AFTER · RESTORED
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between w-full px-2 text-[11px] sm:text-xs">
          <span className="font-serif font-bold text-text-primary text-sm sm:text-base truncate max-w-[65%]">
            {activeItem.title}
          </span>
          <span className="font-semibold text-text-muted text-right">
            {safeIndex + 1} of {items.length} · Verified Result
          </span>
        </div>
      </div>
    </div>
  );
}
