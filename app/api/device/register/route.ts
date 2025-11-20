import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";
const MAX_DEVICES = 3;

// ---- SAFE PARSER ----
function safeParse(val: any) {
  if (!val) return null;

  if (typeof val === "object") return val; // already parsed

  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {}

    const deviceId = (body as any)?.deviceId;
    if (!deviceId) {
      return NextResponse.json({ error: "MISSING_DEVICE_ID" }, { status: 400 });
    }

    const userId = session.user.sub;
    const key = `devices:${userId}`;

    // 1. Read devices safely
    const raw: Record<string, any> = (await redis.hgetall(key)) || {};

    const devices = Object.values(raw).map(safeParse).filter(Boolean);
    const count = devices.length;

    const isExistingDevice = !!raw[deviceId];

    // ⭐ NEW FIX: If device already exists → do not re-register
    if (isExistingDevice) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        deviceId,
      });
    }

    // 2. Enforce 3-device limit BEFORE adding a new one
    if (count >= MAX_DEVICES) {
      return NextResponse.json({
        exceeded: true,
        count,
        max: MAX_DEVICES,
        devices,
      });
    }

    // 3. Register new device
    const entry = {
      deviceId,
      ua: req.headers.get("user-agent") ?? "",
      ip: (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0],
      ts: new Date().toISOString(),
      label: null,
    };

    await redis.hset(key, { [deviceId]: JSON.stringify(entry) });

    return NextResponse.json({
      success: true,
      exceeded: false,
      deviceId,
      count: count + 1,
    });
  } catch (err) {
    console.error("REGISTER DEVICE ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
