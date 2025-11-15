// app/api/device/list/route.ts
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.sub;
    const key = `devices:${userId}`;

    const raw = await redis.hgetall(key);
    console.log("Raw hgetall response:", raw);

    const devicesMap = new Map<string, any>();

    if (raw && typeof raw === "object") {
      for (const [deviceId, jsonString] of Object.entries(raw)) {
        try {
          if (typeof jsonString === "string") {
            const parsed = JSON.parse(jsonString);
            if (parsed?.deviceId) {
              devicesMap.set(parsed.deviceId, parsed);
            } else {
              // fall back to key name if field lacks deviceId
              devicesMap.set(deviceId, parsed);
            }
          } else {
            devicesMap.set(deviceId, jsonString);
          }
        } catch (err) {
          console.error(`Failed to parse device ${deviceId}:`, err);
        }
      }
    }

    const devices = Array.from(devicesMap.values());

    console.log("Parsed devices count:", devices.length);
    console.log("Devices:", devices);

    return NextResponse.json({
      devices,
      count: devices.length,
    });
  } catch (error) {
    console.error("DEVICE LIST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices" },
      { status: 500 }
    );
  }
}
