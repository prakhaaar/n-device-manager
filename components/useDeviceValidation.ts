// components/useDeviceValidation.ts
"use client";

import { useEffect } from "react";

export function useDeviceValidation(deviceRegistered: boolean) {
  useEffect(() => {
    if (!deviceRegistered) return;

    let active = true;

    async function validate() {
      if (!active) return;

      const deviceId = localStorage.getItem("deviceId");
      if (!deviceId) return;

      try {
        const res = await fetch("/api/device/validate", {
          headers: {
            "x-device-id": deviceId,
          },
        });

        if (res.status === 401) {
          const data = await res.json();

          if (data.reason === "FORCED_LOGOUT") {
            window.location.href = "/logged-out?forced=1";
            return;
          }

          window.location.href = "/logged-out";
        }
      } catch (err) {
        console.error("VALIDATION ERROR:", err);
      }
    }

    // ⚠️ KEY FIX: Wait 2 seconds before first validation
    // This prevents validation from running during Auth0 callback
    const initialTimeout = setTimeout(validate, 2000);

    // Poll every 12 seconds after that
    const interval = setInterval(validate, 12000);

    return () => {
      active = false;
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [deviceRegistered]);
}
