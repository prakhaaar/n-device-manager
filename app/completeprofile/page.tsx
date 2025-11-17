import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";
import CompleteProfileClient from "./CompleteProfileClient";

export default async function CompleteProfilePage() {
  const session = await auth0.getSession();

  if (!session?.user) redirect("/auth/login");

  const userId = session.user.sub;

  let profile: Record<string, string> | null = null;
  try {
    profile = await redis.hgetall(`profile:${userId}`);
  } catch (err) {
    console.error("Redis error fetching profile:", err);
    profile = null;
  }

  if (profile && profile.fullName && profile.phone) {
    redirect("/dashboard");
  }

  return <CompleteProfileClient />;
}
