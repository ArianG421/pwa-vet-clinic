"use client";

import { useTranslations } from "next-intl";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import type { LoyaltyTransaction } from "@/lib/data/loyalty";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function PointsHistory({ transactions }: { transactions: LoyaltyTransaction[] }) {
  const t = useTranslations("portal.rewards");

  if (transactions.length === 0) {
    return <p className="text-sm text-ink-muted">{t("noActivity")}</p>;
  }

  return (
    <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            {tx.type === "earn" ? (
              <ArrowUpCircle className="h-5 w-5 shrink-0 text-brand-600" />
            ) : (
              <ArrowDownCircle className="h-5 w-5 shrink-0 text-accent-600" />
            )}
            <div>
              <p className="text-sm font-medium text-ink">{tx.label}</p>
              <p className="text-xs text-ink-muted">{tx.detail} · {formatDate(tx.date)}</p>
            </div>
          </div>
          <p className={`shrink-0 text-sm font-semibold ${tx.type === "earn" ? "text-brand-700" : "text-accent-600"}`}>
            {tx.type === "earn" ? "+" : "−"}{tx.points.toLocaleString()} pts
          </p>
        </div>
      ))}
    </div>
  );
}
