"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/data/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
      {items.map((item) => {
        const open = openSlug === item.slug;
        return (
          <div key={item.slug}>
            <button
              type="button"
              onClick={() => setOpenSlug(open ? null : item.slug)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-ink">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-ink-muted">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
