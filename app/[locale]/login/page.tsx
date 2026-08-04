import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/login-form";
import { PawLoader } from "@/components/paw-loader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return { title: t("title"), description: t("subtitle") };
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PawLoader />}>
      <LoginForm />
    </Suspense>
  );
}
