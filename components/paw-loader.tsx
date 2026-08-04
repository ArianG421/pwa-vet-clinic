"use client";

import { useTranslations } from "next-intl";
import { PawPrint } from "lucide-react";

export function PawLoader({ label, size = "md" }: { label?: string; size?: "sm" | "md" }) {
  const t = useTranslations("common");
  const resolvedLabel = label ?? t("loading");
  const iconSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center" role="status" aria-live="polite">
      <div className="flex items-end gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <PawPrint
            key={i}
            aria-hidden
            className={`paw-step text-brand-500 ${iconSize} ${i % 2 === 1 ? "translate-y-1" : ""}`}
            style={{ ["--paw-step-delay" as string]: `${i * 0.15}s` }}
          />
        ))}
      </div>
      {resolvedLabel && <p className="text-sm text-ink-muted">{resolvedLabel}</p>}
      <span className="sr-only">{t("loadingAria")}</span>
    </div>
  );
}
