// Language-neutral facts only. Translatable text (name, summary, description)
// lives in messages/{locale}.json under "services.categories.<slug>" and
// "services.categories.<slug>.services.<serviceSlug>", keyed by the slugs
// below — see getServiceCategories() for how the two are merged at render
// time. This same shape is what the Supabase seed script mirrors.

export type ServiceFact = {
  slug: string;
  priceFrom: number;
  priceTo: number;
  durationMinutes: number;
};

export type ServiceCategoryFact = {
  slug: string;
  icon: string;
  services: ServiceFact[];
};

export const serviceCategoryFacts: ServiceCategoryFact[] = [
  {
    slug: "surgery",
    icon: "Scissors",
    services: [
      { slug: "spay-neuter", priceFrom: 220, priceTo: 420, durationMinutes: 90 },
      { slug: "soft-tissue-surgery", priceFrom: 450, priceTo: 1800, durationMinutes: 120 },
      { slug: "post-op-care-plan", priceFrom: 60, priceTo: 120, durationMinutes: 30 },
    ],
  },
  {
    slug: "preventive-care",
    icon: "ShieldPlus",
    services: [
      { slug: "wellness-exam", priceFrom: 55, priceTo: 90, durationMinutes: 30 },
      { slug: "vaccination-package", priceFrom: 40, priceTo: 150, durationMinutes: 20 },
      { slug: "puppy-kitten-starter-visit", priceFrom: 70, priceTo: 110, durationMinutes: 40 },
      { slug: "microchipping-id", priceFrom: 35, priceTo: 55, durationMinutes: 15 },
    ],
  },
  {
    slug: "dental",
    icon: "Sparkles",
    services: [
      { slug: "dental-cleaning-polish", priceFrom: 280, priceTo: 550, durationMinutes: 90 },
      { slug: "dental-x-rays", priceFrom: 90, priceTo: 150, durationMinutes: 30 },
      { slug: "tooth-extraction", priceFrom: 120, priceTo: 400, durationMinutes: 60 },
    ],
  },
  {
    slug: "diagnostics",
    icon: "FlaskConical",
    services: [
      { slug: "bloodwork-panel", priceFrom: 90, priceTo: 220, durationMinutes: 45 },
      { slug: "urinalysis", priceFrom: 45, priceTo: 80, durationMinutes: 30 },
      { slug: "rapid-test-panels", priceFrom: 40, priceTo: 95, durationMinutes: 20 },
    ],
  },
  {
    slug: "imaging",
    icon: "ScanLine",
    services: [
      { slug: "digital-radiography", priceFrom: 110, priceTo: 260, durationMinutes: 30 },
      { slug: "abdominal-ultrasound", priceFrom: 180, priceTo: 350, durationMinutes: 45 },
    ],
  },
  {
    slug: "orthopedics",
    icon: "Bone",
    services: [
      { slug: "orthopedic-consultation", priceFrom: 85, priceTo: 140, durationMinutes: 40 },
      { slug: "cruciate-acl-repair", priceFrom: 1800, priceTo: 3800, durationMinutes: 150 },
      { slug: "fracture-repair", priceFrom: 900, priceTo: 3200, durationMinutes: 150 },
    ],
  },
  {
    slug: "endoscopy",
    icon: "Search",
    services: [
      { slug: "gastroscopy", priceFrom: 450, priceTo: 950, durationMinutes: 60 },
      { slug: "bronchoscopy", priceFrom: 450, priceTo: 950, durationMinutes: 60 },
      { slug: "foreign-body-retrieval", priceFrom: 500, priceTo: 1100, durationMinutes: 75 },
    ],
  },
  {
    slug: "emergency",
    icon: "Siren",
    services: [
      { slug: "emergency-exam", priceFrom: 120, priceTo: 180, durationMinutes: 30 },
      { slug: "overnight-monitoring", priceFrom: 200, priceTo: 450, durationMinutes: 720 },
      { slug: "after-hours-consultation", priceFrom: 0, priceTo: 45, durationMinutes: 15 },
    ],
  },
];

export type ServiceItem = ServiceFact & { name: string; description: string };
export type ServiceCategory = Omit<ServiceCategoryFact, "services"> & {
  name: string;
  summary: string;
  description: string;
  services: ServiceItem[];
};

// `t` is a next-intl translator scoped to the "services" namespace.
export function getServiceCategories(t: (key: string) => string): ServiceCategory[] {
  return serviceCategoryFacts.map((cat) => ({
    ...cat,
    name: t(`categories.${cat.slug}.name`),
    summary: t(`categories.${cat.slug}.summary`),
    description: t(`categories.${cat.slug}.description`),
    services: cat.services.map((s) => ({
      ...s,
      name: t(`categories.${cat.slug}.services.${s.slug}.name`),
      description: t(`categories.${cat.slug}.services.${s.slug}.description`),
    })),
  }));
}

export function getServiceCategory(t: (key: string) => string, slug: string) {
  return getServiceCategories(t).find((c) => c.slug === slug);
}

// Service slugs are unique across the whole catalog, so a DB row carrying
// only its own slug (not its parent category's) can still be matched back
// to translated text by searching every category.
export function getServiceBySlug(t: (key: string) => string, slug: string | null | undefined) {
  if (!slug) return undefined;
  for (const cat of getServiceCategories(t)) {
    const found = cat.services.find((s) => s.slug === slug);
    if (found) return found;
  }
  return undefined;
}
