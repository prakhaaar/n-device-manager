"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Thanks() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-linear-to-br from-gray-50 via-white to-indigo-50 text-gray-900 font-[Inter]">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-blue-100/40"></div>

      <Header />

      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-lg p-12 max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 bg-linear-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Thank You for the Opportunity
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            I truly appreciate being shortlisted for the first round at
            <span className="font-semibold"> Law & Verdict</span>. Working on
            this task has been a great learning experience not only technically,
            but also in understanding the type of thoughtful, user-focused
            engineering that early-stage startups value.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            Building this mini application helped me explore deeper Auth0
            workflows, real-world session management, edge-focused
            architectures, and polished frontend execution with Next.js 15. I
            enjoyed every part of it, from reading documentation to designing a
            clean and professional UI.
          </p>

          <p className="text-gray-700 font-medium mb-10">
            Thank you, Shreyansh, for reviewing my work and giving me the
            opportunity to showcase my skills. Looking forward to the next
            steps!
          </p>

          <Link href="/">
            <Button className="px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow hover:shadow-lg transition-all">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
