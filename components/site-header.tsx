"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, PawPrint, Stethoscope, HeartHandshake, Info, Mail, X, type LucideIcon } from "lucide-react";
import { nav, site } from "@/lib/site";

const NAV_ICONS: Record<string, LucideIcon> = {
  "/services": Stethoscope,
  "/pricing": HeartHandshake,
  "/about": Info,
  "/contact": Mail,
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="text-base sm:text-lg">{site.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const Icon = NAV_ICONS[item.href];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-brand-50 text-brand-700" : "text-ink-muted hover:bg-surface-muted hover:text-brand-700"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-ink-muted transition-colors hover:text-brand-700">
            Client Login
          </Link>
          <Link
            href="/portal/appointments"
            className="cta-bounce rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
          >
            Book a visit
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-surface px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2" aria-label="Primary">
            {nav.map((item) => {
              const Icon = NAV_ICONS[item.href];
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-surface-muted"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-muted"
              onClick={() => setOpen(false)}
            >
              Client Login
            </Link>
            <Link
              href="/portal/appointments"
              className="mt-1 rounded-full bg-accent-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Book a visit
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
