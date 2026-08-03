"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { LayoutDashboard, PawPrint, CalendarDays, Gift, CreditCard, ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";

const PORTAL_NAV = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/pets", label: "Pets", icon: PawPrint },
  { href: "/portal/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/portal/rewards", label: "Rewards", icon: Gift },
  { href: "/portal/subscription", label: "Membership", icon: CreditCard },
] as const;

export function PortalNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/portal" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="text-base sm:text-lg">{site.shortName} Portal</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Member portal">
          {PORTAL_NAV.map((item) => {
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-700">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to site</span>
        </Link>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-black/5 px-3 py-2 lg:hidden" aria-label="Member portal">
        {PORTAL_NAV.map((item) => {
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
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
