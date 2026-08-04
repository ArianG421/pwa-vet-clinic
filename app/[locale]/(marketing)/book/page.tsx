import type { Metadata } from "next";
import { ArrowRight, Gift, History } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ProvetBookingEmbed } from "@/components/provet-booking-embed";
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
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("eyebrow"), description: t("body") };
}

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">{t("body")}</p>

      <div className="mt-8">
        <ProvetBookingEmbed />
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-black/5 bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{t("accountPitchTitle")}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
              <History className="h-3.5 w-3.5 shrink-0" /> {t("accountPitchBody")}
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="cta-bounce inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          {t("createAccount")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
