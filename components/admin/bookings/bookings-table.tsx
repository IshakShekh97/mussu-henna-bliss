"use client";

import React from "react";
import { Eye, Pencil, Trash2, Mail, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Booking } from "@/lib/zodSchemas";
import { getStatusLabel, getStatusStyle } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingsTableProps {
  bookings: Booking[];
  onView: (b: Booking) => void;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => void;
  onSendEmail: (b: Booking) => void;
}

export function BookingsTable({
  bookings,
  onView,
  onEdit,
  onDelete,
  onSendEmail,
}: BookingsTableProps) {
  return (
    <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl shadow-sm overflow-hidden w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#FAF6F0]/60 border-b border-[#EBE4DC]/60">
            <TableRow className="hover:bg-transparent border-[#EBE4DC]/60">
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4 pl-6">Client / Occasion</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Event Date & Time</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Location</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Guests</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Price Quoted</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Status</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4 pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="text-center py-12 text-[#8C7A6B]/70 pl-6 pr-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Users className="h-8 w-8 text-[#8C7A6B]/30" />
                    <span className="text-xs font-semibold">No bookings found matching criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const eventDate = new Date(booking.eventDate);
                const formattedDate = eventDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                });
                const formattedTime = eventDate.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow
                    key={booking.id}
                    className="group border-[#EBE4DC]/40 hover:bg-[#FAF6F0]/30 transition-colors"
                  >
                    {/* Client & Occasion */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-xs text-[#4E3E2F] truncate max-w-[150px]">
                          {booking.customerName}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                          {booking.eventType}
                        </span>
                      </div>
                    </TableCell>

                    {/* Event Date & Time */}
                    <TableCell className="py-4 text-xs text-[#5C4D3E]">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="h-3 w-3 text-[#8C7A6B]" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3 text-[#8C7A6B]" />
                          {formattedTime}
                        </span>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-4 text-xs text-[#5C4D3E]">
                      <span className="flex items-center gap-1 max-w-[180px] truncate" title={booking.location}>
                        <MapPin className="h-3 w-3 text-[#8C7A6B] shrink-0" />
                        {booking.location}
                      </span>
                    </TableCell>

                    {/* Guest Count */}
                    <TableCell className="py-4 text-xs text-[#5C4D3E]">
                      <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EBE4DC]/80 font-semibold">
                        {booking.guestCount || "N/A"}
                      </span>
                    </TableCell>

                    {/* Quoted Price */}
                    <TableCell className="py-4 font-bold text-xs text-[#4E3E2F]">
                      {booking.quotedPrice ? `₹${booking.quotedPrice.toLocaleString("en-IN")}` : "—"}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      <Badge
                        className={`${getStatusStyle(
                          booking.status
                        )} text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border`}
                      >
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onView(booking)}
                          title="View Details"
                          className="h-7 w-7 text-[#8C7A6B] hover:text-[#4E3E2F] hover:bg-[#FAF6F0] rounded-md"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(booking)}
                          title="Edit Booking"
                          className="h-7 w-7 text-[#8C7A6B] hover:text-[#4E3E2F] hover:bg-[#FAF6F0] rounded-md"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onSendEmail(booking)}
                          title="Send Email"
                          className="h-7 w-7 text-[#8C7A6B] hover:text-[#4E3E2F] hover:bg-[#FAF6F0] rounded-md"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(booking.id)}
                          title="Delete Booking"
                          className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
