import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryWatchSkeleton() {
  return (
    <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs flex flex-col">
      <CardHeader className="border-b border-[#EBE4DC]/60 pb-4">
        <CardTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
          Urgent Inventory Watch
        </CardTitle>
        <CardDescription className="text-xs">
          Loading stock levels...
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="p-4 flex items-center justify-between gap-3 border-b border-[#EBE4DC]/30 last:border-b-0 animate-pulse"
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <Skeleton className="h-9 w-9 rounded-full bg-neutral-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 bg-neutral-200" />
                <Skeleton className="h-3 w-16 bg-neutral-200" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-md bg-neutral-200 shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
