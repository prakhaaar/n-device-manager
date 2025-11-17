import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login");

  const userId = session.user.sub;

  const raw = (await redis.hgetall(`profile:${userId}`)) as Record<
    string,
    string
  > | null;

  const fullName = raw?.fullName ?? null;
  const phone = raw?.phone ?? null;

  if (!fullName || !phone) {
    redirect("/completeprofile");
  }

  return (
    <DashboardClient
      profile={{ fullName, phone }}
      email={session.user.email || ""}
    />
  );
}
