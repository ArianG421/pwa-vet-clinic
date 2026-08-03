"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, PawPrint, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/portal";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("This demo's backend isn't connected yet — check back shortly.");
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
            <p className="mt-3 text-lg font-semibold text-ink">Check your email</p>
            <p className="mt-2 text-sm text-ink-muted">
              We sent a sign-in link to <span className="font-medium text-ink">{email}</span>.
              Click it to finish signing in — this tab will pick it up automatically.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-ink">Sign in</h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Enter your email and we'll send you a magic link — no password to remember.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
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
                Send magic link
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        <Link href="/" className="hover:text-brand-700">← Back to the site</Link>
      </p>
    </div>
  );
}
