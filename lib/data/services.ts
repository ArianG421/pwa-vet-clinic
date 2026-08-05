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

// Prices are SEK. Where marked "real", the figure is taken directly from
// oresundsveterinarklinik.se's published price list (the pitch target),
// including the species split for vaccination/spay-neuter — cats and dogs
// genuinely price differently there, which is the point of splitting them.
// Everything else is currency-converted from the original placeholder USD
// figures (~10x) rather than invented from scratch, since the reference
// site — like most real clinics — only publishes exact pricing for
// routine/predictable procedures and quotes complex surgical cases
// individually.
export const serviceCategoryFacts: ServiceCategoryFact[] = [
  {
    slug: "surgery",
    icon: "Scissors",
    services: [
      // real: Hankatt 850 / Honkatt 1350
      { slug: "spay-neuter-cat", priceFrom: 850, priceTo: 1350, durationMinutes: 90 },
      // real: Hanhund 3700-4500 / Tik 5300-6300
      { slug: "spay-neuter-dog", priceFrom: 3700, priceTo: 6300, durationMinutes: 90 },
      { slug: "soft-tissue-surgery", priceFrom: 4500, priceTo: 18000, durationMinutes: 120 },
      { slug: "post-op-care-plan", priceFrom: 600, priceTo: 1200, durationMinutes: 30 },
    ],
  },
  {
    slug: "preventive-care",
    icon: "ShieldPlus",
    services: [
      // real: Besiktning vuxen hund/katt 850
      { slug: "wellness-exam", priceFrom: 850, priceTo: 850, durationMinutes: 30 },
      // real: Katt RC/Ducat 435 – Katt Rabies+RCP 820
      { slug: "vaccination-cat", priceFrom: 435, priceTo: 820, durationMinutes: 20 },
      // real: Hund Pi/KC 435 – Hund Rabies+DHPPi 820
      { slug: "vaccination-dog", priceFrom: 435, priceTo: 820, durationMinutes: 20 },
      // real: Kanin Myxo-RHD PLUS 800
      { slug: "vaccination-rabbit", priceFrom: 800, priceTo: 800, durationMinutes: 20 },
      // real: Besiktning valp/kattunge <12v 595 – med chip & vaccination 850
      { slug: "puppy-kitten-starter-visit", priceFrom: 595, priceTo: 850, durationMinutes: 40 },
      // real: ID-märkning chip 320 – tatuering 640
      { slug: "microchipping-id", priceFrom: 320, priceTo: 640, durationMinutes: 15 },
    ],
  },
  {
    slug: "dental",
    icon: "Sparkles",
    services: [
      { slug: "dental-cleaning-polish", priceFrom: 2800, priceTo: 5500, durationMinutes: 90 },
      { slug: "dental-x-rays", priceFrom: 900, priceTo: 1500, durationMinutes: 30 },
      { slug: "tooth-extraction", priceFrom: 1200, priceTo: 4000, durationMinutes: 60 },
    ],
  },
  {
    slug: "diagnostics",
    icon: "FlaskConical",
    services: [
      { slug: "bloodwork-panel", priceFrom: 900, priceTo: 2200, durationMinutes: 45 },
      { slug: "urinalysis", priceFrom: 450, priceTo: 800, durationMinutes: 30 },
      { slug: "rapid-test-panels", priceFrom: 400, priceTo: 950, durationMinutes: 20 },
    ],
  },
  {
    slug: "imaging",
    icon: "ScanLine",
    services: [
      // real: SKK höftleder 1545 – höftleder+armbågsleder 1900
      { slug: "digital-radiography", priceFrom: 1545, priceTo: 1900, durationMinutes: 30 },
      // real: Bukultraljud 3000-3200
      { slug: "abdominal-ultrasound", priceFrom: 3000, priceTo: 3200, durationMinutes: 45 },
    ],
  },
  {
    slug: "orthopedics",
    icon: "Bone",
    services: [
      { slug: "orthopedic-consultation", priceFrom: 850, priceTo: 1400, durationMinutes: 40 },
      { slug: "cruciate-acl-repair", priceFrom: 18000, priceTo: 38000, durationMinutes: 150 },
      { slug: "fracture-repair", priceFrom: 9000, priceTo: 32000, durationMinutes: 150 },
    ],
  },
  {
    slug: "endoscopy",
    icon: "Search",
    services: [
      { slug: "gastroscopy", priceFrom: 4500, priceTo: 9500, durationMinutes: 60 },
      { slug: "bronchoscopy", priceFrom: 4500, priceTo: 9500, durationMinutes: 60 },
      { slug: "foreign-body-retrieval", priceFrom: 5000, priceTo: 11000, durationMinutes: 75 },
    ],
  },
  {
    slug: "emergency",
    icon: "Siren",
    services: [
      { slug: "emergency-exam", priceFrom: 1200, priceTo: 1800, durationMinutes: 30 },
      { slug: "overnight-monitoring", priceFrom: 2000, priceTo: 4500, durationMinutes: 720 },
      { slug: "after-hours-consultation", priceFrom: 0, priceTo: 450, durationMinutes: 15 },
    ],
  },
];

export type ServiceRichSection = {
  heading: string;
  body?: string;
  bullets?: { label: string; detail?: string }[];
};

export type ServiceRichContent = {
  intro: string;
  sections: ServiceRichSection[];
};

// Purely textual (no language-neutral facts to merge), so this reads
// directly via next-intl's raw accessor rather than going through the
// facts-array pattern the rest of this file uses.
export function getServiceRichContent(tRaw: (key: string) => unknown, slug: string): ServiceRichContent | null {
  try {
    const raw = tRaw(`categories.${slug}.richContent`);
    return (raw as ServiceRichContent) ?? null;
  } catch {
    return null;
  }
}

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

// Staff can edit prices in the CRM (services.price_from/price_to in
// Supabase) — this overlays those live values onto the hardcoded facts by
// slug, so pages display whatever staff last set instead of the seed
// figures. Services with no matching DB row (e.g. Supabase not configured)
// keep their hardcoded price untouched.
export function withDbServicePrices<T extends { slug: string; priceFrom: number; priceTo: number }>(
  services: T[],
  dbRows: { slug: string | null; price_from: number; price_to: number }[]
): T[] {
  const bySlug = new Map(dbRows.filter((r) => r.slug).map((r) => [r.slug as string, r]));
  return services.map((service) => {
    const dbRow = bySlug.get(service.slug);
    return dbRow ? { ...service, priceFrom: dbRow.price_from, priceTo: dbRow.price_to } : service;
  });
}
