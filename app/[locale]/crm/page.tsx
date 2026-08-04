"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { ArrowRight, Target, UserCheck, UserX, Mail } from "lucide-react";
import { useCrmCustomers } from "@/hooks/use-crm-customers";
import { useCrmLeads } from "@/hooks/use-crm-leads";
import { PawLoader } from "@/components/paw-loader";

export default function CrmDashboard() {
  const t = useTranslations("crm.dashboard");
  const { customers, loaded: customersLoaded } = useCrmCustomers();
  const { leads, loaded: leadsLoaded } = useCrmLeads();

  const activeCount = customers?.filter((c) => c.active).length ?? 0;
  const inactiveCount = customers?.filter((c) => !c.active).length ?? 0;
  const customerLeadCount = leads?.filter((l) => l.source === "customer").length ?? 0;
  const inquiryLeadCount = leads?.filter((l) => l.source === "inquiry").length ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">{t("subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <UserCheck className="h-5 w-5" />
          </span>
          {customersLoaded ? (
            <p className="mt-3 text-2xl font-bold text-ink">{activeCount}</p>
          ) : (
            <div className="mt-3"><PawLoader size="sm" label="" /></div>
          )}
          <p className="text-xs text-ink-muted">{t("activeCustomers")}</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
            <UserX className="h-5 w-5" />
          </span>
          {customersLoaded ? (
            <p className="mt-3 text-2xl font-bold text-ink">{inactiveCount}</p>
          ) : (
            <div className="mt-3"><PawLoader size="sm" label="" /></div>
          )}
          <p className="text-xs text-ink-muted">{t("inactiveCustomers")}</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Target className="h-5 w-5" />
          </span>
          {leadsLoaded ? (
            <p className="mt-3 text-2xl font-bold text-ink">{customerLeadCount}</p>
          ) : (
            <div className="mt-3"><PawLoader size="sm" label="" /></div>
          )}
          <p className="text-xs text-ink-muted">{t("winBackLeads")}</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
            <Mail className="h-5 w-5" />
          </span>
          {leadsLoaded ? (
            <p className="mt-3 text-2xl font-bold text-ink">{inquiryLeadCount}</p>
          ) : (
            <div className="mt-3"><PawLoader size="sm" label="" /></div>
          )}
          <p className="text-xs text-ink-muted">{t("newInquiries")}</p>
        </div>
      </div>

      <Link
        href="/crm/leads"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        {t("workLeads")} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
