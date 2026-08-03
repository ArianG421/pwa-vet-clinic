import type { Metadata, Viewport } from "next";
import "@fontsource-variable/figtree";
import "./globals.css";
import { site } from "@/lib/site";
import { RegisterServiceWorker } from "@/components/register-sw";
import { PawClickEffect } from "@/components/paw-click-effect";
import { ScrollToTop } from "@/components/scroll-to-top";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <ScrollToTop />
        <PawClickEffect />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
