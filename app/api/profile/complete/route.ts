import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { fullName, phone } = await req.json();
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userId = session.user.sub;

    // Save to Redis
    await redis.hset(`profile:${userId}`, {
      fullName,
      phone,
    });

    // 🔥 KEY: force redirect from server
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
