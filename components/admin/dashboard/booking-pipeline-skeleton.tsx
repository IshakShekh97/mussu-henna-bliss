import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingPipelineSkeleton() {
  return (
    <Card className="lg:col-span-2 bg-[#FDFBF7] border-[#EBE4DC] shadow-xs flex flex-col">
      <CardHeader className="border-b border-[#EBE4DC]/60 pb-4">
        <CardTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
          Recent Booking Requests
        </CardTitle>
        <CardDescription className="text-xs">
          Loading custom requests pipeline...
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBE4DC]/30 last:border-b-0 animate-pulse"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12 bg-neutral-200" />
                <Skeleton className="h-4.5 w-32 bg-neutral-200" />
                <Skeleton className="h-3 w-20 bg-neutral-200" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-3 w-24 bg-neutral-200" />
                <Skeleton className="h-3 w-16 bg-neutral-200" />
                <Skeleton className="h-3 w-28 bg-neutral-200" />
              </div>
            </div>
            <Skeleton className="h-8 w-32 rounded-lg bg-neutral-200 shrink-0 self-start sm:self-center" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
