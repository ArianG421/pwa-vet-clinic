"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, MoreVertical, PawPrint, Share, X } from "lucide-react";
import { site } from "@/lib/site";

const DISMISS_KEY = "willowbrook-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !("MSStream" in window);
}

// Firefox (desktop and Android) never fires `beforeinstallprompt` — it has
// no programmatic install API, so it needs the same manual-instructions
// treatment as iOS Safari instead of waiting for an event that won't come.
function isFirefox() {
  if (typeof navigator === "undefined") return false;
  return /firefox|fxios/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

type ManualInstructions = "ios" | "firefox" | null;

export function InstallPrompt() {
  const t = useTranslations("install");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [manual, setManual] = useState<ManualInstructions>(null);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    if (isIOS()) {
      setManual("ios");
      setVisible(true);
      return;
    }

    // Neither Firefox for Android nor desktop Firefox support
    // `beforeinstallprompt`, so fall straight to manual instructions instead
    // of showing nothing while waiting for an event that will never fire.
    if (isFirefox()) {
      setManual("firefox");
      setVisible(true);
      return;
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function onInstalled() {
      setJustInstalled(true);
      setDeferredPrompt(null);
      window.setTimeout(() => setVisible(false), 4000);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === "accepted") {
      setJustInstalled(true);
      window.setTimeout(() => setVisible(false), 4000);
    } else {
      setVisible(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("title", { shortName: site.shortName })}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:justify-start sm:pl-6"
    >
      <div className="flex w-full max-w-sm items-start gap-3 rounded-2xl border border-black/5 bg-surface p-4 shadow-2xl shadow-black/20">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <PawPrint className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          {justInstalled ? (
            <>
              <p className="text-sm font-semibold text-ink">{t("installedTitle")}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{t("installedBody")}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-ink">{t("title", { shortName: site.shortName })}</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {manual === "ios" ? t("iosBody") : manual === "firefox" ? t("firefoxBody") : t("body")}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {manual === "ios" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                    <Share className="h-3.5 w-3.5" />
                  </span>
                ) : manual === "firefox" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleInstall}
                    className="cta-bounce inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-600"
                  >
                    <Download className="h-3.5 w-3.5" /> {t("installButton")}
                  </button>
                )}
                <button type="button" onClick={dismiss} className="text-xs font-medium text-ink-muted hover:text-ink">
                  {t("notNow")}
                </button>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismissAria")}
          className="shrink-0 text-ink-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
