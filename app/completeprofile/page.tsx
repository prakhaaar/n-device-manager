"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CompleteProfilePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName.trim() || !phone.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // SUCCESS → redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Server error");
    }

    setLoading(false);
  }

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-linear-to-b from-gray-50 via-white to-indigo-50 text-gray-900 font-[Inter]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100/40 via-white to-blue-50/40 animate-pulse-slow"></div>

      {/* Background glows */}
      <div className="absolute top-[12%] left-[8%] w-80 h-80 bg-blue-200/40 rounded-full blur-3xl opacity-50 animate-float-slow" />
      <div className="absolute bottom-[15%] right-[10%] w-100 h-100 bg-indigo-200/40 rounded-full blur-3xl opacity-50 animate-float-slower" />

      {/* Navbar */}
      <Header />

      {/* Page Content */}
      <section className="flex-1 flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative bg-white/70 backdrop-blur-xl border border-zinc-200
          rounded-3xl shadow-lg px-10 py-12 w-full max-w-lg"
        >
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center bg-linear-to-r from-gray-800 via-black to-gray-700 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white py-3 rounded-xl text-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
