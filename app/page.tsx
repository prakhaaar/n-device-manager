"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-linear-to-b from-gray-50 via-white to-indigo-50 text-gray-900 font-[Inter]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100/40 via-white to-blue-50/40 animate-pulse-slow"></div>

      {/* Background glows */}
      <div className="absolute top-[12%] left-[8%] w-80 h-80 bg-blue-200/40 rounded-full blur-3xl opacity-50 animate-float-slow" />
      <div className="absolute bottom-[15%] right-[10%] w-100 h-100 bg-indigo-200/40 rounded-full blur-3xl opacity-50 animate-float-slower" />

      {/* Navbar */}
      <Header />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-3xl shadow-lg px-10 py-12 max-w-3xl"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-semibold mb-6 bg-linear-to-r from-gray-700 via-gray-800 to-black bg-clip-text text-transparent tracking-tight leading-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Secure Access. Limited to 3 Devices.
          </motion.h1>

          <motion.p
            className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experience seamless security with Next.js and Auth0. Only three
            devices per account (N = 3) can stay logged in simultaneously.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/auth/login">
              <Button className="bg-linear-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white px-8 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                Login with Auth0
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
