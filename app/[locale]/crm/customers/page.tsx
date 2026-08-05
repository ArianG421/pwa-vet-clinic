"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, User } from "lucide-react";
import { useCrmCustomers } from "@/hooks/use-crm-customers";
import { PawLoader } from "@/components/paw-loader";
import { CustomerProfileModal } from "@/components/crm/customer-profile-modal";
import type { CustomerActivity } from "@/lib/crm-activity";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CrmCustomersPage() {
  const t = useTranslations("crm.customers");
  const { customers, loaded, error } = useCrmCustomers();
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<CustomerActivity | null>(null);

  const filtered = useMemo(() => {
    if (!customers) return [];
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        (c.profile.full_name ?? "").toLowerCase().includes(q) ||
        (c.profile.email ?? "").toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">{t("subtitle")}</p>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border border-black/10 bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loaded ? (
        <PawLoader />
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">{t("noResults")}</p>
      ) : (
        <div className="mt-6 divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
          {filtered.map((c) => (
            <button
              key={c.profile.id}
              type="button"
              onClick={() => setViewing(c)}
              className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-brand-700">
                  {c.profile.avatar_url ? (
                    <img src={c.profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4.5 w-4.5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{c.profile.full_name ?? t("unnamed")}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{c.profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-muted">
                  {c.lastAppointmentAt
                    ? t("lastVisit", { date: formatDate(c.lastAppointmentAt) })
                    : t("noVisitsYet")}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    c.active ? "bg-brand-50 text-brand-700" : "bg-accent-50 text-accent-700"
                  }`}
                >
                  {c.active ? t("statusActive") : t("statusInactive")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {viewing && <CustomerProfileModal customer={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
