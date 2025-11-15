// app/api/device/register/route.ts
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";
// removed uuid fallback to avoid server creating new ids

export const runtime = "nodejs";

const MAX_DEVICES = 3;

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.sub;

    // Parse body safely
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // Require deviceId from client to avoid server-created duplicates
    const deviceId = body?.deviceId;
    if (!deviceId) {
      return NextResponse.json(
        {
          error: "MISSING_DEVICE_ID",
          message: "Client must send stable deviceId",
        },
        { status: 400 }
      );
    }

    const ua = req.headers.get("user-agent") || "unknown";
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const entry = {
      deviceId,
      ua,
      ip,
      ts: new Date().toISOString(),
      label: body?.label ?? null,
    };

    const key = `devices:${userId}`;

    const luaScript = `
      local key = KEYS[1]
      local field = ARGV[1]
      local value = ARGV[2]
      local limit = tonumber(ARGV[3])

      -- write/overwrite the device field (this will not increase count if field existed)
      redis.call("HSET", key, field, value)

      local count = redis.call("HLEN", key)

      if count > limit then
        local all = redis.call("HGETALL", key)
        return { tostring(count), all }
      end

      return { tostring(count) }
    `;

    const result = await redis.eval(
      luaScript,
      [key],
      [deviceId, JSON.stringify(entry), String(MAX_DEVICES)]
    );

    const arr = result as any[];
    const count = Number(arr[0] || 0);

    // exceeded case
    if (arr.length > 1) {
      const flat = arr[1] as string[];
      const devices: any[] = [];

      for (let i = 0; i < flat.length; i += 2) {
        try {
          devices.push(JSON.parse(flat[i + 1]));
        } catch {
          // skip
        }
      }

      return NextResponse.json(
        {
          success: false,
          exceeded: true,
          count,
          devices,
          deviceId,
          error: "DEVICE_LIMIT_REACHED",
        },
        { status: 200 }
      );
    }

    // success
    return NextResponse.json({
      success: true,
      exceeded: false,
      count,
      deviceId,
    });
  } catch (error) {
    console.error("REGISTER DEVICE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
