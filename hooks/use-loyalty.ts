"use client";

import { useCallback, useEffect, useState } from "react";
import { seedTransactions, type LoyaltyTransaction } from "@/lib/data/loyalty";

const STORAGE_KEY = "willowbrook-loyalty-demo-v1";

function loadTransactions(): LoyaltyTransaction[] {
  if (typeof window === "undefined") return seedTransactions;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedTransactions;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return seedTransactions;
  } catch {
    return seedTransactions;
  }
}

export function useLoyalty() {
  const [transactions, setTransactions] = useState<LoyaltyTransaction[] | null>(null);

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  useEffect(() => {
    if (transactions === null) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const redeem = useCallback((rewardId: string, name: string, pointsCost: number) => {
    setTransactions((prev) => {
      if (!prev) return prev;
      const tx: LoyaltyTransaction = {
        id: `redeem-${rewardId}-${Date.now()}`,
        type: "redeem",
        points: pointsCost,
        label: name,
        detail: "Redeemed — show this at your next visit",
        date: new Date().toISOString().slice(0, 10),
      };
      return [tx, ...prev];
    });
  }, []);

  const reset = useCallback(() => {
    setTransactions(seedTransactions);
  }, []);

  const loaded = transactions !== null;
  const list = transactions ?? [];
  const balance = list.reduce((sum, t) => sum + (t.type === "earn" ? t.points : -t.points), 0);
  const lifetimePoints = list.filter((t) => t.type === "earn").reduce((sum, t) => sum + t.points, 0);

  return { loaded, transactions: list, balance, lifetimePoints, redeem, reset };
}
