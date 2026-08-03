"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, PawPrint } from "lucide-react";
import { useLoyalty } from "@/hooks/use-loyalty";
import { getTier } from "@/lib/data/loyalty";
import { PawLoader } from "@/components/paw-loader";

export default function PortalDashboard() {
  const { loaded, balance, lifetimePoints } = useLoyalty();
  const tier = getTier(lifetimePoints);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Welcome back</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Hi, demo client 👋</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        Here's a snapshot of your account. This dashboard will connect to your real profile once
        account sign-in ships.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/portal/rewards" className="group rounded-2xl border border-black/5 bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Gift className="h-5 w-5" />
          </span>
          {loaded ? (
            <>
              <p className="mt-3 text-2xl font-bold text-ink">{balance.toLocaleString()} pts</p>
              <p className="text-xs text-ink-muted">{tier.name} tier</p>
            </>
          ) : (
            <div className="mt-3"><PawLoader size="sm" label="" /></div>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:text-brand-800">
            View rewards <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <CalendarDays className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">Next appointment</p>
          <p className="mt-1 text-xs text-ink-muted">Wellness Exam — Aug 14, 10:30 AM</p>
          <Link href="/portal/appointments" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
            Manage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <PawPrint className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">Your pets</p>
          <p className="mt-1 text-xs text-ink-muted">Biscuit (Dog) · Momo (Cat)</p>
          <Link href="/portal/pets" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
            View profiles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
