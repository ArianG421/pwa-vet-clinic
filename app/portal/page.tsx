"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, PawPrint } from "lucide-react";
import { useLoyalty } from "@/hooks/use-loyalty";
import { usePets } from "@/hooks/use-pets";
import { useAppointments } from "@/hooks/use-appointments";
import { getTier } from "@/lib/data/loyalty";
import { PawLoader } from "@/components/paw-loader";
import { createClient } from "@/lib/supabase/client";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PortalDashboard() {
  const { loaded: loyaltyLoaded, balance, lifetimePoints } = useLoyalty();
  const { pets, loaded: petsLoaded } = usePets();
  const { appointments, loaded: appointmentsLoaded } = useAppointments();
  const [email, setEmail] = useState<string | null>(null);
  const tier = getTier(lifetimePoints);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const nextAppointment = appointments
    ?.filter((a) => (a.status === "pending" || a.status === "confirmed") && new Date(a.requested_at) > new Date())
    .sort((a, b) => new Date(a.requested_at).getTime() - new Date(b.requested_at).getTime())[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Welcome back</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
        {email ? `Hi, ${email.split("@")[0]} 👋` : "Hi there 👋"}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">Here's a snapshot of your account.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/portal/rewards" className="group rounded-2xl border border-black/5 bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Gift className="h-5 w-5" />
          </span>
          {loyaltyLoaded ? (
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
          {!appointmentsLoaded ? (
            <div className="mt-1"><PawLoader size="sm" label="" /></div>
          ) : nextAppointment ? (
            <p className="mt-1 text-xs text-ink-muted">
              {nextAppointment.services?.name} — {formatDateTime(nextAppointment.requested_at)}
            </p>
          ) : (
            <p className="mt-1 text-xs text-ink-muted">Nothing booked yet.</p>
          )}
          <Link href="/portal/appointments" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
            Manage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <PawPrint className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">Your pets</p>
          {!petsLoaded ? (
            <div className="mt-1"><PawLoader size="sm" label="" /></div>
          ) : pets && pets.length > 0 ? (
            <p className="mt-1 text-xs text-ink-muted">{pets.map((p) => p.name).join(" · ")}</p>
          ) : (
            <p className="mt-1 text-xs text-ink-muted">No pets added yet.</p>
          )}
          <Link href="/portal/pets" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
            View profiles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
