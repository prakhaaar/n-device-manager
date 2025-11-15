"use client";

import { useEffect } from "react";

export function useDeviceValidation(deviceRegistered: boolean) {
  useEffect(() => {
    if (!deviceRegistered) return;

    async function validate() {
      const deviceId = localStorage.getItem("deviceId");
      if (!deviceId) return;

      const res = await fetch("/api/device/validate", {
        headers: {
          "x-device-id": deviceId,
        },
      });

      if (res.status === 401) {
        const data = await res.json();

        if (data.reason === "FORCED_LOGOUT") {
          window.location.href = "/logged-out?forced=1";
        } else {
          window.location.href = "/logged-out";
        }
      }
    }

    validate();
  }, [deviceRegistered]);
}
