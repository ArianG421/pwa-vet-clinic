import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { PawLoader } from "@/components/paw-loader";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Willowbrook Veterinary Clinic account with a magic link.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<PawLoader />}>
      <LoginForm />
    </Suspense>
  );
}
