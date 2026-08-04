// Facts only — translatable text lives in messages/{locale}.json under
// "faq.groups.<group>" and "faq.items.<slug>.{question,answer}". Content is
// drawn from oresundsveterinarklinik.se's real FAQ page (the pitch target),
// grouped into topic clusters for scanability rather than one flat list.

export type FaqGroup = "symptoms" | "surgery" | "booking";

export const faqGroupOrder: FaqGroup[] = ["symptoms", "surgery", "booking"];

export type FaqFact = { slug: string; group: FaqGroup };

export const faqFacts: FaqFact[] = [
  { slug: "tick-prescription", group: "booking" },
  { slug: "cat-neuter-age", group: "surgery" },
  { slug: "fever", group: "symptoms" },
  { slug: "diarrhea", group: "symptoms" },
  { slug: "overweight", group: "symptoms" },
  { slug: "cough", group: "symptoms" },
  { slug: "heat-cycle", group: "surgery" },
  { slug: "neuter-pros-cons", group: "surgery" },
  { slug: "vomiting-cat", group: "symptoms" },
  { slug: "prescription-no-visit", group: "booking" },
];

export type FaqItem = FaqFact & { question: string; answer: string };

export function getFaqItems(t: (key: string) => string): FaqItem[] {
  return faqFacts.map((f) => ({
    ...f,
    question: t(`items.${f.slug}.question`),
    answer: t(`items.${f.slug}.answer`),
  }));
}

export function getFaqByGroup(t: (key: string) => string) {
  const items = getFaqItems(t);
  return faqGroupOrder.map((group) => ({
    group,
    heading: t(`groups.${group}`),
    items: items.filter((i) => i.group === group),
  }));
}
