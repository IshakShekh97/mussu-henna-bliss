import React from "react";
import { getRecentBookingRequests } from "@/app/actions/booking.action";
import { BookingPipelineClient } from "./booking-pipeline-client";

export async function BookingPipeline() {
  const result = await getRecentBookingRequests();
  const bookings = result.success && result.data ? result.data : [];

  return <BookingPipelineClient initialBookings={bookings} />;
}

