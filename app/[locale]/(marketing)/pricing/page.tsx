import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";
import { getPlanTiers } from "@/lib/data/plans";
import { formatKr } from "@/lib/currency";
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
  const t = await getTranslations({ locale, namespace: "pricing" });
  return { title: t("eyebrow"), description: t("body") };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const tPlans = await getTranslations("plans");
  const planTiers = getPlanTiers(
    (key) => tPlans(key),
    (key) => tPlans.raw(key) as unknown as string[]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-ink-muted">
          {t("body")}
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {planTiers.map((plan) => (
          <div
            key={plan.slug}
            className={`flex flex-col rounded-3xl border p-6 ${
              plan.highlighted
                ? "border-brand-600 bg-brand-800 text-white shadow-xl"
                : "border-black/5 bg-surface text-ink shadow-sm"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white">
                {t("mostPopular")}
              </span>
            )}
            <p className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-ink"}`}>{plan.name}</p>
            <p className={`mt-1 text-sm ${plan.highlighted ? "text-brand-100" : "text-ink-muted"}`}>{plan.tagline}</p>
            <p className="mt-5">
              <span className="text-4xl font-bold">{formatKr(plan.priceMonthly)}</span>
              <span className={`text-sm ${plan.highlighted ? "text-brand-100" : "text-ink-muted"}`}> {t("perMonth")}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-accent-300" : "text-brand-600"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className={`mt-8 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-accent-500 text-white hover:bg-accent-600"
                  : "bg-brand-700 text-white hover:bg-brand-800"
              }`}
            >
              {t("choosePlan", { name: plan.name })}
            </Link>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-ink-muted">
        {t("demoDisclaimer")}
      </p>
    </div>
  );
}
