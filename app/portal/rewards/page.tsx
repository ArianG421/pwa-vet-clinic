"use client";

import { RotateCcw, Wallet, CalendarCheck, Users } from "lucide-react";
import { useLoyalty } from "@/hooks/use-loyalty";
import { PointsBalanceCard } from "@/components/portal/points-balance-card";
import { RewardsCatalog } from "@/components/portal/rewards-catalog";
import { PointsHistory } from "@/components/portal/points-history";
import { PawLoader } from "@/components/paw-loader";

const HOW_YOU_EARN = [
  { icon: Wallet, title: "1 point per $1 spent", detail: "Earned automatically on every completed visit." },
  { icon: CalendarCheck, title: "Bonus for wellness visits", detail: "Extra points for routine check-ups and vaccinations." },
  { icon: Users, title: "Refer a friend", detail: "Get 100 bonus points when they book their first visit." },
];

export default function RewardsPage() {
  const { loaded, transactions, balance, lifetimePoints, redeem, reset } = useLoyalty();

  if (!loaded) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <PawLoader label="Fetching your rewards…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Rewards</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Willowbrook Rewards</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Every visit earns points automatically. Redeem them for discounts or free services —
            no punch card required.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset demo data
        </button>
      </div>

      <div className="mt-8">
        <PointsBalanceCard balance={balance} lifetimePoints={lifetimePoints} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {HOW_YOU_EARN.map((item) => (
          <div key={item.title} className="flex gap-3 rounded-2xl border border-black/5 bg-surface p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <item.icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Redeem your points</h2>
        <p className="mt-1 text-sm text-ink-muted">Points update instantly — this is a live demo, not a mockup.</p>
        <div className="mt-4">
          <RewardsCatalog balance={balance} onRedeem={redeem} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Activity</h2>
        <div className="mt-4">
          <PointsHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
