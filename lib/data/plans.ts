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
