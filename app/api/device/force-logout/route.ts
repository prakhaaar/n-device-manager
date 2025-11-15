import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.sub;
    const key = `devices:${userId}`;

    const body = await req.json();
    const { deviceId } = body;

    if (!deviceId) {
      return NextResponse.json({ error: "MISSING_DEVICE_ID" }, { status: 400 });
    }

    // Remove device
    await redis.hdel(key, deviceId);

    return NextResponse.json({ success: true, removed: deviceId });
  } catch (err) {
    console.error("FORCE LOGOUT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
