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

export function BookingsSkeleton() {
  return (
    <div className="space-y-6 font-sans">
      {/* Top control bar skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FDFBF7] border border-[#EBE4DC] p-4 rounded-2xl shadow-xs">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36 bg-neutral-200" />
          <Skeleton className="h-9 w-36 bg-neutral-200" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl bg-neutral-200" />
      </div>

      {/* Category Pills & Sorting Control Skeletons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FDFBF7] border border-[#EBE4DC] p-4 rounded-2xl shadow-xs">
        <div className="flex gap-1.5 overflow-x-auto pb-1 w-full md:w-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 bg-neutral-200 rounded-lg shrink-0" />
          ))}
        </div>
        <Skeleton className="h-10 w-full md:w-44 bg-neutral-200 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl shadow-sm overflow-hidden w-full">
        <Table>
          <TableHeader className="bg-[#FAF6F0]/60 border-b border-[#EBE4DC]/60">
            <TableRow className="hover:bg-transparent border-[#EBE4DC]/60">
              <TableHead className="py-4 pl-6"><Skeleton className="h-4 w-28 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-28 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-20 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-12 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50" /></TableHead>
              <TableHead className="py-4 pr-6 text-right"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="border-[#EBE4DC]/40 hover:bg-transparent">
                {/* Client / Occasion */}
                <TableCell className="py-4 pl-6">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 bg-[#EBE4DC]/50" />
                    <Skeleton className="h-3 w-16 bg-[#EBE4DC]/30" />
                  </div>
                </TableCell>
                {/* Event Date & Time */}
                <TableCell className="py-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24 bg-[#EBE4DC]/50" />
                    <Skeleton className="h-3 w-16 bg-[#EBE4DC]/30" />
                  </div>
                </TableCell>
                {/* Location */}
                <TableCell className="py-4"><Skeleton className="h-4 w-32 bg-[#EBE4DC]/50" /></TableCell>
                {/* Guests */}
                <TableCell className="py-4"><Skeleton className="h-4 w-10 bg-[#EBE4DC]/50" /></TableCell>
                {/* Price Quoted */}
                <TableCell className="py-4"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50" /></TableCell>
                {/* Status */}
                <TableCell className="py-4"><Skeleton className="h-5 w-20 bg-[#EBE4DC]/40 rounded" /></TableCell>
                {/* Actions */}
                <TableCell className="py-4 pr-6 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Skeleton className="h-7 w-7 bg-[#EBE4DC]/40 rounded" />
                    <Skeleton className="h-7 w-7 bg-[#EBE4DC]/40 rounded" />
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

export default BookingsSkeleton;
