import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Hours",
  description: "Get in touch with Willowbrook Veterinary Clinic — phone, email, address, and hours.",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(`${site.address.line1}, ${site.address.line2}`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Contact</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">We're happy to help</h1>
        <p className="mt-4 text-ink-muted">
          Questions about a treatment, your membership, or your pet's records? Reach out below, or
          call us directly during clinic hours.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-sm">
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-semibold text-ink">Phone</p>
                  <a href={site.phoneHref} className="text-ink-muted hover:text-brand-700">{site.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <a href={`mailto:${site.email}`} className="text-ink-muted hover:text-brand-700">{site.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-semibold text-ink">Address</p>
                  <p className="text-ink-muted">{site.address.line1}<br />{site.address.line2}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-brand-700 hover:text-brand-800"
                  >
                    Get directions →
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-sm">
            <p className="font-semibold text-ink">Hours</p>
            <ul className="mt-3 space-y-2 text-sm">
              {site.hours.map((h) => (
                <li key={h.label} className="flex justify-between text-ink-muted">
                  <span className="text-ink">{h.label}</span>
                  <span>{h.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-sm sm:p-8">
            <p className="font-semibold text-ink">Send us a message</p>
            <p className="mt-1 text-sm text-ink-muted">We typically respond within one business day.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
