"use client";

import React from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Eye,
  Pencil,
  MessageSquare,
  Trash2,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cn,
  getStatusLabel,
  getStatusStyle,
  getWhatsAppLink,
} from "@/lib/utils";
import { Booking } from "@/lib/zodSchemas";

interface BookingCardProps {
  booking: Booking;
  onView: (b: Booking) => void;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nextStatus: string) => void;
  isPending: boolean;
}

export function BookingCard({
  booking,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  isPending,
}: BookingCardProps) {
  return (
    <Card className="bg-[#FDFBF7] border-[#EBE4DC] hover:border-[#D4C3B3] hover:shadow-md transition-all flex flex-col rounded-2xl overflow-hidden shadow-xs relative">
      <CardHeader className="pb-3 border-b border-[#EBE4DC]/50">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-[#8C7A6B] font-bold block">
              {booking.eventType}
            </span>
            <h3
              className="font-serif font-bold text-base text-[#4E3E2F] truncate max-w-[160px]"
              title={booking.customerName}
            >
              {booking.customerName}
            </h3>
          </div>

          {/* Interactive Status Badge dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isPending}
                className="focus:outline-hidden cursor-pointer select-none disabled:opacity-50"
              >
                <Badge
                  className={`${getStatusStyle(
                    booking.status,
                  )} text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md border flex items-center gap-1 hover:opacity-85`}
                >
                  {getStatusLabel(booking.status)}
                  <span className="text-[7px] opacity-70">▼</span>
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-[#EBE4DC] rounded-xl p-1 shadow-md min-w-36"
            >
              <DropdownMenuLabel className="text-4xs uppercase tracking-wider text-[#8C7A6B] px-2 py-1.5 font-bold">
                Change Status
              </DropdownMenuLabel>
              {[
                { status: "PENDING_QUOTE", label: "Requested" },
                { status: "QUOTED", label: "Quoted" },
                { status: "ACCEPTED", label: "Accepted" },
                { status: "COMPLETED", label: "Completed" },
                { status: "CANCELLED", label: "Cancelled" },
              ].map((item) => (
                <DropdownMenuItem
                  key={item.status}
                  disabled={booking.status === item.status || isPending}
                  onClick={() => onStatusChange(booking.id, item.status)}
                  className={cn(
                    "text-xs px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[#FAF6F0] text-[#4E3E2F] flex items-center justify-between",
                    booking.status === item.status &&
                      "font-bold bg-[#FAF6F0] pointer-events-none",
                  )}
                >
                  <span>{item.label}</span>
                  {booking.status === item.status && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-3 flex-1 flex flex-col gap-3 text-xs text-[#5C4D3E]">
        {/* Basic details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
            <span>
              {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
            <span>
              {new Date(booking.eventDate).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
            <span className="truncate" title={booking.location}>
              {booking.location}
            </span>
          </div>
        </div>

        {/* Price, Guest Count */}
        <div className="border-t border-[#EBE4DC]/50 pt-3 mt-1 flex justify-between items-center text-3xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
          <span>{booking.guestCount || "N/A"} GUESTS</span>
          <span className="text-[#4E3E2F] font-bold text-xs font-serif">
            {booking.quotedPrice ? `₹${booking.quotedPrice}` : "No Quote Yet"}
          </span>
        </div>
      </CardContent>

      {/* Actions footer */}
      <div className="bg-[#FAF6F0] px-4 py-3 border-t border-[#EBE4DC]/50 flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(booking)}
          className="border-[#EBE4DC] bg-white hover:bg-[#FAF6F0]/50 text-xs px-2.5 h-8 rounded-lg cursor-pointer flex items-center gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(booking)}
          className="border-[#EBE4DC] bg-white hover:bg-[#FAF6F0]/50 text-xs px-2.5 h-8 rounded-lg cursor-pointer flex items-center gap-1"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>

        {/* WhatsApp action */}
        <a
          href={getWhatsAppLink(booking)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1 border border-[#EBE4DC] bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-xs px-2.5 h-8 rounded-lg cursor-pointer transition-colors text-center text-[#5c4d3e]"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          WhatsApp
        </a>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(booking.id)}
          className="border-[#EBE4DC] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 bg-white text-xs px-2.5 h-8 rounded-lg cursor-pointer flex items-center gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
