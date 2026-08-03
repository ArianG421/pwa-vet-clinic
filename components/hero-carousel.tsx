"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarousel } from "@/hooks/use-carousel";
import type { HeroSlide } from "@/lib/data/gallery";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { index, go, next, prev, pause, resume, onTouchStart, onTouchEnd } = useCarousel(slides.length, {
    intervalMs: 5500,
  });

  return (
    <div
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/20 sm:aspect-[5/4]"
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
      aria-label="Photos of pets and care at Willowbrook Veterinary Clinic"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-300">{slide.eyebrow}</p>
            <p className="mt-1.5 text-lg font-semibold text-white sm:text-xl">{slide.title}</p>
            <p className="mt-1 text-sm text-white/80">{slide.body}</p>
          </div>
        </div>
      ))}

      <div aria-live="polite" className="sr-only">
        Slide {index + 1} of {slides.length}: {slides[index].title}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute right-4 top-4 flex gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
