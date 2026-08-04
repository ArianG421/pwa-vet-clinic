import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = await getTranslations("breadcrumbs");

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted">
      <Link href="/" className="flex items-center gap-1 hover:text-brand-700">
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">{t("home")}</span>
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          {item.href && i !== items.length - 1 ? (
            <Link href={item.href} className="hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
