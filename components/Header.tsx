"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <nav className="relative z-20 flex items-center justify-between max-w-6xl mx-auto w-full px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="https://wellfound.com/cdn-cgi/image/width=140,height=140,fit=scale-down,gravity=0.5x0.5,quality=90,format=auto/https://photos.wellfound.com/startups/i/10651665-0f0d2d359f263be5c16627e9205e1dcd-medium_jpg.jpg?buster=1755569194"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="font-semibold text-lg text-indigo-700">
          N-Device Manager
        </span>
      </div>

      {/* Login */}
      <Link href="/api/auth/login">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5">
          Login →
        </Button>
      </Link>
    </nav>
  );
}
