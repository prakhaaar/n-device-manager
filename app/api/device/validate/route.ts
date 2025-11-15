import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";

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

    const exists = await redis.hget(key, deviceId);

    if (!exists) {
      return NextResponse.json(
        { valid: false, reason: "FORCED_LOGOUT" },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error("DEVICE VALIDATE ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
