import { CalendarClock } from "lucide-react";
import { getTranslations } from "next-intl/server";

// Real clinics on Provet Cloud already expose a plain iframe-embeddable
// booking widget (confirmed by inspecting a live example) — no custom sync
// work needed, Provet stays the single source of truth for availability.
// Set NEXT_PUBLIC_PROVET_BOOKING_URL to a real clinic's
// "https://provetcloud.com/{id}/onlinebooking/" URL to go live; unset (the
// demo default) shows a clearly-labeled placeholder instead of ever
// embedding a stand-in real clinic's live booking system.
const provetBookingUrl = process.env.NEXT_PUBLIC_PROVET_BOOKING_URL;

export async function ProvetBookingEmbed() {
  const t = await getTranslations("book.embed");

  if (provetBookingUrl) {
    return (
      <iframe
        src={provetBookingUrl}
        title={t("iframeTitle")}
        className="h-[800px] w-full rounded-2xl border border-black/5"
      />
    );
  }

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-surface-muted p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <CalendarClock className="h-6 w-6" />
      </span>
      <p className="mt-4 max-w-sm text-sm font-semibold text-ink">{t("placeholderTitle")}</p>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">{t("placeholderBody")}</p>
      <span className="mt-4 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-muted">
        {t("placeholderBadge")}
      </span>
    </div>
  );
}
