"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, CheckCircle2, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/zodSchemas";
import { ViewBookingDialog } from "@/components/admin/bookings/view-booking-dialog";
import { HandoffDialog } from "@/components/admin/bookings/handoff-dialog";

interface BookingPipelineClientProps {
  initialBookings: Booking[];
}

export function BookingPipelineClient({ initialBookings }: BookingPipelineClientProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Dialog States
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedBookingId, setGeneratedBookingId] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleOpenEdit = (booking: Booking) => {
    router.push(`/admin/bookings/${booking.id}/edit`);
  };

  const handleStatusChangeOptimistic = (
    bookingId: string,
    status: string,
    price: number,
    time?: string,
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          let updatedDate = new Date(b.eventDate);
          if (time) {
            const [h, m] = time.split(":").map(Number);
            if (!isNaN(h) && !isNaN(m)) {
              updatedDate.setHours(h, m, 0, 0);
            }
          }
          return {
            ...b,
            status,
            quotedPrice: price,
            eventDate: updatedDate,
          };
        }
        return b;
      }),
    );
  };

  const handleQuoteSuccess = (link: string, bookingId: string) => {
    setGeneratedLink(link);
    setGeneratedBookingId(bookingId);
    setViewDialogOpen(false);
    setHandoffOpen(true);
  };

  // Sync details resolver
  const selectedBooking =
    bookings.find((b) => b.id === selectedBookingId) || null;

  return (
    <Card className="lg:col-span-2 bg-[#FDFBF7] border-[#EBE4DC] shadow-xs flex flex-col">
      <CardHeader className="border-b border-[#EBE4DC]/60 pb-4">
        <CardTitle className="font-serif text-xl font-bold text-[#4E3E2F] flex items-center gap-1.5">
          Recent Booking Requests{" "}
          <span className="text-[#8C7A6B] text-xs font-sans font-normal">
            (Needs Attention)
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Review custom requests, send quotes directly to client WhatsApp, or
          track response states.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-[#8C7A6B]">
            <CheckCircle2 className="h-8 w-8 text-[#8C7A6B]/50 mb-2" />
            <span className="font-semibold text-sm">All caught up!</span>
            <span className="text-xs text-muted-foreground mt-0.5">
              No bookings awaiting quote reviews.
            </span>
          </div>
        ) : (
          <div className="divide-y divide-[#EBE4DC]/50">
            {bookings.map((booking) => {
              const isPendingQuote = booking.status === "PENDING_QUOTE";
              return (
                <div
                  key={booking.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors hover:bg-[#FAF6F0]/40"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isPendingQuote ? (
                        <Badge className="bg-primary/10 text-primary border border-primary/20 text-3xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          ⚡ New
                        </Badge>
                      ) : (
                        <Badge className="bg-[#EBE4DC] text-[#4E3E2F] border border-[#D4C3B3] text-3xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          ⏳ Sent
                        </Badge>
                      )}
                      <span className="font-semibold text-sm text-[#4E3E2F]">
                        {booking.customerName}
                      </span>
                      <span className="text-2xs text-[#8C7A6B]">
                        — {booking.eventType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-2xs text-[#5C4D3E]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                        {new Date(booking.eventDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                        {new Date(booking.eventDate).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                        <span className="max-w-[150px] truncate">
                          {booking.location}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:justify-end shrink-0">
                    {isPendingQuote ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setViewDialogOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm cursor-pointer select-none active:scale-[0.98] transition-transform flex items-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Review & Send Quote
                      </Button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setViewDialogOpen(true);
                        }}
                        className="cursor-pointer text-left"
                      >
                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-3xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg select-none hover:opacity-85">
                          Awaiting Response
                        </Badge>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Dialog Design exactly like bookings/page.tsx */}
      <ViewBookingDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        booking={selectedBooking}
        onOpenEdit={handleOpenEdit}
        onStatusChangeOptimistic={handleStatusChangeOptimistic}
        onQuoteSuccess={handleQuoteSuccess}
      />

      <HandoffDialog
        open={handoffOpen}
        onOpenChange={setHandoffOpen}
        generatedLink={generatedLink}
        booking={selectedBooking}
      />
    </Card>
  );
}
