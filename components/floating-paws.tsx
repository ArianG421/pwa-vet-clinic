import { PawPrint } from "lucide-react";

type Paw = {
  top: string;
  left: string;
  size: number;
  rotate: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  opacity: number;
};

const PAWS: Paw[] = [
  { top: "8%", left: "6%", size: 22, rotate: -18, duration: 8, delay: 0, driftX: 12, driftY: -10, opacity: 0.18 },
  { top: "18%", left: "88%", size: 16, rotate: 24, duration: 6.5, delay: 0.6, driftX: -10, driftY: 14, opacity: 0.16 },
  { top: "62%", left: "4%", size: 18, rotate: 8, duration: 9, delay: 1.2, driftX: 14, driftY: 10, opacity: 0.14 },
  { top: "78%", left: "92%", size: 24, rotate: -30, duration: 7.5, delay: 0.3, driftX: -14, driftY: -12, opacity: 0.16 },
  { top: "42%", left: "96%", size: 14, rotate: 12, duration: 6, delay: 1.6, driftX: -8, driftY: 8, opacity: 0.12 },
  { top: "90%", left: "18%", size: 16, rotate: -6, duration: 8.5, delay: 0.9, driftX: 10, driftY: -8, opacity: 0.14 },
];

export function FloatingPaws({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {PAWS.map((paw, i) => (
        <PawPrint
          key={i}
          className="floating-paw absolute text-white"
          style={{
            top: paw.top,
            left: paw.left,
            width: paw.size,
            height: paw.size,
            opacity: paw.opacity,
            ["--paw-rotate" as string]: `${paw.rotate}deg`,
            ["--paw-duration" as string]: `${paw.duration}s`,
            ["--paw-delay" as string]: `${paw.delay}s`,
            ["--paw-drift-x" as string]: `${paw.driftX}px`,
            ["--paw-drift-y" as string]: `${paw.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}
