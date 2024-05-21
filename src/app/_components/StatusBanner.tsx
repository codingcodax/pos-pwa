"use client";

import clsx from "clsx/lite";
import { useNetwork } from "~/hooks/useNetwork";

export const StatusBanner = () => {
  const { isOnline } = useNetwork();

  return (
    <div
      className={clsx(
        "flex w-full items-center justify-center p-2 font-medium",
        !isOnline ? "bg-red-400" : "bg-green-400",
      )}
    >
      {isOnline ? "Online" : "Offline"}
    </div>
  );
};
