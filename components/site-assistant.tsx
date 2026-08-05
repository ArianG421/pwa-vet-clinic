"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { ArrowRight, Loader2, MessageCircleQuestion, Search, X } from "lucide-react";
import type { AssistantIndexEntry } from "@/lib/data/assistant-index";
import { searchIndex } from "@/lib/search";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  suggestion?: { path: string; label: string } | null;
};

export function SiteAssistant({ index }: { index: AssistantIndexEntry[] }) {
  const t = useTranslations("assistant");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"search" | "ask">("search");
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open && tab === "search") searchInputRef.current?.focus();
  }, [open, tab]);

  const results = searchIndex(index, query);

  async function sendMessage(text: string) {
    const nextChat: ChatMessage[] = [...chat, { role: "user", content: text }];
    setChat(nextChat);
    setChatInput("");
    setSending(true);
    setChatError(null);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: nextChat.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (json.configured === false) setNotConfigured(true);
        setChatError(json.error ?? t("chat.errorGeneric"));
        setSending(false);
        return;
      }

      setChat([
        ...nextChat,
        { role: "assistant", content: json.reply || "", suggestion: json.suggestion ?? null },
      ]);
    } catch {
      setChatError(t("chat.errorGeneric"));
    } finally {
      setSending(false);
    }
  }

  function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || sending) return;
    sendMessage(text);
  }

  function closeAndReset() {
    setOpen(false);
    setQuery("");
  }

  const examples = t.raw("chat.examples") as string[];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("trigger")}
        className="cta-bounce fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg shadow-black/20 hover:bg-brand-800"
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-black/5 p-4">
              <h2 className="text-base font-semibold text-ink">{t("panelTitle")}</h2>
              <button type="button" onClick={closeAndReset} aria-label={t("close")} className="text-ink-muted hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-black/5 px-4 pt-3">
              <button
                type="button"
                onClick={() => setTab("search")}
                className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-sm font-medium ${
                  tab === "search" ? "border-b-2 border-brand-600 text-brand-700" : "text-ink-muted hover:text-ink"
                }`}
              >
                <Search className="h-3.5 w-3.5" /> {t("tabs.quickLinks")}
              </button>
              <button
                type="button"
                onClick={() => setTab("ask")}
                className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-sm font-medium ${
                  tab === "ask" ? "border-b-2 border-brand-600 text-brand-700" : "text-ink-muted hover:text-ink"
                }`}
              >
                <MessageCircleQuestion className="h-3.5 w-3.5" /> {t("tabs.askAi")}
              </button>
            </div>

            {tab === "search" ? (
              <div className="flex min-h-0 flex-1 flex-col p-4">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className="w-full rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                />
                <div className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
                  {!query.trim() ? (
                    <p className="mt-4 text-center text-sm text-ink-muted">{t("search.prompt")}</p>
                  ) : results.length === 0 ? (
                    <p className="mt-4 text-center text-sm text-ink-muted">{t("search.noResults")}</p>
                  ) : (
                    results.map((entry) => (
                      <Link
                        key={entry.id}
                        href={entry.path}
                        onClick={closeAndReset}
                        className="block rounded-xl px-3 py-2.5 hover:bg-surface-muted"
                      >
                        <p className="text-sm font-medium text-ink">{entry.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{entry.description}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                  {chat.length === 0 ? (
                    <div>
                      <p className="text-sm font-semibold text-ink">{t("chat.emptyTitle")}</p>
                      <p className="mt-1 text-xs text-ink-muted">{t("chat.emptyBody")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {examples.map((example) => (
                          <button
                            key={example}
                            type="button"
                            onClick={() => sendMessage(example)}
                            disabled={notConfigured}
                            className="rounded-full border border-black/10 px-3 py-1.5 text-left text-xs font-medium text-ink-muted hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    chat.map((message, i) => (
                      <div key={i} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                            message.role === "user" ? "bg-brand-700 text-white" : "bg-surface-muted text-ink"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.suggestion && (
                            <Link
                              href={message.suggestion.path}
                              onClick={closeAndReset}
                              className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-600"
                            >
                              {t("chat.goTo", { label: message.suggestion.label })} <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {sending && (
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("chat.loading")}
                    </div>
                  )}
                  {(chatError || notConfigured) && (
                    <p className="text-xs text-red-600">{notConfigured ? t("chat.notConfigured") : chatError}</p>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="flex items-center gap-2 border-t border-black/5 p-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t("chat.placeholder")}
                    disabled={notConfigured}
                    className="w-full flex-1 rounded-xl border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || notConfigured || !chatInput.trim()}
                    className="shrink-0 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("chat.send")}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
