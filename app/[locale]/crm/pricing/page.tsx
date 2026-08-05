"use client";

import { useTranslations } from "next-intl";
import { useCrmPricing } from "@/hooks/use-crm-pricing";
import { PawLoader } from "@/components/paw-loader";
import { ServicePriceRow } from "@/components/crm/service-price-row";
import { TierPriceRow } from "@/components/crm/tier-price-row";
import { getServiceBySlug } from "@/lib/data/services";
import { getPlanText } from "@/lib/data/plans";

export default function CrmPricingPage() {
  const t = useTranslations("crm.pricing");
  const tServices = useTranslations("services");
  const tPlans = useTranslations("plans");
  const { categories, services, tiers, loaded, error, updateServicePrice, updateTierPrice } = useCrmPricing();
  const categoryList = categories ?? [];
  const serviceList = services ?? [];
  const tierList = tiers ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">{t("subtitle")}</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loaded ? (
        <PawLoader />
      ) : (
        <>
          <h2 className="mt-8 text-lg font-semibold text-ink">{t("servicesHeading")}</h2>
          <div className="mt-4 space-y-6">
            {categoryList.map((category) => {
              const categoryServices = serviceList.filter((s) => s.category_id === category.id);
              if (categoryServices.length === 0) return null;
              return (
                <div key={category.id}>
                  <p className="text-sm font-semibold text-ink-muted">
                    {tServices(`categories.${category.slug}.name`)}
                  </p>
                  <div className="mt-2 divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
                    {categoryServices.map((service) => {
                      const text = getServiceBySlug(tServices, service.slug);
                      return (
                        <ServicePriceRow
                          key={service.id}
                          name={text?.name ?? service.name}
                          description={text?.description ?? ""}
                          priceFrom={service.price_from}
                          priceTo={service.price_to}
                          onSave={(from, to) => updateServicePrice(service.id, from, to)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="mt-10 text-lg font-semibold text-ink">{t("plansHeading")}</h2>
          <div className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
            {tierList.map((tier) => {
              const text = getPlanText(tPlans, (k) => tPlans.raw(k) as unknown as string[], tier.slug, tier);
              return (
                <TierPriceRow
                  key={tier.id}
                  name={text.name}
                  tagline={text.tagline}
                  priceMonthly={tier.price_monthly}
                  onSave={(price) => updateTierPrice(tier.id, price)}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
