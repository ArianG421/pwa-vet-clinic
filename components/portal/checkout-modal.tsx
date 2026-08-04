"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Lock, X } from "lucide-react";
import type { SubscriptionTierRow } from "@/lib/supabase/types";
import { getPlanText } from "@/lib/data/plans";
import { formatKr } from "@/lib/currency";

export function CheckoutModal({
  tier,
  onConfirm,
  onClose,
}: {
  tier: SubscriptionTierRow;
  onConfirm: () => Promise<{ error: string | null }>;
  onClose: () => void;
}) {
  const t = useTranslations("portal.subscription.checkout");
  const tPlans = useTranslations("plans");
  const tierText = getPlanText(tPlans, (k) => tPlans.raw(k) as unknown as string[], tier.slug, tier);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/29");
  const [cvc, setCvc] = useState("123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await onConfirm();
    setSubmitting(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t("title")}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-surface-muted p-4">
          <p className="text-sm font-semibold text-ink">{tierText.name}</p>
          <p className="text-xs text-ink-muted">{formatKr(tier.price_monthly)}{t("billedMonthly")}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="card" className="text-sm font-medium text-ink">{t("cardNumber")}</label>
            <input
              id="card"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="expiry" className="text-sm font-medium text-ink">{t("expiry")}</label>
              <input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div>
              <label htmlFor="cvc" className="text-sm font-medium text-ink">{t("cvc")}</label>
              <input
                id="cvc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("confirm", { amount: tier.price_monthly })}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
            <Lock className="h-3.5 w-3.5" /> {t("demoNote")}
          </p>
        </form>
      </div>
    </div>
  );
}
