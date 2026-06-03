import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { BookingDetailsView } from "@/components/admin/bookings/booking-details-view";

interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BookingPageProps) {
  const resolvedParams = await params;
  const shortId = resolvedParams.id.slice(0, 8).toUpperCase();
  return {
    title: `Booking Details MHB-${shortId} | Admin Portal`,
    description: `Manage booking requests and quotes for MHB-${shortId}`,
  };
}

export default async function BookingDetailPage({ params }: BookingPageProps) {
  const resolvedParams = await params;
  const booking = await prisma.booking.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!booking) {
    notFound();
  }

  // Serialize eventDate and createdAt for safe client side hydration
  const serializedBooking = {
    ...booking,
    eventDate: booking.eventDate.toISOString(),
    createdAt: booking.createdAt.toISOString(),
  };

  return (
    <div className="w-full py-2">
      <BookingDetailsView booking={serializedBooking as any} />
    </div>
  );
}
