"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { formatKr } from "@/lib/currency";

export function TierPriceRow({
  name,
  tagline,
  priceMonthly,
  onSave,
}: {
  name: string;
  tagline: string;
  priceMonthly: number;
  onSave: (priceMonthly: number) => Promise<{ error: string | null }>;
}) {
  const t = useTranslations("crm.pricing");
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(priceMonthly));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit() {
    setPrice(String(priceMonthly));
    setError(null);
    setEditing(true);
  }

  async function handleSave() {
    const num = Number(price);
    if (!Number.isFinite(num) || num < 0) {
      setError(t("invalidPrice"));
      return;
    }
    setSaving(true);
    setError(null);
    const result = await onSave(num);
    setSaving(false);
    if (result.error) setError(result.error);
    else setEditing(false);
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{tagline}</p>
        </div>

        {editing ? (
          <div className="flex shrink-0 items-center gap-2">
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-24 rounded-lg border border-black/10 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <span className="text-xs text-ink-muted">{t("perMonth")}</span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              aria-label={t("save")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
              aria-label={t("cancel")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-ink-muted hover:bg-surface-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="flex shrink-0 items-center gap-2 self-start rounded-full border border-black/10 px-3.5 py-1.5 text-sm font-semibold text-ink hover:border-brand-500 hover:text-brand-700 sm:self-auto"
          >
            {formatKr(priceMonthly)}
            {t("perMonth")}
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
