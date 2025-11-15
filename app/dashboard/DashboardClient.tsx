"use client";

import { useDeviceValidation } from "@/components/useDeviceValidation";
import DashboardUI from "./DashboardUI";
import DeviceRegisterWrapper from "./DeviceRegisterWrapper";
import ActiveDevices from "@/components/ActiveDevices";

interface DashboardClientProps {
  profile: {
    fullName: string;
    phone: string;
  };
  email: string;
}

export default function DashboardClient({
  profile,
  email,
}: DashboardClientProps) {
  // Validate forced logout (deleted devices)
  useDeviceValidation();

  return (
    <>
      {/* Main dashboard UI */}
      <DashboardUI
        fullName={profile.fullName}
        phone={profile.phone}
        email={email}
      />

      {/* Registers this device + popup if N devices limit exceeded */}
      <DeviceRegisterWrapper />

      {/* Shows all active devices */}
      <ActiveDevices />
    </>
  );
}
