"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarousel } from "@/hooks/use-carousel";
import type { InfoCard } from "@/lib/data/gallery";

export function InfoPager({ cards }: { cards: InfoCard[] }) {
  const { index, go, next, prev, pause, resume, onTouchStart, onTouchEnd } = useCarousel(cards.length, {
    intervalMs: 6500,
  });
  const card = cards[index];

  return (
    <div
      className="relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={(e) => {
        pause();
        onTouchStart(e);
      }}
      onTouchEnd={(e) => {
        onTouchEnd(e);
        resume();
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Reasons to choose Willowbrook Veterinary Clinic"
    >
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-black/5 bg-surface p-6 shadow-sm transition-all duration-300 sm:flex-row sm:p-8">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:h-36 sm:w-36">
          <Image
            key={card.src}
            src={card.src}
            alt={card.alt}
            fill
            sizes="(min-width: 640px) 144px, 100vw"
            className="object-cover"
            style={{ animation: "paw-pop 0.5s ease-out" }}
          />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold text-ink">{card.title}</p>
          <p className="mt-2 text-sm text-ink-muted">{card.body}</p>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {index + 1} of {cards.length}: {card.title}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {cards.map((c, i) => (
            <button
              key={c.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to reason ${i + 1}`}
              aria-current={i === index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-brand-600" : "bg-brand-200 hover:bg-brand-300"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
