// Facts only — translatable text lives in messages/{locale}.json under
// "plans.tiers.<slug>". See getPlanTiers().

export type PlanTierFact = {
  slug: string;
  priceMonthly: number;
  highlighted?: boolean;
  featureCount: number;
};

export const planTierFacts: PlanTierFact[] = [
  { slug: "essential", priceMonthly: 19, featureCount: 4 },
  { slug: "wellness", priceMonthly: 39, highlighted: true, featureCount: 5 },
  { slug: "complete", priceMonthly: 69, featureCount: 6 },
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
