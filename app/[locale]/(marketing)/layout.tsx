import { getLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteAssistant } from "@/components/site-assistant";
import { getAssistantIndex } from "@/lib/data/assistant-index";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const assistantIndex = await getAssistantIndex(locale);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter />
      <SiteAssistant index={assistantIndex} />
    </>
  );
}
