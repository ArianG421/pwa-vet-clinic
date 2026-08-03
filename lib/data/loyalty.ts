export type LoyaltyTier = {
  slug: string;
  name: string;
  minPoints: number;
  perk: string;
};

// Tier is based on lifetime points earned (not current balance), so redeeming
// rewards never knocks a member back down a tier — standard loyalty-program practice.
export const loyaltyTiers: LoyaltyTier[] = [
  { slug: "tail-wagger", name: "Tail Wagger", minPoints: 0, perk: "1 point per $1 spent" },
  { slug: "loyal-companion", name: "Loyal Companion", minPoints: 500, perk: "1.25 points per $1 + early booking windows" },
  { slug: "best-friend", name: "Best Friend", minPoints: 1500, perk: "1.5 points per $1 + a free annual wellness exam" },
];

export function getTier(lifetimePoints: number): LoyaltyTier {
  return [...loyaltyTiers].reverse().find((t) => lifetimePoints >= t.minPoints) ?? loyaltyTiers[0];
}

export function getNextTier(lifetimePoints: number): LoyaltyTier | null {
  return loyaltyTiers.find((t) => t.minPoints > lifetimePoints) ?? null;
}

export type RewardItem = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  kind: "discount" | "free-service";
};

export const rewardsCatalog: RewardItem[] = [
  { id: "discount-5", name: "$5 off your next visit", description: "Applies to any appointment, no minimum spend.", pointsCost: 100, kind: "discount" },
  { id: "free-nail-trim", name: "Free nail trim", description: "A quick, complimentary trim at any visit.", pointsCost: 150, kind: "free-service" },
  { id: "discount-15", name: "$15 off your next visit", description: "Applies to any appointment, no minimum spend.", pointsCost: 250, kind: "discount" },
  { id: "free-follow-up", name: "Free follow-up exam", description: "A complimentary recheck within 30 days of a visit.", pointsCost: 350, kind: "free-service" },
  { id: "discount-50", name: "$50 off a procedure", description: "Applies to surgery, dental, or orthopedic procedures.", pointsCost: 600, kind: "discount" },
  { id: "free-wellness", name: "Free wellness exam", description: "A full nose-to-tail check-up, on us (up to $90 value).", pointsCost: 800, kind: "free-service" },
];

export type LoyaltyTransaction = {
  id: string;
  type: "earn" | "redeem";
  points: number;
  label: string;
  detail: string;
  date: string; // ISO date
};

// Seeded demo history — a few past visits already earning points, so the
// portal shows a believable in-progress member rather than an empty state.
export const seedTransactions: LoyaltyTransaction[] = [
  { id: "seed-1", type: "earn", points: 65, label: "Wellness Exam", detail: "Visit on Jun 12", date: "2026-06-12" },
  { id: "seed-2", type: "earn", points: 95, label: "Vaccination Package", detail: "Visit on Jun 12", date: "2026-06-12" },
  { id: "seed-3", type: "earn", points: 110, label: "Bloodwork Panel", detail: "Visit on Jul 3", date: "2026-07-03" },
  { id: "seed-4", type: "earn", points: 140, label: "Digital Radiography", detail: "Visit on Jul 22", date: "2026-07-22" },
];
