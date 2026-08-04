// Facts only — translatable text lives in messages/{locale}.json under
// "portal.rewards.tiers.<slug>", "portal.rewards.catalog.<id>", and
// "portal.rewards.seed.<id>". See the getters below.

export type LoyaltyTierFact = { slug: string; minPoints: number };

// Tier is based on lifetime points earned (not current balance), so redeeming
// rewards never knocks a member back down a tier — standard loyalty-program practice.
export const loyaltyTierFacts: LoyaltyTierFact[] = [
  { slug: "tail-wagger", minPoints: 0 },
  { slug: "loyal-companion", minPoints: 500 },
  { slug: "best-friend", minPoints: 1500 },
];

export type LoyaltyTier = LoyaltyTierFact & { name: string; perk: string };

export function getLoyaltyTiers(t: (key: string) => string): LoyaltyTier[] {
  return loyaltyTierFacts.map((tier) => ({
    ...tier,
    name: t(`tiers.${tier.slug}.name`),
    perk: t(`tiers.${tier.slug}.perk`),
  }));
}

export function getTier(t: (key: string) => string, lifetimePoints: number): LoyaltyTier {
  const tiers = getLoyaltyTiers(t);
  return [...tiers].reverse().find((tier) => lifetimePoints >= tier.minPoints) ?? tiers[0];
}

export function getNextTier(t: (key: string) => string, lifetimePoints: number): LoyaltyTier | null {
  const tiers = getLoyaltyTiers(t);
  return tiers.find((tier) => tier.minPoints > lifetimePoints) ?? null;
}

export type RewardFact = { id: string; pointsCost: number; kind: "discount" | "free-service" };

export const rewardFacts: RewardFact[] = [
  { id: "discount-5", pointsCost: 100, kind: "discount" },
  { id: "free-nail-trim", pointsCost: 150, kind: "free-service" },
  { id: "discount-15", pointsCost: 250, kind: "discount" },
  { id: "free-follow-up", pointsCost: 350, kind: "free-service" },
  { id: "discount-50", pointsCost: 600, kind: "discount" },
  { id: "free-wellness", pointsCost: 800, kind: "free-service" },
];

export type RewardItem = RewardFact & { name: string; description: string };

export function getRewardsCatalog(t: (key: string) => string): RewardItem[] {
  return rewardFacts.map((reward) => ({
    ...reward,
    name: t(`catalog.${reward.id}.name`),
    description: t(`catalog.${reward.id}.description`),
  }));
}

export type LoyaltyTransaction = {
  id: string;
  type: "earn" | "redeem";
  points: number;
  label: string;
  detail: string;
  date: string; // ISO date
};

const seedFacts = [
  { id: "seed-1", points: 65, date: "2026-06-12" },
  { id: "seed-2", points: 95, date: "2026-06-12" },
  { id: "seed-3", points: 110, date: "2026-07-03" },
  { id: "seed-4", points: 140, date: "2026-07-22" },
] as const;

// Seeded demo history — a few past visits already earning points, so the
// portal shows a believable in-progress member rather than an empty state.
// Only used the first time a browser has no stored transactions, so it's
// generated once in the locale active at that moment.
export function getSeedTransactions(t: (key: string) => string): LoyaltyTransaction[] {
  return seedFacts.map((fact) => ({
    id: fact.id,
    type: "earn" as const,
    points: fact.points,
    label: t(`seed.${fact.id}.label`),
    detail: t(`seed.${fact.id}.detail`),
    date: fact.date,
  }));
}
