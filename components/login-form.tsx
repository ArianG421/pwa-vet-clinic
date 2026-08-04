"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Mail, PawPrint, Loader2, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/portal";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError(t("notConfigured"));
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  // Tapping the emailed link from Gmail/Mail/etc. always opens a regular
  // browser tab, never the installed PWA (Android sometimes offers a choice;
  // iOS never does) — and on iOS that browser tab is a separate storage
  // context from the installed app anyway, so the session wouldn't carry
  // over even then. Verifying the code client-side, inside the app the user
  // already has open, sidesteps the whole "which app opens the link"
  // problem entirely.
  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setCodeError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });

    if (verifyError) {
      setCodeError(t("invalidCode"));
      setVerifying(false);
      return;
    }

    window.location.href = redirect;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-0px)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Link href="/" className="mx-auto flex items-center gap-2 font-semibold text-ink">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
          <PawPrint className="h-5 w-5" />
        </span>
      </Link>

      <div className="mt-8 rounded-3xl border border-black/5 bg-surface p-8 shadow-sm">
        {status === "sent" ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-9 w-9 text-brand-600" />
            <p className="mt-3 text-lg font-semibold text-ink">{t("checkEmailTitle")}</p>
            <p className="mt-2 text-sm text-ink-muted">
              {t.rich("checkEmailBody", {
                email,
                bold: (chunks) => <span className="font-medium text-ink">{chunks}</span>,
              })}
            </p>

            <div className="mt-6 border-t border-black/5 pt-6 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{t("orEnterCode")}</p>
              <form onSubmit={handleVerifyCode} className="mt-3 space-y-3">
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t("codeLabel")}
                    aria-label={t("codeLabel")}
                    className="w-full rounded-xl border border-black/10 bg-surface py-2.5 pl-10 pr-4 text-center text-sm tracking-[0.3em] text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </div>

                {codeError && (
                  <p className="flex items-start gap-1.5 text-sm text-red-600">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {codeError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={verifying || !code}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
                >
                  {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
                  {verifying ? t("verifying") : t("verifyCode")}
                </button>
              </form>
            </div>

            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              {t("useDifferentEmail")}
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-ink">{t("title")}</h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              {t("subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-ink">{t("email")}</label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-black/10 bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </div>
              </div>

              {error && (
                <p className="flex items-start gap-1.5 text-sm text-red-600">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
              >
                {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("sendLink")}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        <Link href="/" className="hover:text-brand-700">{t("backToSite")}</Link>
      </p>
    </div>
  );
}
