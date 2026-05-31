import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FulfillmentFeedSkeleton() {
  return (
    <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs">
      <CardHeader className="border-b border-[#EBE4DC]/60 pb-4">
        <CardTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
          Live Order Fulfillment Feed
        </CardTitle>
        <CardDescription className="text-xs">
          Loading active orders...
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-[#FAF6F0]">
              <TableRow className="border-[#EBE4DC]">
                <TableHead className="w-[120px]">
                  <Skeleton className="h-4 w-16 bg-neutral-200" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20 bg-neutral-200" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16 bg-neutral-200" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24 bg-neutral-200" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-14 bg-neutral-200" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index} className="border-[#EBE4DC] animate-pulse">
                  <TableCell>
                    <Skeleton className="h-4 w-20 bg-neutral-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4.5 w-28 bg-neutral-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 bg-neutral-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 bg-neutral-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 bg-neutral-200" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
