"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Shield } from "lucide-react";
import ActiveDevices from "@/components/ActiveDevices";

export default function DashboardUI({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-gray-50 via-white to-indigo-50 text-gray-900 font-[Inter]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100/40 via-white to-blue-50/40"></div>

      {/* Glow Effects */}
      <div className="absolute top-[12%] left-[8%] w-80 h-80 bg-blue-200/40 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[15%] right-[10%] w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl opacity-50" />

      {/* Navbar */}
      <Header />

      {/* Main Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-3xl shadow-lg px-10 py-14 max-w-3xl w-full"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-gray-700 via-gray-800 to-black bg-clip-text text-transparent tracking-tight leading-tight">
              Your Secure Dashboard
            </h1>
            <p className="text-gray-700 text-base md:text-lg max-w-xl mx-auto">
              Manage your personal information securely with Auth0 & Next.js.
            </p>
          </motion.div>

          {/* Profile Card */}
          <Card className="border-none shadow-none bg-transparent">
            <div className="flex flex-col items-center gap-8">
              {/* Avatar */}
              <Avatar className="h-28 w-28 border-4 border-indigo-300 shadow-xl">
                <AvatarFallback className="bg-indigo-600 text-white text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Badge
                variant="secondary"
                className="gap-1 px-3 py-1 text-sm border border-gray-300"
              >
                <Shield className="h-3 w-3" />
                Verified Account
              </Badge>

              <div className="text-center">
                <h2 className="text-3xl font-semibold text-gray-900">
                  {fullName}
                </h2>
                <p className="text-gray-600 mt-1 text-sm">Account Member</p>
              </div>

              {/* Contact Block */}
              <div className="w-full mt-6 space-y-6 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl p-6">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {fullName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {phone}
                    </p>
                  </div>
                </div>
              </div>

              <Button className="mt-6 w-full max-w-md bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-200">
                Edit Profile
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Active Devices Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-3xl shadow-lg px-10 py-10 max-w-3xl w-full"
        >
          <ActiveDevices />
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
