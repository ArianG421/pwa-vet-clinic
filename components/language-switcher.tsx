"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

const LABELS: Record<string, string> = { en: "EN", sv: "SV" };

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={`inline-flex items-center gap-0.5 rounded-full border border-black/10 p-0.5 ${className ?? ""}`}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-current={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            l === locale ? "bg-brand-600 text-white" : "text-ink-muted hover:bg-surface-muted"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
