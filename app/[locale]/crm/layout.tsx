import { Info } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import { CrmNav } from "@/components/crm/crm-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function CrmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let user = null;

  // proxy.ts already redirects non-staff away from /crm before this layout
  // ever renders — this is a defense-in-depth check, not the primary gate.
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "staff") redirect({ href: "/portal", locale });
    } else {
      redirect({ href: { pathname: "/login", query: { redirect: "/crm" } }, locale });
    }
  }

  const t = await getTranslations("crm.layout");

  return (
    <>
      <CrmNav />
      <div className="flex flex-wrap items-center justify-between gap-2 bg-ink px-4 py-2 text-xs text-white/80 sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          {t("staffTools")}
        </span>
        {user && (
          <span className="flex items-center gap-3">
            <span className="text-white/60">{user.email}</span>
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
