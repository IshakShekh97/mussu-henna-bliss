import React, { Suspense } from "react";
import { getBookings } from "@/app/actions/admin.action";
import { BookingsManager } from "@/components/admin/bookings-manager";
import { BookingsSkeleton } from "@/components/admin/bookings-skeleton";

// Force Next.js to dynamically fetch data on every request
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#4E3E2F]">
          Client Booking Pipeline
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review details, propose quotes, schedule event times, and track client reply statuses.
        </p>
      </div>

      {/* Streamed Bookings Manager Wrapper */}
      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsListLoader />
      </Suspense>
    </div>
  );
}

/**
 * Asynchronously loads bookings from PostgreSQL database using our admin server action.
 * Resolves on the server before streaming the final UI.
 */
async function BookingsListLoader() {
  const result = await getBookings();
  const bookings = result.success && result.data ? result.data : [];

  return <BookingsManager initialBookings={bookings} />;
}
