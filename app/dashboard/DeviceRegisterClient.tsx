"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function getOrCreateDeviceId() {
  if (typeof window === "undefined") return null;

  const id = localStorage.getItem("deviceId");

  // ❌ If forced-logged-out, DO NOT recreate a new device ID
  if (id === "FORCED_LOGGED_OUT") return null;

  if (!id) {
    const newId = crypto.randomUUID();
    localStorage.setItem("deviceId", newId);
    return newId;
  }

  return id;
}

export default function DeviceRegisterClient({
  onRegistered,
}: {
  onRegistered?: () => void;
}) {
  const [limitDevices, setLimitDevices] = useState<any[] | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // 🛑 1. Do NOT register on /logged-out page
    if (window.location.pathname.includes("logged-out")) return;

    // 🛑 2. Do NOT run if already registered once in this session
    if (sessionStorage.getItem("deviceRegisteredOnce") === "true") return;

    async function register() {
      // Get or create deviceId
      const deviceId = getOrCreateDeviceId();

      // 🛑 If deviceId is null → means forced-logout happened → do NOT register
      if (!deviceId) return;

      setCurrentDeviceId(deviceId);

      const res = await fetch("/api/device/register", {
        method: "POST",
        credentials: "include", // ✔ IMPORTANT FIX
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      const data = await res.json();

      // If limit reached, show modal
      if (data.exceeded || data.error === "DEVICE_LIMIT_REACHED") {
        setLimitDevices(data.devices);
        return;
      }

      // If server says device already exists → don’t re-register
      if (data.alreadyExists === true) {
        sessionStorage.setItem("deviceRegisteredOnce", "true");
        onRegistered?.();
        return;
      }

      // Successful registration
      sessionStorage.setItem("deviceRegisteredOnce", "true");
      onRegistered?.();
    }

    // Wait until session is ready, not arbitrary delay
    async function waitForSession() {
      for (let i = 0; i < 10; i++) {
        const me = await fetch("/api/auth/me", { credentials: "include" });
        if (me.ok) return true;
        await new Promise((r) => setTimeout(r, 200));
      }
      return false;
    }

    // Run registration AFTER Auth0 session is stable
    (async () => {
      const ok = await waitForSession();
      if (ok) register();
    })();
  }, [onRegistered]);

  // UI
  if (!limitDevices) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Device Limit Reached
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mt-1">
          You already have <b>{limitDevices.length}</b> active devices (Max = 3)
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Logout another device to continue.
        </p>

        <div className="mt-4 space-y-3 max-h-[260px] overflow-y-auto">
          {limitDevices.map((d: any) => (
            <div
              key={d.deviceId}
              className="p-3 border rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100"
            >
              <div>
                <p className="font-semibold text-sm">
                  {d.label || "Unnamed Device"}
                </p>
                <p className="text-xs text-gray-500">
                  {d.ua?.substring(0, 50)}...
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(d.ts).toLocaleString()}
                </p>
              </div>

              <Button
                disabled={processing || d.deviceId === currentDeviceId}
                onClick={async () => {
                  setProcessing(true);

                  await fetch("/api/device/force-logout", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ deviceId: d.deviceId }),
                  });

                  // Mark that device must NOT auto-register again
                  localStorage.setItem("deviceId", "FORCED_LOGGED_OUT");

                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={() => {
            // Mark forced logout
            localStorage.setItem("deviceId", "FORCED_LOGGED_OUT");
            window.location.href = "/logged-out";
          }}
        >
          Cancel Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}
