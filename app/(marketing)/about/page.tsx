import type { Metadata } from "next";
import { Cat, Dog, Microscope, ShieldCheck } from "lucide-react";
import { team } from "@/lib/data/team";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the Willowbrook Veterinary Clinic team and learn about our facility and approach to care.",
};

const facilityHighlights = [
  { icon: Dog, title: "Separate dog & cat waiting areas", detail: "Lower-stress visits for every patient, with species-specific exam rooms." },
  { icon: Microscope, title: "In-house lab & imaging", detail: "Digital X-ray, ultrasound, and same-hour bloodwork on site." },
  { icon: ShieldCheck, title: "Modern anaesthesia monitoring", detail: "Continuous monitoring for every sedated or surgical procedure." },
  { icon: Cat, title: "Fear-free handling techniques", detail: "Staff trained in low-stress handling for anxious or reactive pets." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-brand-800 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">About us</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Built around compassion, backed by modern medicine
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            {site.name} opened with a simple goal: give every pet the kind of unhurried, thorough
            care we'd want for our own animals — and give owners a modern way to stay on top of it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-ink">Our facility</h2>
        <p className="mt-3 max-w-3xl text-ink-muted">
          Our clinic was designed around reducing stress for anxious patients — from separate
          waiting areas for dogs and cats to quiet exam rooms and equipment that keeps most
          diagnostics in-house, so your pet isn't waiting days for answers.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {facilityHighlights.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-ink">Meet the team</h2>
          <p className="mt-3 max-w-2xl text-ink-muted">
            A small, experienced team that knows your pets by name — not just by chart number.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-brand-100" aria-hidden />
                <p className="mt-4 text-sm font-semibold text-ink">{member.name}</p>
                <p className="text-xs font-medium text-brand-700">{member.role}</p>
                <p className="mt-2 text-xs text-ink-muted">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
