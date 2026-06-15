"use client";

import { useEffect } from "react";

export function RegisterPwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    async function refreshServiceWorker() {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));

      await navigator.serviceWorker.register("/sw-v4.js", { updateViaCache: "none" });
    }

    refreshServiceWorker().catch(() => {
      /* optional PWA — ignore registration errors */
    });
  }, []);

  return null;
}
