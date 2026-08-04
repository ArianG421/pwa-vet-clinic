"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, XCircle } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { CheckoutModal } from "@/components/portal/checkout-modal";
import { PawLoader } from "@/components/paw-loader";
import type { SubscriptionTierRow } from "@/lib/supabase/types";
import { getPlanText } from "@/lib/data/plans";
import { formatKr } from "@/lib/currency";

export default function SubscriptionPage() {
  const t = useTranslations("portal.subscription");
  const tPlans = useTranslations("plans");
  const { tiers, subscription, loaded, error, subscribe, cancelSubscription } = useSubscription();
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTierRow | null>(null);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <PawLoader label={t("loadingLabel")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">{t("subtitle")}</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {subscription ? (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-800 p-6 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">{t("activePlan")}</p>
            <p className="mt-1 text-xl font-semibold">
              {subscription.subscription_tiers
                ? getPlanText(tPlans, (k) => tPlans.raw(k) as unknown as string[], subscription.subscription_tiers.slug, subscription.subscription_tiers).name
                : ""}
            </p>
            <p className="text-sm text-brand-100">{formatKr(subscription.subscription_tiers?.price_monthly ?? 0)}{t("perMonthLong")}</p>
          </div>
          <button
            type="button"
            onClick={() => cancelSubscription(subscription.id)}
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            <XCircle className="h-4 w-4" /> {t("cancelMembership")}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {tiers.map((tier) => {
            const text = getPlanText(tPlans, (k) => tPlans.raw(k) as unknown as string[], tier.slug, tier);
            return (
              <div key={tier.id} className="flex flex-col rounded-3xl border border-black/5 bg-surface p-6 shadow-sm">
                <p className="font-semibold text-ink">{text.name}</p>
                <p className="mt-1 text-xs text-ink-muted">{text.tagline}</p>
                <p className="mt-4"><span className="text-3xl font-bold text-ink">{formatKr(tier.price_monthly)}</span><span className="text-sm text-ink-muted"> {t("perMonthShort")}</span></p>
                <ul className="mt-4 flex-1 space-y-2 text-xs text-ink-muted">
                  {text.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setCheckoutTier(tier)}
                  className="cta-bounce mt-5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
                >
                  {t("choosePlan", { name: text.name })}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {checkoutTier && (
        <CheckoutModal
          tier={checkoutTier}
          onConfirm={() => subscribe(checkoutTier.id)}
          onClose={() => setCheckoutTier(null)}
        />
      )}
    </div>
  );
}
