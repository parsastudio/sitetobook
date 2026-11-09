"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { BeforeAfterItem } from "@/entities/tenant/schema";

interface BeforeAfterSliderProps {
  items: BeforeAfterItem[];
}

export function BeforeAfterSlider({ items }: BeforeAfterSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const safeIndex = selectedIndex < items.length ? selectedIndex : 0;
  const activeItem = items[safeIndex];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  if (!activeItem) return null;

  return (
    <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
      {items.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-surface border border-border-default shadow-xs w-full sm:w-auto max-w-full">
          {items.map((item, idx) => {
            const isActive = safeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  setSliderPosition(50);
                }}
                type="button"
                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-text-inverse shadow-xs"
                    : "bg-subtle/70 text-text-secondary hover:bg-subtle hover:text-text-primary"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-primary"}`} />
                <span>{item.area}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="w-full max-w-3xl flex flex-col items-center">
        <div
          ref={containerRef}
          role="slider"
          tabIndex={0}
          aria-label={`Before and after comparison for ${activeItem.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPosition)}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerCancel={handlePointerCancel}
          className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border-default bg-surface shadow-xl select-none touch-none cursor-ew-resize focus-visible:ring-2 focus-visible:ring-primary outline-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src={activeItem.afterImage}
              alt={`${activeItem.title} - After`}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full border border-white/20 bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-white uppercase shadow-md">
              AFTER · RESTORED
            </span>
          </div>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src={activeItem.beforeImage}
              alt={`${activeItem.title} - Before`}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full border border-white/20 bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest text-white uppercase shadow-md">
              BEFORE
            </span>
          </div>

          <div
            className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-2xl"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white bg-primary text-text-inverse shadow-xl transition-transform hover:scale-105 active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 16-4-4 4-4" />
                <path d="m16 8 4 4-4 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between w-full px-2 text-[11px] sm:text-xs">
          <span className="font-serif font-bold text-text-primary text-sm sm:text-base truncate max-w-[60%]">{activeItem.title}</span>
          <span className="font-medium text-text-muted text-right">← Slide to reveal →</span>
        </div>
      </div>
    </div>
  );
}
