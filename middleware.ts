import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0"; // correct import

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const response = await auth0.middleware(req);

  const session = await auth0.getSession(req);

  if (!session && !req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return response;
}
