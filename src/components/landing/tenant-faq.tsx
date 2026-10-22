"use client";

import { useState } from "react";
import { FAQItem } from "@/entities/tenant/schema";
import { ChevronDownIcon } from "@/components/ui/icons";

interface TenantFaqProps {
  faqs: FAQItem[];
}

export function TenantFaq({ faqs }: TenantFaqProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full border-t border-border-default bg-surface py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-10">
        <div className="text-center flex flex-col items-center gap-2 max-w-lg">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary">
            Client Inquiries
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-text-primary tracking-tight">
            Frequently Asked <span className="font-serif italic text-primary">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Everything you need to know about our home cleaning standards, liability coverage, and keys policies.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-primary/40 bg-canvas shadow-xs"
                    : "border-border-default bg-surface hover:border-border-focus"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-text-primary leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 border border-border-default ${
                      isOpen
                        ? "bg-primary text-text-inverse rotate-180"
                        : "bg-surface text-text-muted"
                    }`}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-0 border-t border-border-subtle text-xs sm:text-sm text-text-secondary leading-relaxed animate-in fade-in duration-150">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
