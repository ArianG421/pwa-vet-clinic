export type PlanTier = {
  slug: string;
  name: string;
  priceMonthly: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
};

export const planTiers: PlanTier[] = [
  {
    slug: "essential",
    name: "Essential",
    priceMonthly: 19,
    tagline: "For healthy pets that just need the basics covered.",
    features: [
      "1 wellness exam per year",
      "10% off vaccinations",
      "Member-only booking priority",
      "Email appointment reminders",
    ],
  },
  {
    slug: "wellness",
    name: "Wellness Plus",
    priceMonthly: 39,
    tagline: "Our most popular plan for ongoing preventive care.",
    highlighted: true,
    features: [
      "2 wellness exams per year",
      "20% off vaccinations & dental cleanings",
      "Free annual bloodwork panel",
      "Priority booking + same-week appointments",
      "24/7 after-hours triage line",
    ],
  },
  {
    slug: "complete",
    name: "Complete Care",
    priceMonthly: 69,
    tagline: "Comprehensive coverage for senior pets or multi-pet households.",
    features: [
      "Unlimited wellness exams",
      "30% off surgery, dental & imaging",
      "Free annual bloodwork + urinalysis",
      "Dedicated care coordinator",
      "24/7 after-hours triage line",
      "Multi-pet discount eligible",
    ],
  },
];
