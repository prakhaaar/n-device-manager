import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = session.user.sub;
  const raw = await redis.hgetall(`profile:${userId}`);

  const profile = raw as unknown as {
    fullName?: string;
    phone?: string;
  };

  if (!profile.fullName || !profile.phone) {
    redirect("/completeprofile");
  }

  const typedProfile = {
    fullName: profile.fullName!,
    phone: profile.phone!,
  };

  return (
    <DashboardClient profile={typedProfile} email={session.user.email || ""} />
  );
}
