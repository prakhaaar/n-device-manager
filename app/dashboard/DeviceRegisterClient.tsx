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
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("deviceId", id);
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
    async function register() {
      const deviceId = getOrCreateDeviceId();
      setCurrentDeviceId(deviceId);

      const res = await fetch("/api/device/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      const data = await res.json();

      if (data.exceeded || data.error === "DEVICE_LIMIT_REACHED") {
        setLimitDevices(data.devices);
        return; // stop here, do NOT validate
      }

      // registration successful
      onRegistered?.();
    }

    register();
  }, []);

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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ deviceId: d.deviceId }),
                  });

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
          onClick={() => (window.location.href = "/logged-out")}
        >
          Cancel Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}
