import { Check } from "lucide-react";
import type { ServiceRichContent } from "@/lib/data/services";

export function ServiceRichContentBlock({ content }: { content: ServiceRichContent }) {
  return (
    <div className="max-w-3xl">
      <p className="text-ink-muted leading-relaxed">{content.intro}</p>

      <div className="mt-8 space-y-8">
        {content.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
            {section.body && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{section.body}</p>}
            {section.bullets && (
              <ul className="mt-3 space-y-2.5">
                {section.bullets.map((bullet) => (
                  <li key={bullet.label} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span className="text-ink-muted">
                      <span className="font-medium text-ink">{bullet.label}</span>
                      {bullet.detail ? <>{" — "}{bullet.detail}</> : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
