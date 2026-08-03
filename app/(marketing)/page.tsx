import Link from "next/link";
import { ArrowRight, Calendar, Clock, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { serviceCategories } from "@/lib/data/services";
import { CategoryIcon } from "@/components/category-icon";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-50">
              <Sparkles className="h-3.5 w-3.5" /> Now booking online, 24/7
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              {site.tagline}
            </h1>
            <p className="mt-4 max-w-lg text-base text-brand-100 sm:text-lg">
              From wellness checks to emergency care, {site.name} pairs modern medicine with a
              member portal that keeps every appointment, pet record, and reminder in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/portal/appointments"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-900/20 transition-colors hover:bg-accent-600"
              >
                Book an appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore services
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Calendar, label: "Same-week appointments", detail: "Priority booking for members" },
              { icon: ShieldCheck, label: "In-house diagnostics", detail: "Results in under an hour" },
              { icon: HeartHandshake, label: "Member plans", detail: "3 tiers, cancel anytime" },
              { icon: Clock, label: "24/7 triage line", detail: "For existing clients" },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <f.icon className="h-6 w-6 text-brand-100" />
                <p className="mt-3 text-sm font-semibold text-white">{f.label}</p>
                <p className="mt-1 text-xs text-brand-100">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Care, organized by category</h2>
            <p className="mt-2 max-w-xl text-sm text-ink-muted sm:text-base">
              Everything from routine wellness to advanced orthopedic surgery, under one roof.
            </p>
          </div>
          <Link href="/services" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {serviceCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className="group rounded-2xl border border-black/5 bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <CategoryIcon name={cat.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{cat.name}</p>
              <p className="mt-1 text-xs text-ink-muted">{cat.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
                A client portal that actually saves you a phone call
              </h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">
                Install {site.shortName} to your home screen and manage everything from your
                phone — no app store required.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink">
                {[
                  "Book, reschedule, or cancel appointments in a few taps",
                  "Keep every pet's profile, vaccine history, and notes in one place",
                  "Manage your membership plan and view billing history",
                  "Message the clinic and get appointment reminders",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Sparkles className="h-2.5 w-2.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
              >
                Create your account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-black/5 bg-surface p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Member plans</p>
              <p className="mt-1 text-sm text-ink-muted">Simple pricing, cancel anytime.</p>
              <Link href="/pricing" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                Compare plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
