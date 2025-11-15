import { auth0 } from "@/lib/auth0";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session?.user) redirect("/auth/login");

  const userId = session.user.sub;

  // 🔥 Tell TypeScript what shape Redis can return
  const raw = (await redis.hgetall(`profile:${userId}`)) as Record<
    string,
    string | object
  > | null;

  // 🔥 Safely extract values
  const fullName =
    typeof raw?.fullName === "string"
      ? raw.fullName
      : (raw?.fullName as any)?.fullName ?? null;

  const phone =
    typeof raw?.phone === "string"
      ? raw.phone
      : (raw?.phone as any)?.phone ?? null;

  // 🔥 New users → redirect
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
