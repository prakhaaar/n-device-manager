import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";
import CompleteProfileClient from "./CompleteProfileClient";

export default async function CompleteProfilePage() {
  const session = await auth0.getSession();

  // Not logged in → send to login
  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = session.user.sub;
  const profile = await redis.hgetall(`profile:${userId}`);

  // If profile is already complete → do NOT allow accessing this page
  if (profile?.fullName && profile?.phone) {
    redirect("/dashboard");
  }

  return <CompleteProfileClient />;
}
