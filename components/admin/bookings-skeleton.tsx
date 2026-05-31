import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BookingsSkeleton() {
  return (
    <div className="space-y-6 font-sans animate-pulse">
      {/* Top control bar skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FDFBF7] border border-[#EBE4DC] p-4 rounded-2xl shadow-xs">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36 bg-neutral-200" />
          <Skeleton className="h-9 w-36 bg-neutral-200" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl bg-neutral-200" />
      </div>

      {/* Dual-View Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Rail (List View) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            {/* Filter tabs skeleton */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-16 bg-neutral-200 rounded-lg shrink-0" />
              ))}
            </div>
            
            {/* Pipeline cards skeletons */}
            <div className="flex flex-col gap-3 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 border border-[#EBE4DC] rounded-xl flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5.5 w-28 bg-neutral-200" />
                    <Skeleton className="h-4 w-12 bg-neutral-200 rounded-full" />
                  </div>
                  <Skeleton className="h-3.5 w-20 bg-neutral-200" />
                  <div className="flex justify-between mt-1">
                    <Skeleton className="h-3 w-16 bg-neutral-200" />
                    <Skeleton className="h-3 w-12 bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Canvas (Detail Panel) */}
        <div className="lg:col-span-2">
          <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs p-6 flex flex-col gap-6">
            <div className="border-b border-[#EBE4DC]/60 pb-5 space-y-3">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48 bg-neutral-200" />
                  <Skeleton className="h-4 w-24 bg-neutral-200" />
                </div>
                <Skeleton className="h-6 w-20 bg-neutral-200 rounded-full" />
              </div>
            </div>

            {/* Core event spec sheet skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF6F0] border border-[#EBE4DC] p-5 rounded-xl">
              <div className="space-y-4">
                <Skeleton className="h-3 w-20 bg-neutral-200" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Skeleton className="h-4 w-4 bg-neutral-200 rounded-full" />
                    <Skeleton className="h-4 w-36 bg-neutral-200" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-3 w-20 bg-neutral-200" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Skeleton className="h-4 w-4 bg-neutral-200 rounded-full" />
                    <Skeleton className="h-4 w-40 bg-neutral-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Design vision note box skeleton */}
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-28 bg-neutral-200" />
              <Skeleton className="h-16 w-full bg-neutral-200 rounded-xl" />
            </div>

            {/* Negotiation Suite skeleton */}
            <div className="border-t border-[#EBE4DC]/60 pt-6 space-y-4">
              <Skeleton className="h-5 w-36 bg-neutral-200 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-neutral-200" />
                  <Skeleton className="h-10 w-full bg-neutral-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-neutral-200" />
                  <Skeleton className="h-10 w-full bg-neutral-200 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-11 w-full bg-neutral-200 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default BookingsSkeleton;
