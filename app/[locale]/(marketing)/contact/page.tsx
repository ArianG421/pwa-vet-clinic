import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";
import { routing } from "@/lib/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("eyebrow"), description: t("body") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tSite = await getTranslations("site");
  const hours = tSite.raw("hours") as { label: string; value: string }[];
  const mapQuery = encodeURIComponent(`${site.address.line1}, ${site.address.line2}`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{t("title")}</h1>
        <p className="mt-4 text-ink-muted">
          {t("body")}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-sm">
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-semibold text-ink">{t("phone")}</p>
                  <a href={site.phoneHref} className="text-ink-muted hover:text-brand-700">{site.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-semibold text-ink">{t("email")}</p>
                  <a href={`mailto:${site.email}`} className="text-ink-muted hover:text-brand-700">{site.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-semibold text-ink">{t("address")}</p>
                  <p className="text-ink-muted">{site.address.line1}<br />{site.address.line2}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-brand-700 hover:text-brand-800"
                  >
                    {t("getDirections")}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-sm">
            <p className="font-semibold text-ink">{t("hours")}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {hours.map((h) => (
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
            <p className="font-semibold text-ink">{t("sendMessage")}</p>
            <p className="mt-1 text-sm text-ink-muted">{t("respondNote")}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
