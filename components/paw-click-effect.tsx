"use client";

import { useEffect, useRef, useState } from "react";
import { PawPrint } from "lucide-react";

type Mark = { id: number; x: number; y: number; rotate: number };

const IGNORE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const MAX_MARKS = 8;

export function PawClickEffect() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const counter = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function handleClick(e: MouseEvent) {
      if (reducedMotion.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (target && IGNORE_TAGS.has(target.tagName)) return;

      const id = ++counter.current;
      const rotate = Math.round(Math.random() * 50) - 25;
      setMarks((prev) => [...prev.slice(-MAX_MARKS + 1), { id, x: e.clientX, y: e.clientY, rotate }]);

      window.setTimeout(() => {
        setMarks((prev) => prev.filter((m) => m.id !== id));
      }, 600);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {marks.map((m) => (
        <PawPrint
          key={m.id}
          aria-hidden
          className="paw-click-mark h-5 w-5"
          style={{
            left: m.x,
            top: m.y,
            ["--paw-click-rotate" as string]: `${m.rotate}deg`,
          }}
        />
      ))}
    </>
  );
}
