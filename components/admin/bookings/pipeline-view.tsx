"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { BookingCard } from "./booking-card";
import { Booking } from "@/lib/zodSchemas";

interface PipelineViewProps {
  bookings: Booking[];
  onView: (b: Booking) => void;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nextStatus: string) => void;
  isPending: boolean;
}

export function PipelineView({
  bookings,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  isPending,
}: PipelineViewProps) {
  return (
    <div className="space-y-4">
      {/* Booking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length === 0 ? (
          <div className="col-span-full bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-12 text-center text-[#8C7A6B] flex flex-col items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-[#8C7A6B]/40 mb-3" />
            <span className="font-serif font-bold text-lg text-[#4E3E2F]">
              No bookings found
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              There are no records matching the selected status.
            </p>
          </div>
        ) : (
          bookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              isPending={isPending}
            />
          ))
        )}
      </div>
    </div>
  );
}
