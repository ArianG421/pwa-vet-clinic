"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

// Real public posts, not fabricated — both official, no-API-key embed
// mechanisms Instagram/Facebook provide for exactly this use case. Script
// injection is guarded so client-side navigation back to this page doesn't
// load either SDK twice.
const INSTAGRAM_POST_URL = "https://www.instagram.com/oresunds_vet_vellinge/p/DZpGIWOO9dL/";

function useExternalScript(src: string, id: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, [src, id]);
}

function InstagramPreview() {
  const ref = useRef<HTMLQuoteElement>(null);
  useExternalScript("https://www.instagram.com/embed.js", "ig-embed-script");

  useEffect(() => {
    const win = window as unknown as { instgrm?: { Embeds: { process: () => void } } };
    const id = window.setInterval(() => {
      if (win.instgrm) {
        win.instgrm.Embeds.process();
        window.clearInterval(id);
      }
    }, 300);
    return () => window.clearInterval(id);
  }, []);

  return (
    <blockquote
      ref={ref}
      className="instagram-media"
      data-instgrm-permalink={INSTAGRAM_POST_URL}
      data-instgrm-version="14"
      style={{ margin: 0, width: "100%", minWidth: "unset" }}
    />
  );
}

function FacebookPreview() {
  useExternalScript("https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0", "fb-embed-script");

  useEffect(() => {
    if (!document.getElementById("fb-root")) {
      const root = document.createElement("div");
      root.id = "fb-root";
      document.body.prepend(root);
    }
    const win = window as unknown as { FB?: { XFBML: { parse: () => void } } };
    const id = window.setInterval(() => {
      if (win.FB) {
        win.FB.XFBML.parse();
        window.clearInterval(id);
      }
    }, 300);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="fb-page"
      data-href={site.social.facebook}
      data-tabs="timeline"
      data-width="330"
      data-height="340"
      data-small-header="true"
      data-adapt-container-width="true"
      data-hide-cover="false"
      data-show-facepile="false"
    />
  );
}

export function SocialPreviews() {
  const t = useTranslations("footer");

  return (
    <div>
      <p className="text-sm font-semibold text-ink">{t("latestFromSocial")}</p>
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2">
        <div className="relative min-w-0 overflow-hidden rounded-xl border border-black/5 bg-surface">
          <InstagramPreview />
        </div>
        <div className="relative min-w-0 overflow-hidden rounded-xl border border-black/5 bg-surface">
          <FacebookPreview />
        </div>
      </div>
    </div>
  );
}
