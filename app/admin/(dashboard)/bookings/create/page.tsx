import React, { Suspense } from "react";
import { ManualBookingFormStandalone } from "@/components/admin/bookings/manual-booking-form-standalone";

export const metadata = {
  title: "Log Booking | Admin Portal",
  description: "Log a manual client booking request.",
};

export default function CreateBookingPage() {
  return (
    <div className="space-y-6 w-full py-2">
      <Suspense
        fallback={
          <div className="h-[600px] w-full rounded-2xl bg-[#FAF6F0]/40 border border-[#EBE4DC] animate-pulse flex items-center justify-center text-muted-foreground text-xs font-semibold">
            Loading Form...
          </div>
        }
      >
        <ManualBookingFormStandalone />
      </Suspense>
    </div>
  );
}
