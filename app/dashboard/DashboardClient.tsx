"use client";

import { useState } from "react";
import { useDeviceValidation } from "@/components/useDeviceValidation";
import DashboardUI from "./DashboardUI";
import DeviceRegisterWrapper from "./DeviceRegisterWrapper";
import ActiveDevices from "@/components/ActiveDevices";
import Footer from "@/components/Footer";

interface DashboardClientProps {
  profile: { fullName: string; phone: string };
  email: string;
}

export default function DashboardClient({
  profile,
  email,
}: DashboardClientProps) {
  const [deviceRegistered, setDeviceRegistered] = useState(false);

  // Validate only AFTER registration completes
  useDeviceValidation(deviceRegistered);

  return (
    <>
      <DashboardUI
        fullName={profile.fullName}
        phone={profile.phone}
        email={email}
      />
      {/* Register device first */}
      <DeviceRegisterWrapper onRegistered={() => setDeviceRegistered(true)} />]
      <Footer />
    </>
  );
}
