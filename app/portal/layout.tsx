import { Info } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortalNav />
      <div className="bg-accent-50 px-4 py-2 text-center text-xs text-accent-700 sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" /> Preview build — showing demo data. Account sign-in arrives in the next phase.
        </span>
      </div>
      <main id="main-content" className="flex-1 bg-surface-muted">
        {children}
      </main>
    </>
  );
}
