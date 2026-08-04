"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

// Follows the reader down the page while they're in the descriptive
// content, then gets out of the way once the pricing section they'd be
// jumping to is already on screen — so it's there when useful, not a
// permanent fixture competing with the page.
export function StickyPricingCta({ targetId, label }: { targetId: string; label: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const hasScrolled = useRef(false);

  useEffect(() => {
    function onScroll() {
      hasScrolled.current = window.scrollY > 420;
      setPastHero(hasScrolled.current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setTargetVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  const visible = pastHero && !targetVisible;

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 flex justify-center transition-all duration-300 sm:inset-x-auto sm:right-6 sm:justify-end ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <a
        href={`#${targetId}`}
        className="cta-bounce flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 hover:bg-accent-600"
      >
        {label} <ArrowDown className="h-4 w-4" />
      </a>
    </div>
  );
}
