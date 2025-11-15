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
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      {/* Background Aurora */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-indigo-300/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[8%] right-[10%] w-[450px] h-[450px] bg-blue-300/30 rounded-full blur-[120px]" />
      </div>

      <Header />

      {/* Main Section */}
      <section className="flex-1 flex flex-col items-center px-6 py-16 md:py-20 gap-10 relative z-20">
        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            w-full max-w-3xl 
            rounded-3xl 
            bg-white/60 
            backdrop-blur-2xl 
            border border-white/40
            shadow-[0_8px_32px_rgba(0,0,0,0.08)]
            px-10 py-12
          "
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent leading-tight">
              Your Secure Dashboard
            </h1>
            <p className="text-gray-700 mt-2">
              Manage your personal information securely with Auth0 & Next.js.
            </p>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-indigo-300 shadow-xl">
              <AvatarFallback className="bg-indigo-600 text-white text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <Badge className="gap-1 px-3 py-1 text-sm border border-gray-300 bg-white/70 backdrop-blur-md">
              <Shield className="h-3 w-3 text-indigo-600" />
              Verified Account
            </Badge>

            {/* Name */}
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900">
                {fullName}
              </h2>
              <p className="text-gray-600 mt-1 text-sm">Account Member</p>
            </div>

            {/* Contact Section */}
            <div className="w-full mt-6 bg-white/70 border border-gray-200 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              {/* Name */}
              <ProfileField
                icon={<User className="h-5 w-5 text-indigo-600" />}
                label="Full Name"
                value={fullName}
              />

              {/* Email */}
              <ProfileField
                icon={<Mail className="h-5 w-5 text-indigo-600" />}
                label="Email Address"
                value={email}
              />

              {/* Phone */}
              <ProfileField
                icon={<Phone className="h-5 w-5 text-indigo-600" />}
                label="Phone Number"
                value={phone}
              />
            </div>

            {/* Edit Button */}
            <Button
              className="
                mt-4 w-full max-w-md py-3 rounded-xl 
                bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 
                hover:from-indigo-700 hover:to-sky-600 
                text-white shadow-lg hover:shadow-xl 
                transition-all duration-300
              "
            >
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* ACTIVE DEVICES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="
            w-full max-w-3xl 
            rounded-3xl
            bg-white/60
            backdrop-blur-2xl
            border border-white/40
            shadow-[0_8px_32px_rgba(0,0,0,0.08)]
            px-10 py-10
          "
        >
          <ActiveDevices />
        </motion.div>
      </section>
    </main>
  );
}

/* reusable small component */
function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
