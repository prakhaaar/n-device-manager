import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";

const MAX_DEVICES = 3;

export async function GET(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { valid: false, error: "NOT_AUTH" },
        { status: 401 }
      );
    }

    const userId = session.user.sub;
    const key = `devices:${userId}`;
    const deviceId = req.headers.get("x-device-id");

    if (!deviceId) {
      return NextResponse.json(
        { valid: false, error: "MISSING_DEVICE_ID" },
        { status: 400 }
      );
    }

    const raw = await redis.hgetall(key);
    const devices = Object.values(raw ?? {});
    const count = devices.length;

    // If device is not in allowed list -> force logout
    if (!raw || !raw[deviceId]) {
      return NextResponse.json(
        {
          valid: false,
          enforcedLogout: true,
          reason: "FORCED_LOGOUT",
          count,
          max: MAX_DEVICES,
          devices,
        },
        { status: 401 }
      );
    }

    const isAllowed = count <= MAX_DEVICES;

    return NextResponse.json({
      valid: isAllowed,
      count,
      max: MAX_DEVICES,
      devices,
    });
  } catch (err) {
    console.error("DEVICE VALIDATE ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
