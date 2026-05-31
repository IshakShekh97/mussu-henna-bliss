import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24 bg-neutral-200" />
            <Skeleton className="h-7 w-7 rounded-lg bg-neutral-200" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-8 w-32 bg-neutral-200" />
            <Skeleton className="h-4 w-20 bg-neutral-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
