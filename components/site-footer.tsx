import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { navHrefs, site } from "@/lib/site";
import { InstagramIcon, FacebookIcon } from "@/components/icons/social-icons";
import { SocialPreviews } from "@/components/social-previews";

const NAV_KEYS: Record<string, string> = {
  "/services": "services",
  "/pricing": "pricing",
  "/about": "about",
  "/faq": "faq",
  "/contact": "contact",
};

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tSite = useTranslations("site");
  const hours = tSite.raw("hours") as { label: string; value: string }[];

  return (
    <footer className="border-t border-black/5 bg-surface-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-semibold text-ink">{site.name}</p>
          <p className="mt-2 text-sm text-ink-muted">{tSite("tagline")}</p>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-muted hover:text-brand-700"
            >
              <InstagramIcon className="h-4 w-4 shrink-0" /> {site.social.instagramHandle}
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-muted hover:text-brand-700"
            >
              <FacebookIcon className="h-4 w-4 shrink-0" /> {site.social.facebookHandle}
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">{t("explore")}</p>
          <ul className="mt-3 space-y-2">
            {navHrefs.map((href) => (
              <li key={href}>
                <Link href={href} className="text-sm text-ink-muted hover:text-brand-700">
                  {tNav(NAV_KEYS[href])}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">{t("hours")}</p>
          <ul className="mt-3 space-y-2">
            {hours.map((h) => (
              <li key={h.label} className="text-sm text-ink-muted">
                <span className="text-ink">{h.label}</span> — {h.value}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">{t("contact")}</p>
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

      <div className="border-t border-black/5 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SocialPreviews />
        </div>
      </div>

      <div className="border-t border-black/5 py-4 text-center text-xs text-ink-muted">
        {t("demoNotice", { year: new Date().getFullYear(), siteName: site.name })}
      </div>
    </footer>
  );
}
