"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export function OrdersSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Summary Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EBE4DC] gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[#EBE4DC]" />
          <Skeleton className="h-4 w-96 bg-[#EBE4DC]/60" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 bg-[#EBE4DC]" />
          <Skeleton className="h-9 w-28 bg-[#EBE4DC]" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
        <Skeleton className="h-10 w-full md:max-w-sm bg-[#EBE4DC]/60" />
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-32 bg-[#EBE4DC]/60" />
          <Skeleton className="h-10 w-32 bg-[#EBE4DC]/60" />
        </div>
      </div>

      {/* Static Info Callout Box (Placeholder) */}
      <div className="bg-[#FAF6EE] border border-[#E9DFD0] rounded-2xl p-4 flex gap-3 animate-pulse">
        <div className="w-5 h-5 rounded-full bg-[#E9DFD0] shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3 bg-[#E9DFD0]" />
          <Skeleton className="h-3 w-2/3 bg-[#E9DFD0]/60" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAF6F0]/60 border-b border-[#EBE4DC]/60">
            <TableRow className="hover:bg-transparent border-[#EBE4DC]/60">
              <TableHead className="py-4 pl-6"><Skeleton className="h-4 w-20 bg-[#EBE4DC]" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-16 bg-[#EBE4DC]" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-24 bg-[#EBE4DC]" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-32 bg-[#EBE4DC]" /></TableHead>
              <TableHead className="py-4"><Skeleton className="h-4 w-24 bg-[#EBE4DC]" /></TableHead>
              <TableHead className="py-4 pr-6"><Skeleton className="h-4 w-16 bg-[#EBE4DC]" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="border-[#EBE4DC]/40 hover:bg-transparent">
                <TableCell className="py-5 pl-6"><Skeleton className="h-6 w-24 bg-[#EBE4DC]/50" /></TableCell>
                <TableCell className="py-5"><Skeleton className="h-4 w-16 bg-[#EBE4DC]/50" /></TableCell>
                <TableCell className="py-5">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 bg-[#EBE4DC]/50" />
                    <Skeleton className="h-3 w-20 bg-[#EBE4DC]/30" />
                  </div>
                </TableCell>
                <TableCell className="py-5"><Skeleton className="h-4 w-32 bg-[#EBE4DC]/50" /></TableCell>
                <TableCell className="py-5">
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-4 w-12 bg-[#EBE4DC]/50" />
                    <Skeleton className="h-4 w-8 bg-[#EBE4DC]/30" />
                  </div>
                </TableCell>
                <TableCell className="py-5 pr-6"><Skeleton className="h-6 w-20 rounded-full bg-[#EBE4DC]/50" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
