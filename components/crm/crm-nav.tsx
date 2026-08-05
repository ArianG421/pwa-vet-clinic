"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Users, Target, DollarSign, ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";

const CRM_NAV = [
  { href: "/crm", key: "dashboard", icon: LayoutDashboard },
  { href: "/crm/customers", key: "customers", icon: Users },
  { href: "/crm/leads", key: "leads", icon: Target },
  { href: "/crm/pricing", key: "pricing", icon: DollarSign },
] as const;

export function CrmNav() {
  const pathname = usePathname();
  const t = useTranslations("crm.nav");
  const tCommon = useTranslations("common");

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/crm" className="flex items-center gap-2 font-semibold text-ink">
          <img src="/images/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
          <span className="text-base sm:text-lg">{site.shortName} {t("crmSuffix")}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Staff CRM">
          {CRM_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-brand-50 text-brand-700" : "text-ink-muted hover:bg-surface-muted hover:text-brand-700"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-700">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">{tCommon("backToSite")}</span>
        </Link>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-black/5 px-3 py-2 lg:hidden" aria-label="Staff CRM">
        {CRM_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active ? "bg-brand-50 text-brand-700" : "text-ink-muted hover:bg-surface-muted"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
