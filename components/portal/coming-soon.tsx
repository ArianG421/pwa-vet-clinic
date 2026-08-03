import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
  bullets,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-ink-muted">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {b}
          </li>
        ))}
      </ul>
      <Link href="/portal/rewards" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
        <ArrowLeft className="h-4 w-4" /> Check out Rewards, which is live in this preview
      </Link>
    </div>
  );
}
