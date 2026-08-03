import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { serviceCategories } from "@/lib/data/services";
import { CategoryIcon } from "@/components/category-icon";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our veterinary services, from preventive care to surgery and emergency treatment.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Services</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
          Complete veterinary care, organized so it's easy to find
        </h1>
        <p className="mt-4 text-ink-muted">
          Every category below links to the treatments we offer, typical pricing, and estimated
          visit length — so you know what to expect before you book.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/services/${cat.slug}`}
            className="group flex flex-col rounded-2xl border border-black/5 bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <CategoryIcon name={cat.icon} className="h-6 w-6" />
            </span>
            <p className="mt-4 text-base font-semibold text-ink">{cat.name}</p>
            <p className="mt-1.5 flex-1 text-sm text-ink-muted">{cat.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:text-brand-800">
              {cat.services.length} treatments <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
