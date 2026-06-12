"use client";

import { AuthLoginPanel } from "@/components/AuthLoginPanel";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/messages";

  return (
    <AuthLoginPanel
      onLoggedIn={(user) => {
        router.push(user.role === "admin" ? "/admin" : next);
      }}
    />
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <LoginFormInner />
    </Suspense>
  );
}
