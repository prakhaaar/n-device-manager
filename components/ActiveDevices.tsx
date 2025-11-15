"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, LogOut } from "lucide-react";

interface DeviceEntry {
  deviceId: string;
  ua: string;
  ip: string;
  ts: string;
}

export default function ActiveDevices() {
  const [devices, setDevices] = useState<DeviceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const MAX_DEVICES = 3;

  async function fetchDevices() {
    try {
      const res = await fetch("/api/device/list");
      const data = await res.json();

      setDevices(data.devices || []);
    } catch (err) {
      console.error("Failed to load devices:", err);
    } finally {
      setLoading(false);
    }
  }

  async function forceLogout(deviceId: string) {
    try {
      await fetch("/api/device/force-logout", {
        method: "POST",
        body: JSON.stringify({ deviceId }),
        headers: { "Content-Type": "application/json" },
      });

      fetchDevices(); // refresh list
    } catch (err) {
      console.error("Force logout failed:", err);
    }
  }

  useEffect(() => {
    fetchDevices();
  }, []);

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
    <Card className="lg:col-span-1 p-6">
      <div className="mb-6 flex items-center gap-2">
        <Smartphone className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Active Sessions
        </h2>
      </div>

      <div className="space-y-4">
        {devices.map((device) => {
          const isCurrent = device.deviceId === currentDeviceId;

          return (
            <div
              key={device.deviceId}
              className="rounded-lg border border-border bg-background p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {device.ua.split("(")[0].trim() || "Unknown Device"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {isCurrent
                      ? "Active now"
                      : "Last seen: " + new Date(device.ts).toLocaleString()}
                  </p>
                </div>

                {isCurrent && (
                  <Badge variant="default" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>

              {!isCurrent && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2 w-full flex gap-2"
                  onClick={() => forceLogout(device.deviceId)}
                >
                  <LogOut className="h-4 w-4" />
                  Force Logout
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-primary/5 p-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {devices.length}/{MAX_DEVICES}
          </span>{" "}
          devices active
        </p>

        {devices.length >= MAX_DEVICES && (
          <p className="mt-1 text-xs text-red-600">
            Maximum device limit reached
          </p>
        )}
      </div>
    </Card>
  );
}
