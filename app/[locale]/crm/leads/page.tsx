"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Mail, MessageSquare, UserX, XCircle } from "lucide-react";
import { useCrmLeads, type Lead } from "@/hooks/use-crm-leads";
import { PawLoader } from "@/components/paw-loader";
import { ComposeEmailModal } from "@/components/crm/compose-email-modal";
import { MessageModal } from "@/components/crm/message-modal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CrmLeadsPage() {
  const t = useTranslations("crm.leads");
  const { leads, loaded, error, setLeadStatus, sendEmail, emailsFor } = useCrmLeads();
  const [composing, setComposing] = useState<Lead | null>(null);
  const [viewingMessage, setViewingMessage] = useState<Lead | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  async function handleStatus(lead: Lead, status: "contacted" | "converted" | "dismissed") {
    const result = await setLeadStatus(lead, status);
    if (result.error) setStatusError(result.error);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">{t("subtitle")}</p>

      {(error || statusError) && <p className="mt-4 text-sm text-red-600">{error ?? statusError}</p>}

      {!loaded || !leads ? (
        <PawLoader />
      ) : leads.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-black/5 bg-surface p-8 text-center">
          <UserX className="mx-auto h-8 w-8 text-ink-muted" />
          <p className="mt-3 text-sm font-medium text-ink">{t("emptyTitle")}</p>
          <p className="mt-1 text-xs text-ink-muted">{t("emptyBody")}</p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
          {leads.map((lead) => {
            const history = emailsFor(lead);
            const lastEmail = history[0];
            return (
              <div key={`${lead.source}-${lead.id}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink">{lead.name}</p>
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                      {lead.source === "customer" ? t("sourceCustomer") : t("sourceInquiry")}
                    </span>
                    {lead.leadStatus === "contacted" && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                        {t("statusContacted")}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">{lead.email}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {lead.source === "customer" ? t("inactiveSince", { date: formatDate(lead.since) }) : t("inquiredOn", { date: formatDate(lead.since) })}
                  </p>
                  {lastEmail && (
                    <p className="mt-1 text-xs text-ink-muted">
                      {t("lastContacted", { date: formatDate(lastEmail.created_at) })}
                      {lastEmail.status === "failed" && <span className="text-red-600"> — {t("lastSendFailed")}</span>}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {lead.message && (
                    <button
                      type="button"
                      onClick={() => setViewingMessage(lead)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-xs font-semibold text-ink-muted hover:border-brand-500 hover:text-brand-700"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> {t("viewMessage")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setComposing(lead)}
                    disabled={!lead.email}
                    className="cta-bounce inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Mail className="h-3.5 w-3.5" /> {t("composeEmail")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(lead, "converted")}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-surface-muted hover:text-brand-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t("markConverted")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(lead, "dismissed")}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-surface-muted hover:text-ink"
                  >
                    <XCircle className="h-3.5 w-3.5" /> {t("dismiss")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {composing && (
        <ComposeEmailModal
          lead={composing}
          onClose={() => setComposing(null)}
          onSend={async (subject, body) => {
            const result = await sendEmail(composing, subject, body);
            if (!result.error) await handleStatus(composing, "contacted");
            return result;
          }}
        />
      )}

      {viewingMessage && <MessageModal lead={viewingMessage} onClose={() => setViewingMessage(null)} />}
    </div>
  );
}
