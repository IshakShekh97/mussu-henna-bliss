"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  Send,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  cn,
  getStatusLabel,
  getStatusStyle,
  getWhatsAppLink,
} from "@/lib/utils";
import {
  completeBooking,
  sendBookingQuote,
  updateBookingStatus,
} from "@/app/actions/admin.action";
import { Booking } from "@/lib/zodSchemas";

interface ViewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onOpenEdit: (booking: Booking) => void;
  onStatusChangeOptimistic: (
    id: string,
    status: string,
    price: number,
    time?: string,
  ) => void;
  onQuoteSuccess: (link: string, bookingId: string) => void;
}

export function ViewBookingDialog({
  open,
  onOpenChange,
  booking,
  onOpenEdit,
  onStatusChangeOptimistic,
  onQuoteSuccess,
}: ViewBookingDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Pricing & Negotiation Suite form states
  const [quotedPriceInput, setQuotedPriceInput] = useState("");
  const [proposedTimeInput, setProposedTimeInput] = useState("");
  const [artistNotesInput, setArtistNotesInput] = useState("");

  // Copy indicators state
  const [copiedField, setCopiedField] = useState<
    "phone" | "email" | "link" | null
  >(null);

  // Sync internal state when selected booking shifts
  useEffect(() => {
    if (booking) {
      setQuotedPriceInput(
        booking.quotedPrice ? booking.quotedPrice.toString() : "",
      );
      setArtistNotesInput(booking.artistNotes || "");

      const dateObj = new Date(booking.eventDate);
      const h = dateObj.getHours().toString().padStart(2, "0");
      const m = dateObj.getMinutes().toString().padStart(2, "0");
      setProposedTimeInput(`${h}:${m}`);
    }
  }, [booking]);

  if (!booking) return null;

  const handleCopy = (text: string, field: "phone" | "email" | "link") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      onStatusChangeOptimistic(booking.id, newStatus, booking.quotedPrice || 0);
      const response = await updateBookingStatus(booking.id, newStatus as any);
      if (response.success) {
        toast.success(`Booking status updated to ${getStatusLabel(newStatus)}`);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update status.");
      }
    });
  };

  const handleTransmitQuote = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(quotedPriceInput);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please specify a valid price quote greater than 0.");
      return;
    }

    startTransition(async () => {
      onStatusChangeOptimistic(
        booking.id,
        "QUOTED",
        priceNum,
        proposedTimeInput,
      );

      const response = await sendBookingQuote(
        booking.id,
        priceNum,
        artistNotesInput,
        proposedTimeInput,
      );

      if (response.success && response.booking) {
        const trackingLink = `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://mussu-henna-bliss.vercel.app"
        }/status/booking-${response.booking.id}`;
        onQuoteSuccess(trackingLink, response.booking.id);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to transmit quote.");
      }
    });
  };

  const handleMarkCompleted = () => {
    startTransition(async () => {
      onStatusChangeOptimistic(
        booking.id,
        "COMPLETED",
        booking.quotedPrice || 0,
      );
      const response = await completeBooking(booking.id);
      if (response.success) {
        toast.success("Event marked as completed!");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update event status.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-[#EBE4DC] rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh] no-scrollbar gap-5 max-w-2xl! w-full">
        <DialogHeader className="border-b border-[#EBE4DC]/60 pb-4">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="space-y-1">
              <DialogTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
                {booking.customerName}
              </DialogTitle>
              <DialogDescription className="text-3xs font-mono uppercase text-muted-foreground">
                ID: {booking.id}
              </DialogDescription>
            </div>

            {/* Dropdown status update in view details header */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={isPending}
                  className="focus:outline-hidden cursor-pointer select-none disabled:opacity-50"
                >
                  <Badge
                    className={`${getStatusStyle(
                      booking.status,
                    )} text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 hover:opacity-85`}
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
                    onClick={() => handleStatusChange(item.status)}
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
        </DialogHeader>

        {/* Specs body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF6F0] border border-[#EBE4DC] p-5 rounded-xl text-xs text-[#5C4D3E] my-2">
          {/* Client Contact details */}
          <div className="space-y-3">
            <span className="font-bold block border-b border-[#EBE4DC] pb-1 uppercase text-[10px] tracking-wider text-[#8C7A6B]">
              Client Contact
            </span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                <span className="font-medium">{booking.phone}</span>
              </div>
              <button
                onClick={() => handleCopy(booking.phone, "phone")}
                disabled={isPending}
                className="p-1 hover:bg-[#EBE4DC] rounded text-[#8C7A6B] transition-colors cursor-pointer disabled:opacity-50"
              >
                {copiedField === "phone" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                <span
                  className="font-medium truncate max-w-[170px]"
                  title={booking.email}
                >
                  {booking.email}
                </span>
              </div>
              <button
                onClick={() => handleCopy(booking.email, "email")}
                disabled={isPending}
                className="p-1 hover:bg-[#EBE4DC] rounded text-[#8C7A6B] transition-colors cursor-pointer disabled:opacity-50"
              >
                {copiedField === "email" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>

          {/* Event logistics details */}
          <div className="space-y-3">
            <span className="font-bold text-[#4E3E2F] block border-b border-[#EBE4DC] pb-1 uppercase text-[10px] tracking-wider ">
              Logistics Details
            </span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
              <span>
                {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  weekday: "short",
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
              <span className="truncate max-w-[190px]" title={booking.location}>
                {booking.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
              <span>{booking.guestCount || "N/A"} guests</span>
            </div>
          </div>
        </div>

        {/* Design Notes */}
        {booking.designNotes && (
          <div className="space-y-2 text-xs">
            <span className="font-semibold block text-[10px] uppercase text-[#8C7A6B] tracking-wider">
              Design Vision & Notes:
            </span>
            <p className="italic bg-white p-3 rounded-xl border border-[#EBE4DC] leading-relaxed text-[#4E3E2F] shadow-2xs">
              "{booking.designNotes}"
            </p>
          </div>
        )}

        {/* Negotiation Suite inside Dialog */}
        <div className="border-t border-[#EBE4DC]/60 pt-4 space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#4E3E2F] uppercase tracking-wider">
            Pricing & Actions Suite
          </h3>

          {/* STATE 1: Requested (Pending Quote) */}
          {booking.status === "PENDING_QUOTE" && (
            <form onSubmit={handleTransmitQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="quotedPrice"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Quoted Price (₹)
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <IndianRupee className="h-4 w-4 text-[#8C7A6B]" />
                    </div>
                    <Input
                      id="quotedPrice"
                      type="number"
                      required
                      min="1"
                      placeholder="E.g. 4500"
                      value={quotedPriceInput}
                      onChange={(e) => setQuotedPriceInput(e.target.value)}
                      disabled={isPending}
                      className="pl-9 h-11 border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 focus-visible:border-primary text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="proposedTime"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Propose Different Time Slot
                  </Label>
                  <Input
                    id="proposedTime"
                    type="time"
                    value={proposedTimeInput}
                    onChange={(e) => setProposedTimeInput(e.target.value)}
                    disabled={isPending}
                    className="h-11 border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 focus-visible:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="artistNotes"
                  className="text-xs font-semibold text-[#5C4D3E]"
                >
                  Notes to Client (Optional)
                </Label>
                <Textarea
                  id="artistNotes"
                  placeholder="E.g. Includes travel to venue. Deposit of 50% required to lock the date."
                  value={artistNotesInput}
                  onChange={(e) => setArtistNotesInput(e.target.value)}
                  disabled={isPending}
                  rows={2}
                  className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 focus-visible:border-primary text-xs leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 select-none active:scale-[0.99] transition-transform cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Transmit Custom Quote & Generate Link
              </Button>
            </form>
          )}

          {/* STATE 2: Quoted */}
          {booking.status === "QUOTED" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-1.5 leading-relaxed">
                <span className="font-bold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-700" />
                  Quote of ₹{booking.quotedPrice || "N/A"} transmitted
                  successfully
                </span>
                <p>
                  Awaiting customer deposit payment to lock slot. You can copy
                  the tracking link or dispatch a reminder directly via WhatsApp
                  below.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() =>
                    handleCopy(
                      `${
                        process.env.NEXT_PUBLIC_API_URL ||
                        "https://mussu-henna-bliss.vercel.app"
                      }/status/booking-${booking.id}`,
                      "link",
                    )
                  }
                  className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 flex items-center justify-center gap-1.5 rounded-xl text-xs flex-1 cursor-pointer py-5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </Button>

                <a
                  href={getWhatsAppLink(booking)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-xs select-none active:scale-[0.99] transition-transform text-center flex-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Send Reminder Message
                </a>
              </div>
            </div>
          )}

          {/* STATE 3: Accepted */}
          {booking.status === "ACCEPTED" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  Customer accepted this quote & deposit is paid
                </span>
                <p>
                  Price quote of ₹{booking.quotedPrice || "N/A"} was accepted.
                  This session is locked. Complete the session upon event
                  execution.
                </p>
              </div>

              <Button
                onClick={handleMarkCompleted}
                disabled={isPending}
                className="w-full bg-[#4E3E2F] hover:bg-[#3d3125] text-white font-semibold py-5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs select-none active:scale-[0.99] transition-transform cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Event as Completed
              </Button>
            </div>
          )}

          {/* STATE 4: Completed */}
          {booking.status === "COMPLETED" && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-zinc-600" />
                Event Completed & Archived
              </span>
              <p>
                This session is completed. Details and pricing history are
                stored permanently in the analytics archive.
              </p>
            </div>
          )}

          {/* STATE 5: Cancelled */}
          {booking.status === "CANCELLED" && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Booking Cancelled
              </span>
              <p>
                This booking session is cancelled. You can change its status
                manually using the dropdown in the header if you need to revive
                it.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 border-t border-[#EBE4DC]/60 pt-4 flex gap-2">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => {
              onOpenChange(false);
              onOpenEdit(booking);
            }}
            className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Booking
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={isPending}
              className="bg-[#4E3E2F] hover:bg-[#3d3125] text-white cursor-pointer disabled:opacity-50"
            >
              Close Details
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
