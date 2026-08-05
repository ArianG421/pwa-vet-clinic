import { getTranslations } from "next-intl/server";
import { getServiceCategories } from "@/lib/data/services";
import { getFaqItems } from "@/lib/data/faq";
import { getPlanTiers } from "@/lib/data/plans";
import { site } from "@/lib/site";

// One shared index for both the free instant-search tier and the Ask AI
// tier's system-prompt context, so the two never drift out of sync. Every
// entry's `path` is a real, navigable route — this is also what bounds the
// AI's `navigate` tool to an enum of paths that actually exist (see
// app/api/assistant/chat/route.ts).
export type AssistantIndexEntry = {
  id: string;
  title: string;
  description: string;
  path: string;
  // Not shown to the user — boosts matching for words a visitor would
  // naturally type that don't appear in the page's own title/copy (e.g.
  // the nav calls it "Membership", but someone typing "pricing" should
  // still land here).
  keywords?: string;
};

export async function getAssistantIndex(locale: string): Promise<AssistantIndexEntry[]> {
  const [tAssistant, tNav, tSite, tServicesPage, tServices, tPricing, tPlans, tAbout, tFaq, tContact, tBook] =
    await Promise.all([
      getTranslations({ locale, namespace: "assistant" }),
      getTranslations({ locale, namespace: "nav" }),
      getTranslations({ locale, namespace: "site" }),
      getTranslations({ locale, namespace: "servicesPage" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "pricing" }),
      getTranslations({ locale, namespace: "plans" }),
      getTranslations({ locale, namespace: "about" }),
      getTranslations({ locale, namespace: "faq" }),
      getTranslations({ locale, namespace: "contact" }),
      getTranslations({ locale, namespace: "book" }),
    ]);

  const entries: AssistantIndexEntry[] = [
    { id: "page-home", title: tAssistant("pages.home.title"), description: tSite("tagline"), path: "/", keywords: tAssistant("pages.home.keywords") },
    { id: "page-services", title: tNav("services"), description: tServicesPage("body"), path: "/services", keywords: tAssistant("pages.services.keywords") },
    { id: "page-pricing", title: tNav("pricing"), description: tPricing("body"), path: "/pricing", keywords: tAssistant("pages.pricing.keywords") },
    { id: "page-about", title: tNav("about"), description: tAbout("intro", { siteName: site.name }), path: "/about", keywords: tAssistant("pages.about.keywords") },
    { id: "page-faq", title: tNav("faq"), description: tFaq("body"), path: "/faq", keywords: tAssistant("pages.faq.keywords") },
    { id: "page-contact", title: tNav("contact"), description: tContact("body"), path: "/contact", keywords: tAssistant("pages.contact.keywords") },
    { id: "page-book", title: tNav("bookVisit"), description: tBook("body"), path: "/book", keywords: tAssistant("pages.book.keywords") },
  ];

  for (const category of getServiceCategories((key) => tServices(key))) {
    entries.push({
      id: `service-category-${category.slug}`,
      title: category.name,
      description: category.summary,
      path: `/services/${category.slug}`,
    });
    for (const service of category.services) {
      entries.push({
        id: `service-${service.slug}`,
        title: service.name,
        description: service.description,
        path: `/services/${category.slug}`,
      });
    }
  }

  for (const tier of getPlanTiers((key) => tPlans(key), (key) => tPlans.raw(key) as unknown as string[])) {
    entries.push({
      id: `plan-${tier.slug}`,
      title: tier.name,
      description: tier.tagline,
      path: "/pricing",
    });
  }

  for (const item of getFaqItems((key) => tFaq(key))) {
    entries.push({
      id: `faq-${item.slug}`,
      title: item.question,
      description: item.answer,
      path: "/faq",
    });
  }

  return entries;
}
