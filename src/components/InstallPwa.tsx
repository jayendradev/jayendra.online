"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS standalone
    window.navigator.standalone === true
  );
}

export function InstallPwa() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const dismissedBefore =
      localStorage.getItem("pwa-install-dismissed") === "1";
    if (dismissedBefore) return;

    if (isIOS()) {
      const id = window.setTimeout(() => setShowIosHint(true), 0);
      return () => window.clearTimeout(id);
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setShowIosHint(false);
      setDeferred(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  function dismiss() {
    setDismissed(true);
    setDeferred(null);
    setShowIosHint(false);
    localStorage.setItem("pwa-install-dismissed", "1");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  if (dismissed || isStandalone()) return null;
  if (!deferred && !showIosHint) return null;

  return (
    <div
      role="region"
      aria-label="Install app"
      className="fixed bottom-4 left-4 right-20 z-40 mx-auto max-w-md rounded-xl border border-border bg-surface p-4 shadow-lg sm:left-auto sm:right-24"
    >
      <p className="text-sm font-medium text-foreground">Install jayendra.online</p>
      {showIosHint ? (
        <p className="mt-1 text-xs text-muted">
          Tap <strong className="text-foreground">Share</strong> →{" "}
          <strong className="text-foreground">Add to Home Screen</strong> (Safari).
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted">
          Add to your home screen for quick access (Android / Chrome).
        </p>
      )}
      <div className="mt-3 flex gap-2">
        {!showIosHint ? (
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
          >
            Install
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
