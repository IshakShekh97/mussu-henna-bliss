import React, { Suspense } from "react";
import { Calendar } from "lucide-react";

import { MetricsGrid } from "@/components/admin/dashboard/metrics-grid";
import { MetricsSkeleton } from "@/components/admin/dashboard/metrics-skeleton";
import { BookingPipeline } from "@/components/admin/dashboard/booking-pipeline";
import { BookingPipelineSkeleton } from "@/components/admin/dashboard/booking-pipeline-skeleton";
import { InventoryWatch } from "@/components/admin/dashboard/inventory-watch";
import { InventoryWatchSkeleton } from "@/components/admin/dashboard/inventory-watch-skeleton";
import { FulfillmentFeed } from "@/components/admin/dashboard/fulfillment-feed";
import { FulfillmentFeedSkeleton } from "@/components/admin/dashboard/fulfillment-feed-skeleton";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Admin Portal",
  description:
    "Welcome to the Dashboard! Manage your business and serve your clients better.",
};

export default async function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Shell Header & Time Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#4E3E2F]">
            Welcome back, Artist ✨
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your bookings, cone sales, and request pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#FDFBF7] border border-[#EBE4DC] px-4 py-2 rounded-xl shadow-xs self-start">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-[#5C4D3E]">
            {currentDate}
          </span>
        </div>
      </div>

      {/* SECTION 1: Metrics Row (Streamed Async) */}
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsGrid />
      </Suspense>

      {/* SECTION 2: Actionable Split View (Streamed Async) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Suspense fallback={<BookingPipelineSkeleton />}>
          <BookingPipeline />
        </Suspense>

        <Suspense fallback={<InventoryWatchSkeleton />}>
          <InventoryWatch />
        </Suspense>
      </div>

      {/* SECTION 3: Live Order Feed Table (Streamed Async) */}
      <Suspense fallback={<FulfillmentFeedSkeleton />}>
        <FulfillmentFeed />
      </Suspense>
    </div>
  );
}
