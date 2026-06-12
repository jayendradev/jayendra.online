import { PageHeader } from "@/components/PageHeader";
import { RegisterForm } from "@/components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <PageHeader
        title="Create account"
        description="Register to send a project message and get a reply from Jayendra."
      />
      <RegisterForm />
    </div>
  );
}
