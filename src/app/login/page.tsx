import { LoginForm } from "@/components/LoginForm";
import { PageHeader } from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <PageHeader
        title="Log in"
        description="Use your password or a one-time code sent to your email. Session lasts 6 hours."
      />
      <LoginForm />
    </div>
  );
}
