"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { Lead } from "@/hooks/use-crm-leads";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const t = useTranslations("crm.leads.messageModal");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t("title")}</h2>
          <button type="button" onClick={onClose} aria-label={t("close")} className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-surface-muted p-4">
          <p className="text-sm font-semibold text-ink">{lead.name}</p>
          <p className="text-xs text-ink-muted">{lead.email}</p>
          <p className="mt-1 text-xs text-ink-muted">{formatDateTime(lead.since)}</p>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm text-ink">{lead.message}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink-muted hover:bg-surface-muted"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
