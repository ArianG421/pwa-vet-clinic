import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFaqByGroup } from "@/lib/data/faq";
import { FaqAccordion } from "@/components/faq-accordion";
import { routing } from "@/lib/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("eyebrow"), description: t("body") };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const groups = getFaqByGroup((key) => t(key));

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">{t("body")}</p>

      <div className="mt-10 space-y-10">
        {groups.map((group) => (
          <section key={group.group}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{group.heading}</h2>
            <div className="mt-4">
              <FaqAccordion items={group.items} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
