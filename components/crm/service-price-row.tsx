"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { formatKr } from "@/lib/currency";

export function ServicePriceRow({
  name,
  description,
  priceFrom,
  priceTo,
  onSave,
}: {
  name: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  onSave: (priceFrom: number, priceTo: number) => Promise<{ error: string | null }>;
}) {
  const t = useTranslations("crm.pricing");
  const [editing, setEditing] = useState(false);
  const [from, setFrom] = useState(String(priceFrom));
  const [to, setTo] = useState(String(priceTo));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit() {
    setFrom(String(priceFrom));
    setTo(String(priceTo));
    setError(null);
    setEditing(true);
  }

  async function handleSave() {
    const fromNum = Number(from);
    const toNum = Number(to);
    if (!Number.isFinite(fromNum) || !Number.isFinite(toNum) || fromNum < 0 || toNum < fromNum) {
      setError(t("invalidPrice"));
      return;
    }
    setSaving(true);
    setError(null);
    const result = await onSave(fromNum, toNum);
    setSaving(false);
    if (result.error) setError(result.error);
    else setEditing(false);
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{description}</p>
        </div>

        {editing ? (
          <div className="flex shrink-0 items-center gap-2">
            <input
              type="number"
              min={0}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-20 rounded-lg border border-black/10 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <span className="text-ink-muted">–</span>
            <input
              type="number"
              min={0}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-20 rounded-lg border border-black/10 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <span className="text-xs text-ink-muted">kr</span>
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
            {priceFrom === priceTo ? formatKr(priceFrom) : `${formatKr(priceFrom)}–${formatKr(priceTo)}`}
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
