"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Mail, X } from "lucide-react";
import type { Lead } from "@/hooks/use-crm-leads";
import { getEmailTemplates, applyTemplate } from "@/lib/data/crm";

export function ComposeEmailModal({
  lead,
  onSend,
  onClose,
}: {
  lead: Lead;
  onSend: (subject: string, body: string) => Promise<{ error: string | null }>;
  onClose: () => void;
}) {
  const t = useTranslations("crm.compose");
  const templates = getEmailTemplates((key) => t(`templates.${key}`));
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function applyTemplateChoice(templateId: string) {
    const template = templates.find((tpl) => tpl.id === templateId);
    if (!template) return;
    setSubject(template.subject);
    setBody(applyTemplate(template.body, lead.name));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const result = await onSend(subject, body);
    setSending(false);
    if (result.error) setError(result.error);
    else setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t("title")}</h2>
          <button type="button" onClick={onClose} aria-label={t("close")} className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-surface-muted p-4">
          <p className="text-sm font-semibold text-ink">{lead.name}</p>
          <p className="text-xs text-ink-muted">{lead.email}</p>
        </div>

        {sent ? (
          <div className="mt-6 text-center">
            <Mail className="mx-auto h-9 w-9 text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-ink">{t("sentTitle")}</p>
            <p className="mt-1 text-xs text-ink-muted">{t("sentBody", { email: lead.email })}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              {t("done")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">{t("template")}</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplateChoice(template.id)}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-brand-500 hover:text-brand-700"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="text-sm font-medium text-ink">{t("subject")}</label>
              <input
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
            </div>

            <div>
              <label htmlFor="body" className="text-sm font-medium text-ink">{t("body")}</label>
              <textarea
                id="body"
                required
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {sending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("send")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
