// Facts only — translatable text lives in messages/{locale}.json under
// "plans.tiers.<slug>". See getPlanTiers().

export type PlanTierFact = {
  slug: string;
  priceMonthly: number;
  highlighted?: boolean;
  featureCount: number;
};

export const planTierFacts: PlanTierFact[] = [
  { slug: "essential", priceMonthly: 190, featureCount: 4 },
  { slug: "wellness", priceMonthly: 390, highlighted: true, featureCount: 5 },
  { slug: "complete", priceMonthly: 690, featureCount: 6 },
];

export type PlanTier = PlanTierFact & { name: string; tagline: string; features: string[] };

export function getPlanTiers(t: (key: string) => string, tRaw: (key: string) => string[]): PlanTier[] {
  return planTierFacts.map((tier) => ({
    ...tier,
    name: t(`tiers.${tier.slug}.name`),
    tagline: t(`tiers.${tier.slug}.tagline`),
    features: tRaw(`tiers.${tier.slug}.features`),
  }));
}

// For translating a DB-fetched subscription_tiers row (which already has its
// own name/tagline/features in English) back to the active locale via its
// slug, falling back to the DB values if the slug doesn't match anything
// (e.g. a tier added later that hasn't been translated yet).
export function getPlanText(
  t: (key: string) => string,
  tRaw: (key: string) => string[],
  slug: string,
  fallback: { name: string; tagline: string | null; features: string[] }
) {
  try {
    return {
      name: t(`tiers.${slug}.name`),
      tagline: t(`tiers.${slug}.tagline`),
      features: tRaw(`tiers.${slug}.features`),
    };
  } catch {
    return { name: fallback.name, tagline: fallback.tagline ?? "", features: fallback.features };
  }
}

// Same overlay pattern as withDbServicePrices in lib/data/services.ts —
// staff-edited subscription_tiers.price_monthly overlays the hardcoded fact
// by slug, untouched if there's no matching DB row.
export function withDbTierPrices<T extends { slug: string; priceMonthly: number }>(
  tiers: T[],
  dbRows: { slug: string; price_monthly: number }[]
): T[] {
  const bySlug = new Map(dbRows.map((r) => [r.slug, r]));
  return tiers.map((tier) => {
    const dbRow = bySlug.get(tier.slug);
    return dbRow ? { ...tier, priceMonthly: dbRow.price_monthly } : tier;
  });
}
