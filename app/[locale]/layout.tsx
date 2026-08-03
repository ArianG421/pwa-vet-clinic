import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "@fontsource-variable/figtree";
import "../globals.css";
import { site } from "@/lib/site";
import { routing } from "@/lib/i18n/routing";
import { RegisterServiceWorker } from "@/components/register-sw";
import { PawClickEffect } from "@/components/paw-click-effect";
import { ScrollToTop } from "@/components/scroll-to-top";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Book, manage & care for your pet`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: site.shortName,
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1f7a69",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <ScrollToTop />
        <PawClickEffect />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
