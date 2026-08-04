import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { getServiceCategory, serviceCategoryFacts } from "@/lib/data/services";
import { CategoryIcon } from "@/components/category-icon";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { routing } from "@/lib/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceCategoryFacts.map((c) => ({ locale, category: c.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}): Promise<Metadata> {
  const { category, locale } = await params;
  const tServices = await getTranslations({ locale, namespace: "services" });
  const cat = getServiceCategory((key) => tServices(key), category);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("serviceCategory");
  const tServices = await getTranslations("services");
  const cat = getServiceCategory((key) => tServices(key), category);
  if (!cat) notFound();

  function formatPrice(from: number, to: number) {
    if (from === 0 && to === 0) return t("priceIncluded");
    if (from === to) return `$${from}`;
    return `$${from}–$${to}`;
  }

  function formatDuration(minutes: number) {
    if (minutes >= 60) {
      const hours = Math.round((minutes / 60) * 10) / 10;
      return t("durationHr", { hours });
    }
    return t("durationMin", { minutes });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Breadcrumbs items={[{ label: t("servicesCrumb"), href: "/services" }, { label: cat.name }]} />

      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <CategoryIcon name={cat.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{cat.name}</h1>
          <p className="mt-2 text-ink-muted">{cat.description}</p>
        </div>
      </div>

      <div className="mt-10 divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
        {cat.services.map((service) => (
          <div key={service.slug} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">{service.name}</p>
              <p className="mt-1 text-sm text-ink-muted">{service.description}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Clock className="h-3.5 w-3.5" /> {formatDuration(service.durationMinutes)}
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="text-lg font-semibold text-brand-700">{formatPrice(service.priceFrom, service.priceTo)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl bg-brand-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{t("readyToBook", { category: cat.name.toLowerCase() })}</p>
          <p className="mt-1 text-sm text-brand-100">{t("priorityNote")}</p>
        </div>
        <Link
          href="/portal/appointments"
          className="shrink-0 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          {t("bookAppointment")}
        </Link>
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        {t("pricingDisclaimer")}
      </p>
    </div>
  );
}
