import { Info } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  let role: string | null = null;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      role = profile?.role ?? null;
    }
  }

  return (
    <>
      <PortalNav />
      <div className="flex flex-wrap items-center justify-between gap-2 bg-accent-50 px-4 py-2 text-xs text-accent-700 sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          {user
            ? "Live demo — pets, appointments, and membership are real. Rewards points sync once staff can mark visits complete."
            : "Preview build — sign in to manage real pets, appointments, and membership."}
        </span>
        {user && (
          <span className="flex items-center gap-3">
            <span className="text-ink-muted">{user.email}</span>
            {role && (
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  role === "staff" ? "bg-ink text-white" : "bg-brand-100 text-brand-700"
                }`}
              >
                {role}
              </span>
            )}
            <SignOutButton />
          </span>
        )}
      </div>
      <main id="main-content" className="flex-1 bg-surface-muted">
        {children}
      </main>
    </>
  );
}
