"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { BeforeAfterItem } from "@/entities/tenant/schema";

interface BeforeAfterSliderProps {
  items: BeforeAfterItem[];
}

export function BeforeAfterSlider({ items }: BeforeAfterSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = items[selectedIndex] ?? items[0];

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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

  if (!activeItem) return null;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {items.length > 1 && (
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface/90 border border-border-default shadow-xs backdrop-blur-md max-w-full overflow-x-auto">
          {items.map((item, idx) => {
            const isActive = selectedIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  setSliderPosition(50);
                }}
                type="button"
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-[0_4px_14px_rgba(5,150,105,0.3),inset_0_1px_0_rgba(255,255,255,0.35)] border border-emerald-400/30 scale-[1.02]"
                    : "bg-canvas/70 text-text-secondary hover:bg-surface hover:text-text-primary border border-transparent"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-emerald-600"}`} />
                <span>{item.area}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="w-full max-w-3xl flex flex-col items-center">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerCancel={handlePointerCancel}
          className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-3xl border border-border-default bg-surface shadow-xl select-none touch-none cursor-ew-resize"
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
            <span className="absolute top-4 right-4 rounded-xl border border-white/20 bg-text-primary/80 backdrop-blur-md px-3 py-1.5 text-xs font-black tracking-wider text-text-inverse shadow-md">
              AFTER (SPARKLEPRO)
            </span>
          </div>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="relative h-full"
              style={{ width: containerWidth > 0 ? `${containerWidth}px` : "100%" }}
            >
              <Image
                src={activeItem.beforeImage}
                alt={`${activeItem.title} - Before`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>
            <span className="absolute top-4 left-4 rounded-xl border border-white/20 bg-text-primary/85 backdrop-blur-md px-3 py-1.5 text-xs font-black tracking-wider text-text-inverse shadow-md">
              BEFORE
            </span>
          </div>

          <div
            className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-2xl"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-[0_4px_20px_rgba(0,0,0,0.35),0_0_15px_rgba(5,150,105,0.4)] transition-transform hover:scale-105 active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 16-4-4 4-4" />
                <path d="m16 8 4 4-4 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between w-full px-2 text-xs text-text-muted">
          <span className="font-bold text-text-primary">{activeItem.title}</span>
          <span className="font-semibold text-primary">← Drag handle to reveal result →</span>
        </div>
      </div>
    </div>
  );
}
