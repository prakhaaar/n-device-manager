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

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
        {/* HERO CARD */}
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
            <Link href="/auth/login?returnTo=/dashboard">
              <Button className="bg-linear-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white px-8 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                Login with Auth0
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* ABOUT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto text-center space-y-8 px-4"
        >
          <h2 className="text-3xl font-semibold bg-linear-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent">
            What is N-Device Session Security?
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            This mini application is built as part of a Frontend Developer
            Internship assignment. It showcases a real-world security feature
            used in streaming apps, banking portals, and SaaS dashboards —{" "}
            <span className="font-semibold">
              limiting how many devices a user can stay logged in on
              simultaneously.
            </span>
          </p>

          <p className="text-gray-600 leading-relaxed">
            For this demo, the limit is configured as <strong>N = 3</strong>.
            When a fourth device attempts to log in, the user must:
          </p>

          <ul className="text-left max-w-2xl mx-auto text-gray-700 space-y-2">
            <li>• Cancel the login attempt</li>
            <li>• Or force-logout one of their existing devices</li>
          </ul>

          <p className="text-gray-600 leading-relaxed">
            Any device that gets force-logged-out receives a friendly message
            explaining the reason, ensuring clarity & transparency.
          </p>

          <h3 className="text-2xl font-semibold mt-10">
            Technologies & Services Used
          </h3>

          <p className="text-gray-700 leading-relaxed">
            This project uses <strong>Next.js</strong> for the frontend,{" "}
            <strong>Auth0</strong> for authentication, and
            <strong> Upstash Redis</strong> for device/session tracking all
            free-tier and serverless.
          </p>

          <ul className="text-left max-w-2xl mx-auto text-gray-700 space-y-2">
            <li>• Global Session Storage</li>
            <li>• Zero maintenance</li>
            <li>• Edge-fast performance</li>
            <li>• Secure authentication pipeline</li>
          </ul>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
