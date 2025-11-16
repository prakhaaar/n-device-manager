"use client";

import DeviceRegisterClient from "./DeviceRegisterClient";

interface DeviceRegisterWrapperProps {
  onRegistered?: () => void; // allow optional callback
}

export default function DeviceRegisterWrapper({
  onRegistered,
}: DeviceRegisterWrapperProps) {
  return <DeviceRegisterClient onRegistered={onRegistered} />;
}
