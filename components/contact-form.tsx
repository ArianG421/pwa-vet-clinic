"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Please fill in every field.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong sending your message. Please try again or call us.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand-600" />
        <p className="font-semibold text-ink">Message sent</p>
        <p className="text-sm text-ink-muted">We'll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-ink">Your name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </button>
    </form>
  );
}
