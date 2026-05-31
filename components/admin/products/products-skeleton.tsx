import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsSkeleton() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48 bg-[#EBE4DC]/60" />
          <Skeleton className="h-4 w-80 bg-[#EBE4DC]/60" />
        </div>
        <Skeleton className="h-9 w-36 bg-[#EBE4DC]/60 rounded-lg self-start md:self-auto" />
      </div>

      {/* Control Action Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#FDFBF7] border border-[#EBE4DC] p-4 rounded-xl shadow-xs">
        <div className="flex-1">
          <Skeleton className="h-9 w-full bg-[#EBE4DC]/60" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 bg-[#EBE4DC]/60" />
          <Skeleton className="h-9 w-36 bg-[#EBE4DC]/60" />
        </div>
      </div>

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs flex flex-col overflow-hidden">
            {/* Image Placeholder */}
            <div className="relative aspect-square w-full bg-[#EBE4DC]/30 flex items-center justify-center">
              <Skeleton className="h-full w-full bg-[#EBE4DC]/50" />
            </div>

            <CardHeader className="space-y-2 pb-2">
              <Skeleton className="h-5 w-2/3 bg-[#EBE4DC]/60" />
              <Skeleton className="h-3.5 w-1/3 bg-[#EBE4DC]/60" />
            </CardHeader>

            <CardContent className="space-y-2 pb-4 flex-1">
              <Skeleton className="h-3 w-full bg-[#EBE4DC]/40" />
              <Skeleton className="h-3 w-5/6 bg-[#EBE4DC]/40" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-16 bg-[#EBE4DC]/60" />
                <Skeleton className="h-5 w-20 bg-[#EBE4DC]/60" />
              </div>
            </CardContent>

            <CardFooter className="border-t border-[#EBE4DC]/50 p-4 flex items-center justify-between bg-[#FAF6F0]/20">
              <Skeleton className="h-8 w-20 bg-[#EBE4DC]/60" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12 bg-[#EBE4DC]/60" />
                <Skeleton className="h-5 w-9 rounded-full bg-[#EBE4DC]/60" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
