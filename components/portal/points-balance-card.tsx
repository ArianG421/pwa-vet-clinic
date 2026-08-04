"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { getNextTier, getTier } from "@/lib/data/loyalty";

export function PointsBalanceCard({ balance, lifetimePoints }: { balance: number; lifetimePoints: number }) {
  const t = useTranslations("portal.rewards");
  const tTier = (key: string) => t(`tiers.${key}`);
  const tier = getTier(tTier, lifetimePoints);
  const nextTier = getNextTier(tTier, lifetimePoints);
  const progressPct = nextTier
    ? Math.min(100, Math.round(((lifetimePoints - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100))
    : 100;

  return (
    <div className="rounded-3xl bg-brand-800 p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">{t("title")}</p>
          <p className="mt-2 text-4xl font-bold">{balance.toLocaleString()} <span className="text-lg font-medium text-brand-100">pts</span></p>
          <p className="mt-1 text-sm text-brand-100">{t("lifetimeEarned", { count: lifetimePoints.toLocaleString() })}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-accent-300" /> {tier.name}
        </span>
      </div>

      <div className="mt-6">
        {nextTier ? (
          <>
            <div className="flex items-center justify-between text-xs text-brand-100">
              <span>{tier.name}</span>
              <span>{t("ptsToNext", { count: nextTier.minPoints - lifetimePoints, tier: nextTier.name })}</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-accent-400 transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
          </>
        ) : (
          <p className="text-xs text-brand-100">{t("topTierMessage", { tier: tier.name })}</p>
        )}
      </div>

      <p className="mt-4 text-xs text-brand-100">{tier.perk}</p>
    </div>
  );
}
