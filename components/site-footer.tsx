import { Link } from "@/lib/i18n/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-surface-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-semibold text-ink">{site.name}</p>
          <p className="mt-2 text-sm text-ink-muted">{site.tagline}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <a href={site.social.instagram} className="text-ink-muted underline-offset-4 hover:text-brand-700 hover:underline">
              Instagram
            </a>
            <a href={site.social.facebook} className="text-ink-muted underline-offset-4 hover:text-brand-700 hover:underline">
              Facebook
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Explore</p>
          <ul className="mt-3 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-muted hover:text-brand-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Hours</p>
          <ul className="mt-3 space-y-2">
            {site.hours.map((h) => (
              <li key={h.label} className="text-sm text-ink-muted">
                <span className="text-ink">{h.label}</span> — {h.value}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={site.phoneHref} className="hover:text-brand-700">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${site.email}`} className="hover:text-brand-700">{site.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{site.address.line1}<br />{site.address.line2}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} {site.name}. Demo build — not a real clinic.
      </div>
    </footer>
  );
}
