"use client";

import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const t = useTranslations("portal.layout");

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-700"
    >
      <LogOut className="h-4 w-4" /> {t("signOut")}
    </button>
  );
}
