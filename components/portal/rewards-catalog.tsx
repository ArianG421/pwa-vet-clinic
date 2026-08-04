"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Gift, Tag } from "lucide-react";
import { getRewardsCatalog } from "@/lib/data/loyalty";

export function RewardsCatalog({
  balance,
  onRedeem,
}: {
  balance: number;
  onRedeem: (rewardId: string, name: string, pointsCost: number) => void;
}) {
  const t = useTranslations("portal.rewards");
  const rewardsCatalog = getRewardsCatalog((key) => t(key));
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);

  function handleRedeem(id: string, name: string, cost: number) {
    onRedeem(id, name, cost);
    setJustRedeemed(id);
    window.setTimeout(() => setJustRedeemed((cur) => (cur === id ? null : cur)), 2200);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rewardsCatalog.map((reward) => {
        const affordable = balance >= reward.pointsCost;
        const redeemed = justRedeemed === reward.id;
        const Icon = reward.kind === "discount" ? Tag : Gift;

        return (
          <div key={reward.id} className="flex flex-col rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${affordable ? "bg-brand-50 text-brand-700" : "bg-surface-muted text-ink-muted"}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">{reward.name}</p>
            <p className="mt-1 flex-1 text-xs text-ink-muted">{reward.description}</p>
            <p className="mt-3 text-sm font-semibold text-brand-700">{reward.pointsCost.toLocaleString()} pts</p>

            <button
              type="button"
              disabled={!affordable || redeemed}
              onClick={() => handleRedeem(reward.id, reward.name, reward.pointsCost)}
              className={`mt-4 flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                redeemed
                  ? "bg-brand-100 text-brand-700"
                  : affordable
                    ? "cta-bounce bg-accent-500 text-white hover:bg-accent-600"
                    : "cursor-not-allowed bg-surface-muted text-ink-muted"
              }`}
            >
              {redeemed ? (
                <>
                  <Check className="h-4 w-4" /> {t("redeemedBtn")}
                </>
              ) : affordable ? (
                t("redeemBtn")
              ) : (
                t("needMorePts", { count: (reward.pointsCost - balance).toLocaleString() })
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
