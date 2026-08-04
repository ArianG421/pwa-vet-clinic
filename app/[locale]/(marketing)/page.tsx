import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { getServiceCategories } from "@/lib/data/services";
import { getHeroSlides, getInfoCards } from "@/lib/data/gallery";
import { CategoryIcon } from "@/components/category-icon";
import { HeroCarousel } from "@/components/hero-carousel";
import { InfoPager } from "@/components/info-pager";
import { FloatingPaws } from "@/components/floating-paws";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { site } from "@/lib/site";
import { routing } from "@/lib/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tSite = await getTranslations("site");
  const tServices = await getTranslations("services");

  const serviceCategories = getServiceCategories((key) => tServices(key));
  const heroSlides = getHeroSlides((key) => t(`hero.${key}`));
  const infoCards = getInfoCards((key) => t(`infoPager.${key}`));
  const bullets = t.raw("portalPitch.bullets") as string[];

  return (
    <>
      <section className="relative overflow-hidden bg-brand-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
        <FloatingPaws />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-50">
              <Sparkles className="h-3.5 w-3.5" /> {t("badge")}
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              {tSite("tagline")}
            </h1>
            <p className="mt-4 max-w-lg text-base text-brand-100 sm:text-lg">
              {t("heroBody", { siteName: site.name })}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/portal/appointments"
                className="cta-bounce inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-900/20 transition-colors hover:bg-accent-600"
              >
                {t("bookAppointment")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t("exploreServices")}
              </Link>
            </div>
          </div>
          <HeroCarousel slides={heroSlides} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <RevealOnScroll className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("whyWillowbrook.eyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            {t("whyWillowbrook.heading")}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delayMs={100} className="mx-auto mt-8 max-w-2xl">
          <InfoPager cards={infoCards} />
        </RevealOnScroll>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <RevealOnScroll className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{t("categories.heading")}</h2>
            <p className="mt-2 max-w-xl text-sm text-ink-muted sm:text-base">
              {t("categories.body")}
            </p>
          </div>
          <Link href="/services" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:flex">
            {t("categories.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </RevealOnScroll>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {serviceCategories.map((cat, i) => (
            <RevealOnScroll key={cat.slug} delayMs={i * 60}>
              <Link
                href={`/services/${cat.slug}`}
                className="group block h-full rounded-2xl border border-black/5 bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <CategoryIcon name={cat.icon} className="wiggle-on-hover h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">{cat.name}</p>
                <p className="mt-1 text-xs text-ink-muted">{cat.summary}</p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <RevealOnScroll>
              <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
                {t("portalPitch.heading")}
              </h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">
                {t("portalPitch.body", { shortName: site.shortName })}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink">
                {bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Sparkles className="h-2.5 w-2.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="cta-bounce mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
              >
                {t("portalPitch.createAccount")} <ArrowRight className="h-4 w-4" />
              </Link>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120} className="rounded-3xl border border-black/5 bg-surface p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{t("portalPitch.memberPlansTitle")}</p>
              <p className="mt-1 text-sm text-ink-muted">{t("portalPitch.memberPlansBody")}</p>
              <Link href="/pricing" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                {t("portalPitch.comparePlans")} <ArrowRight className="h-4 w-4" />
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
