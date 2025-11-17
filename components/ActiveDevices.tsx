"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, LogOut } from "lucide-react";

interface DeviceEntry {
  deviceId: string;
  ua: string;
  ip: string;
  ts: string;
  label?: string | null;
}

export default function ActiveDevices() {
  const [devices, setDevices] = useState<DeviceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>(
    {}
  );
  const pollRef = useRef<number | null>(null);
  const MAX_DEVICES = 3;

  // Fetch devices from the server and update state.
  async function fetchDevices() {
    try {
      const res = await fetch("/api/device/list", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        // If unauthorized, treat as empty & bail out
        if (res.status === 401) {
          // If the user is not authenticated, redirect to login (safe fallback)
          window.location.href = "/auth/login";
          return;
        }
        console.error("Failed to fetch devices, status:", res.status);
        return;
      }

      const data = await res.json().catch(() => ({}));
      const list: DeviceEntry[] = Array.isArray(data.devices)
        ? data.devices
        : [];

      setDevices(list);

      // If current device is missing from the returned list -> we were force-logged-out
      const currentDeviceId =
        typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
      if (
        currentDeviceId &&
        !list.some((d) => d.deviceId === currentDeviceId)
      ) {
        // Clean up local device id and redirect to logged-out
        try {
          localStorage.removeItem("deviceId");
        } catch {}
        window.location.href = "/logged-out?forced=1";
        return;
      }
    } catch (err) {
      console.error("Failed to load devices:", err);
    } finally {
      setLoading(false);
    }
  }

  // Force-logout a device. If we removed the current device, redirect immediately.
  async function forceLogout(deviceId: string) {
    try {
      // mark processing for this device
      setProcessingIds((s) => ({ ...s, [deviceId]: true }));

      const res = await fetch("/api/device/force-logout", {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({ deviceId }),
        headers: { "Content-Type": "application/json" },
      });

      // if unauthorized, send to login
      if (res.status === 401) {
        window.location.href = "/auth/login";
        return;
      }

      // If you forced logout your own device — redirect immediately
      const currentId =
        typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
      if (currentId === deviceId) {
        // remove the device id locally (safety) and redirect
        try {
          localStorage.removeItem("deviceId");
        } catch {}
        window.location.href = "/logged-out?forced=1";
        return;
      }

      // Otherwise refresh the list
      await fetchDevices();
    } catch (err) {
      console.error("Force logout failed:", err);
    } finally {
      setProcessingIds((s) => {
        const next = { ...s };
        delete next[deviceId];
        return next;
      });
    }
  }

  useEffect(() => {
    // initial fetch
    fetchDevices();

    // poll every 12s to keep device list fresh and detect remote force-logout
    pollRef.current = window.setInterval(() => {
      fetchDevices();
    }, 12000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading active devices...</p>
      </Card>
    );
  }

  const currentDeviceId =
    typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;

  return (
    <Card
      className="
      lg:col-span-1 p-6 rounded-2xl 
      bg-white/30 dark:bg-white/10 
      backdrop-blur-xl 
      border border-white/20 dark:border-white/10 
      shadow-[0_8px_32px_rgba(31,38,135,0.15)]
      transition-all duration-300
      hover:bg-white/40 hover:shadow-[0_10px_40px_rgba(31,38,135,0.25)]
    "
    >
      <div className="mb-6 flex items-center gap-2">
        <Smartphone className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Active Sessions
        </h2>
      </div>

      <div className="space-y-4">
        {devices.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No active devices.
          </div>
        )}

        {devices.map((device) => {
          const isCurrent = device.deviceId === currentDeviceId;
          const processing = !!processingIds[device.deviceId];

          return (
            <div
              key={device.deviceId}
              className="
                rounded-xl p-4 
                bg-white/20 dark:bg-white/5 
                backdrop-blur-lg 
                border border-white/20 dark:border-white/10
                shadow-sm transition-all duration-300
                hover:shadow-lg hover:bg-white/30
              "
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {device.ua
                      ? device.ua.split("(")[0].trim()
                      : "Unknown Device"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {isCurrent
                      ? "Active now"
                      : "Last seen: " + new Date(device.ts).toLocaleString()}
                  </p>
                </div>

                {isCurrent && (
                  <Badge
                    variant="default"
                    className="
                        text-xs bg-primary/20 text-primary 
                        border border-primary/30 
                        backdrop-blur-md
                      "
                  >
                    Current
                  </Badge>
                )}
              </div>

              {!isCurrent && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="
                    mt-2 w-full flex gap-2 
                    rounded-lg 
                    bg-red-500/80 hover:bg-red-600 
                    text-white shadow 
                    backdrop-blur-xl
                  "
                  onClick={() => forceLogout(device.deviceId)}
                  disabled={processing}
                >
                  <LogOut className="h-4 w-4" />
                  {processing ? "Logging out..." : "Force Logout"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div
        className="
        mt-6 rounded-xl p-4 
        bg-primary/10 dark:bg-primary/20 
        backdrop-blur-lg 
        border border-primary/20 
      "
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {devices.length}/{MAX_DEVICES}
          </span>{" "}
          devices active
        </p>

        {devices.length >= MAX_DEVICES && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            Maximum device limit reached
          </p>
        )}
      </div>
    </Card>
  );
}
