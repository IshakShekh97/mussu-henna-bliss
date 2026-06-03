import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

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

      {/* Product Table Skeleton */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl shadow-sm overflow-hidden w-full">
        <Table>
          <TableHeader className="bg-[#FAF6F0]/60 border-b border-[#EBE4DC]/60">
            <TableRow className="hover:bg-transparent border-[#EBE4DC]/60">
              <TableHead className="py-4 pl-6"><Skeleton className="h-4 w-24 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-20 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-24 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4 pr-6 text-right"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="border-[#EBE4DC]/40 hover:bg-transparent">
                {/* Product Thumbnail & Name Skeleton */}
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg bg-[#EBE4DC]/40 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-32 bg-[#EBE4DC]/50" />
                      <Skeleton className="h-3 w-48 bg-[#EBE4DC]/30" />
                    </div>
                  </div>
                </TableCell>
                {/* Category Skeleton */}
                <TableCell className="py-4"><Skeleton className="h-5 w-20 bg-[#EBE4DC]/40 rounded" /></TableCell>
                {/* Price Skeleton */}
                <TableCell className="py-4"><Skeleton className="h-4 w-12 bg-[#EBE4DC]/50" /></TableCell>
                {/* Stock Badge Skeleton */}
                <TableCell className="py-4"><Skeleton className="h-5 w-24 bg-[#EBE4DC]/40 rounded-full" /></TableCell>
                {/* Live Switch Skeleton */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-9 rounded-full bg-[#EBE4DC]/40" />
                    <Skeleton className="h-3.5 w-8 bg-[#EBE4DC]/30" />
                  </div>
                </TableCell>
                {/* Actions Skeleton */}
                <TableCell className="py-4 pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-7 w-12 bg-[#EBE4DC]/40 rounded" />
                    <Skeleton className="h-7 w-7 bg-[#EBE4DC]/40 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
