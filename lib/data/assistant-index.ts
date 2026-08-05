import { getTranslations } from "next-intl/server";
import { getServiceCategories, withDbServicePrices } from "@/lib/data/services";
import { getFaqItems } from "@/lib/data/faq";
import { getPlanTiers, withDbTierPrices } from "@/lib/data/plans";
import { site } from "@/lib/site";
import { formatKr } from "@/lib/currency";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

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

// Pure derived data (translations + hardcoded facts) that only changes on
// redeploy — but it gets rebuilt on every marketing page load (from the
// layout) and every Ask AI message, so it's worth computing once per locale
// per server process rather than on every call. Caching the in-flight
// promise (not just the resolved value) means concurrent callers before the
// first computation finishes all await the same one instead of triggering
// duplicate work.
const indexCache = new Map<string, Promise<AssistantIndexEntry[]>>();

export function getAssistantIndex(locale: string): Promise<AssistantIndexEntry[]> {
  let cached = indexCache.get(locale);
  if (!cached) {
    cached = computeAssistantIndex(locale);
    indexCache.set(locale, cached);
  }
  return cached;
}

// Staff can edit prices from /crm/pricing — without this, an edit would
// show correctly on the (uncached) marketing pages but stay stale here
// until the server process restarts. Called from hooks/use-crm-pricing.ts
// via /api/assistant/invalidate after a successful price update.
export function invalidateAssistantIndex(locale?: string) {
  if (locale) indexCache.delete(locale);
  else indexCache.clear();
}

async function computeAssistantIndex(locale: string): Promise<AssistantIndexEntry[]> {
  const [tAssistant, tNav, tSite, tServicesPage, tServices, tPricing, tPlans, tAbout, tFaq, tContact, tBook, tLogin] =
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
      getTranslations({ locale, namespace: "login" }),
    ]);

  let dbServices: { slug: string | null; price_from: number; price_to: number }[] = [];
  let dbTiers: { slug: string; price_monthly: number }[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const [{ data: serviceRows }, { data: tierRows }] = await Promise.all([
      supabase.from("services").select("slug, price_from, price_to"),
      supabase.from("subscription_tiers").select("slug, price_monthly"),
    ]);
    dbServices = serviceRows ?? [];
    dbTiers = tierRows ?? [];
  }

  const entries: AssistantIndexEntry[] = [
    { id: "page-home", title: tAssistant("pages.home.title"), description: tSite("tagline"), path: "/", keywords: tAssistant("pages.home.keywords") },
    { id: "page-services", title: tNav("services"), description: tServicesPage("body"), path: "/services", keywords: tAssistant("pages.services.keywords") },
    { id: "page-pricing", title: tNav("pricing"), description: tPricing("body"), path: "/pricing", keywords: tAssistant("pages.pricing.keywords") },
    { id: "page-about", title: tNav("about"), description: tAbout("intro", { siteName: site.name }), path: "/about", keywords: tAssistant("pages.about.keywords") },
    { id: "page-faq", title: tNav("faq"), description: tFaq("body"), path: "/faq", keywords: tAssistant("pages.faq.keywords") },
    { id: "page-contact", title: tNav("contact"), description: tContact("body"), path: "/contact", keywords: tAssistant("pages.contact.keywords") },
    { id: "page-book", title: tNav("bookVisit"), description: tBook("body"), path: "/book", keywords: tAssistant("pages.book.keywords") },
    { id: "page-login", title: tAssistant("pages.login.title"), description: tLogin("subtitle"), path: "/login", keywords: tAssistant("pages.login.keywords") },
  ];

  const perMonth = locale === "sv" ? "/månad" : "/month";

  for (const category of getServiceCategories((key) => tServices(key))) {
    entries.push({
      id: `service-category-${category.slug}`,
      title: category.name,
      description: category.summary,
      path: `/services/${category.slug}`,
    });
    for (const service of withDbServicePrices(category.services, dbServices)) {
      // Prices are real facts, not marketing copy — folding them into the
      // description is what lets both Quick-links and the AI actually
      // answer "how much does X cost" instead of pointing away from it.
      const priceLabel =
        service.priceFrom === service.priceTo
          ? formatKr(service.priceFrom)
          : `${formatKr(service.priceFrom)}–${formatKr(service.priceTo)}`;
      entries.push({
        id: `service-${service.slug}`,
        title: service.name,
        description: `${service.description} (${priceLabel})`,
        path: `/services/${category.slug}`,
      });
    }
  }

  const planTiers = withDbTierPrices(
    getPlanTiers((key) => tPlans(key), (key) => tPlans.raw(key) as unknown as string[]),
    dbTiers
  );
  for (const tier of planTiers) {
    entries.push({
      id: `plan-${tier.slug}`,
      title: tier.name,
      description: `${tier.tagline} (${formatKr(tier.priceMonthly)}${perMonth})`,
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
