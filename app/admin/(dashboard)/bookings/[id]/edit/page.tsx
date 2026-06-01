import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditBookingFormStandalone } from "@/components/admin/bookings/edit-booking-form-standalone";

export const metadata = {
  title: "Edit Booking | Admin Portal",
  description: "Modify booking record details.",
};

interface EditBookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-6 w-full py-2">
      <Suspense
        fallback={
          <div className="h-[600px] w-full rounded-2xl bg-[#FAF6F0]/40 border border-[#EBE4DC] animate-pulse flex items-center justify-center text-muted-foreground text-xs font-semibold">
            Loading Booking Details...
          </div>
        }
      >
        <EditBookingFormStandalone booking={booking} />
      </Suspense>
    </div>
  );
}
