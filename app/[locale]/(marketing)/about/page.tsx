import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Cat, Dog, Microscope, ShieldCheck } from "lucide-react";
import { getTeamByTier } from "@/lib/data/team";
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
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("eyebrow"), description: t("teamBody") };
}

const FACILITY_ICONS = {
  dogCatAreas: Dog,
  labImaging: Microscope,
  anaesthesia: ShieldCheck,
  fearFree: Cat,
} as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const team = getTeamByTier((key) => t(`team.${key}`));
  const facilityKeys = Object.keys(FACILITY_ICONS) as (keyof typeof FACILITY_ICONS)[];

  return (
    <div>
      <section className="bg-brand-800 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">{t("eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            {t("intro", { siteName: site.name })}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-ink">{t("facilityHeading")}</h2>
        <p className="mt-3 max-w-3xl text-ink-muted">
          {t("facilityBody")}
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {facilityKeys.map((key) => {
            const Icon = FACILITY_ICONS[key];
            return (
              <div key={key} className="flex gap-4 rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{t(`facilityHighlights.${key}.title`)}</p>
                  <p className="mt-1 text-sm text-ink-muted">{t(`facilityHighlights.${key}.detail`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-ink">{t("teamHeading")}</h2>
          <p className="mt-3 max-w-2xl text-ink-muted">
            {t("teamBody")}
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.vets.map((member) => (
              <div key={member.slug} className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-brand-100" aria-hidden />
                <p className="mt-4 text-sm font-semibold text-ink">{member.name}</p>
                <p className="text-xs font-medium text-brand-700">{member.role}</p>
                <p className="mt-2 text-xs text-ink-muted">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(
              [
                ["nurses", t("team.groups.nurses")],
                ["care", t("team.groups.care")],
                ["operations", t("team.groups.operations")],
              ] as const
            ).map(([key, heading]) => (
              <div key={key}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{heading}</p>
                <ul className="mt-3 space-y-2">
                  {team[key].map((member) => (
                    <li key={member.slug} className="text-sm">
                      <span className="font-medium text-ink">{member.name}</span>
                      <span className="block text-xs text-ink-muted">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
