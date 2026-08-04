"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getSeedTransactions, type LoyaltyTransaction } from "@/lib/data/loyalty";

const STORAGE_KEY = "oresundsvet-loyalty-demo-v1";

export function useLoyalty() {
  const t = useTranslations("portal.rewards");
  const [transactions, setTransactions] = useState<LoyaltyTransaction[] | null>(null);

  const loadTransactions = useCallback((): LoyaltyTransaction[] => {
    const seed = getSeedTransactions((key) => t(key));
    if (typeof window === "undefined") return seed;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return seed;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return seed;
    } catch {
      return seed;
    }
  }, [t]);

  useEffect(() => {
    setTransactions(loadTransactions());
    // Only load once on mount — re-running on every `t` identity change
    // (new function reference each render) would clobber in-progress state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (transactions === null) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const redeem = useCallback(
    (rewardId: string, name: string, pointsCost: number) => {
      setTransactions((prev) => {
        if (!prev) return prev;
        const tx: LoyaltyTransaction = {
          id: `redeem-${rewardId}-${Date.now()}`,
          type: "redeem",
          points: pointsCost,
          label: name,
          detail: t("redeemedDetail"),
          date: new Date().toISOString().slice(0, 10),
        };
        return [tx, ...prev];
      });
    },
    [t]
  );

  const reset = useCallback(() => {
    setTransactions(getSeedTransactions((key) => t(key)));
  }, [t]);

  const loaded = transactions !== null;
  const list = transactions ?? [];
  const balance = list.reduce((sum, tx) => sum + (tx.type === "earn" ? tx.points : -tx.points), 0);
  const lifetimePoints = list.filter((tx) => tx.type === "earn").reduce((sum, tx) => sum + tx.points, 0);

  return { loaded, transactions: list, balance, lifetimePoints, redeem, reset };
}
