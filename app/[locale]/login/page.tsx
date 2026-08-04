import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import { LoginForm } from "@/components/login-form";
import { PawLoader } from "@/components/paw-loader";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { locale } = await params;
  const { redirect: redirectTo } = await searchParams;

  // A persistent session means "logged in", full stop — landing back on the
  // login form despite that (e.g. tapping "Client Login" from the marketing
  // nav again) is exactly the bug being reported, not a cookie problem.
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect({ href: redirectTo || "/portal", locale });
    }
  }

  return (
    <Suspense fallback={<PawLoader />}>
      <LoginForm />
    </Suspense>
  );
}
