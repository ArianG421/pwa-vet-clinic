import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import enMessages from "../messages/en.json";

// The manifest is fetched once at install time regardless of which locale
// the user installs from, so it isn't locale-aware — English description
// is the reasonable default here.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: enMessages.site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f8fa",
    theme_color: "#34b7ea",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
