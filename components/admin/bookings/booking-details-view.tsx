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
  ArrowLeft,
  Loader2
} from "lucide-react";

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
  sendBookingEmailAction,
} from "@/app/actions/booking.action";

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date | string;
  location: string;
  guestCount: number | null;
  designNotes: string | null;
  status: "PENDING_QUOTE" | "QUOTED" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  quotedPrice: number | null;
  artistNotes: string | null;
  createdAt: Date | string;
}

interface BookingDetailsViewProps {
  booking: Booking;
}

export function BookingDetailsView({ booking: initialBooking }: BookingDetailsViewProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [isPending, startTransition] = useTransition();

  // Pricing & Negotiation Suite form states
  const [quotedPriceInput, setQuotedPriceInput] = useState("");
  const [proposedTimeInput, setProposedTimeInput] = useState("");
  const [artistNotesInput, setArtistNotesInput] = useState("");

  // Copy indicators state
  const [copiedField, setCopiedField] = useState<"phone" | "email" | "link" | null>(null);

  // Send email states
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const handleOpenEmailDialog = () => {
    let subject = `Mussu's Henna Bliss: Booking Update`;
    const dateStr = new Date(booking.eventDate).toLocaleDateString("en-IN", { dateStyle: "long" });
    const timeStr = new Date(booking.eventDate).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' });
    let body = `Hi ${booking.customerName},\n\nHere is an update regarding your henna booking.\n\nBooking ID: ${booking.id}\nStatus: ${getStatusLabel(booking.status)}\n\nTrack status: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/booking-${booking.id}\n\nBest regards,\nMuskan`;

    if (booking.status === "PENDING_QUOTE") {
      subject = `Mussu's Henna Bliss: Booking Request Received!`;
      body = `Hi ${booking.customerName},\n\nWe have received your henna booking request for the occasion of ${booking.eventType} on ${dateStr}.\n\nMuskan is currently reviewing your design notes and will propose a custom quote shortly.\n\nTrack status: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/booking-${booking.id}\n\nBest regards,\nMuskan`;
    } else if (booking.status === "QUOTED") {
      subject = `Mussu's Henna Bliss: Custom Quote Proposed!`;
      body = `Hi ${booking.customerName},\n\nWe have reviewed your request for ${booking.eventType} on ${dateStr} at ${timeStr}.\n\nCustom Quote Proposed: ₹${booking.quotedPrice || 0}\n\nArtist Notes: ${booking.artistNotes || 'N/A'}\n\nPlease review the quote. You can track status and request revisions here: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/booking-${booking.id}\n\nBest regards,\nMuskan`;
    } else if (booking.status === "ACCEPTED") {
      subject = `Mussu's Henna Bliss: Booking Confirmed! 🎉`;
      body = `Hi ${booking.customerName},\n\nGreat news! Your booking for ${booking.eventType} on ${dateStr} is officially confirmed and locked in our schedule!\n\nEvent Location: ${booking.location}\nEstimated Guests: ${booking.guestCount || 'N/A'}\n\nTrack details: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/booking-${booking.id}\n\nBest regards,\nMuskan`;
    } else if (booking.status === "COMPLETED") {
      subject = `Mussu's Henna Bliss: Thank You! 💖`;
      body = `Hi ${booking.customerName},\n\nThank you for choosing Mussu's Henna Bliss! We had a wonderful time styling your henna for ${booking.eventType}.\n\nWe hope you loved the results! Feel free to share your reviews or photo tags with us.\n\nBest regards,\nMuskan`;
    } else if (booking.status === "CANCELLED") {
      subject = `Mussu's Henna Bliss: Booking Cancellation`;
      body = `Hi ${booking.customerName},\n\nThis email is to notify you that your booking for ${booking.eventType} on ${dateStr} has been cancelled.\n\nIf you have any questions or think this was a mistake, please reach out to us directly on WhatsApp.\n\nBest regards,\nMuskan`;
    }

    setEmailSubject(subject);
    setEmailBody(body);
    setEmailDialogOpen(true);
  };

  const handleSendEmailSubmit = () => {
    if (!emailSubject.trim()) {
      toast.error("Subject is required.");
      return;
    }
    if (!emailBody.trim()) {
      toast.error("Email body is required.");
      return;
    }

    startTransition(async () => {
      const formattedBody = emailBody.replace(/\n/g, "<br/>");
      const res = await sendBookingEmailAction(booking.id, emailSubject, formattedBody);
      if (res.success) {
        toast.success("Email sent successfully!");
        setEmailDialogOpen(false);
      } else {
        toast.error(res.error || "Failed to send email");
      }
    });
  };

  // Sync inputs
  useEffect(() => {
    setQuotedPriceInput(booking.quotedPrice ? booking.quotedPrice.toString() : "");
    setArtistNotesInput(booking.artistNotes || "");

    const dateObj = new Date(booking.eventDate);
    const h = dateObj.getHours().toString().padStart(2, "0");
    const m = dateObj.getMinutes().toString().padStart(2, "0");
    setProposedTimeInput(`${h}:${m}`);
  }, [booking]);

  const handleCopy = (text: string, field: "phone" | "email" | "link") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const response = await updateBookingStatus(booking.id, newStatus as any);
      if (response.success) {
        toast.success(`Booking status updated to ${getStatusLabel(newStatus)}`);
        setBooking(prev => ({ ...prev, status: newStatus as any }));
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
      const response = await sendBookingQuote(
        booking.id,
        priceNum,
        artistNotesInput,
        proposedTimeInput,
      );

      if (response.success && response.booking) {
        toast.success("Quote proposed and WhatsApp trigger fired!");
        setBooking(prev => ({
          ...prev,
          status: "QUOTED",
          quotedPrice: priceNum,
          artistNotes: artistNotesInput || null,
          eventDate: response.booking!.eventDate
        }));
        router.refresh();
      } else {
        toast.error(response.error || "Failed to transmit quote.");
      }
    });
  };

  const handleMarkCompleted = () => {
    startTransition(async () => {
      const response = await completeBooking(booking.id);
      if (response.success) {
        toast.success("Event marked as completed!");
        setBooking(prev => ({ ...prev, status: "COMPLETED" }));
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update event status.");
      }
    });
  };

  const shortId = booking.id.slice(0, 8).toUpperCase();
  const trackingLink = `${
    process.env.NEXT_PUBLIC_API_URL || "https://mussu-henna-bliss.vercel.app"
  }/status/booking-${booking.id}`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/admin/bookings")}
          className="flex items-center gap-1 text-xs text-[#8C7A6B] hover:text-primary font-semibold w-fit transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Booking Pipeline
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EBE4DC] gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#4E3E2F]">
                {booking.customerName}
              </h1>
              <span className="text-3xs font-mono uppercase bg-[#EBE4DC] text-[#4E3E2F] px-2 py-0.5 rounded border border-[#D4C3B3] font-bold">
                ID: {shortId}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Review custom booking occasion, specify quote prices, and monitor confirmation updates.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Dropdown status update */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={isPending}
                  className="focus:outline-hidden cursor-pointer select-none disabled:opacity-50"
                >
                  <Badge
                    className={`${getStatusStyle(
                      booking.status,
                    )} text-3xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border flex items-center gap-1 hover:opacity-85`}
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
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Client & Logistics (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logistics and Contact Details */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider border-b border-[#EBE4DC]/60 pb-3">
              Event logistics & Contacts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-3.5 text-xs">
                <span className="font-bold block uppercase text-[10px] tracking-wider text-[#8C7A6B]">
                  Client Contact
                </span>
                <div className="flex items-center justify-between gap-2 border border-[#EBE4DC]/40 rounded-xl p-3 bg-[#FAF6F0]/30">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#8C7A6B] shrink-0" />
                    <span className="font-medium text-[#4E3E2F]">{booking.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(booking.phone, "phone")}
                    className="p-1 hover:bg-[#FAF6F0] border border-[#EBE4DC] rounded text-[#8C7A6B] transition-colors cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 border border-[#EBE4DC]/40 rounded-xl p-3 bg-[#FAF6F0]/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 text-[#8C7A6B] shrink-0" />
                    <span className="font-medium truncate text-[#4E3E2F]" title={booking.email}>
                      {booking.email}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(booking.email, "email")}
                    className="p-1 hover:bg-[#FAF6F0] border border-[#EBE4DC] rounded text-[#8C7A6B] transition-colors cursor-pointer shrink-0"
                  >
                    {copiedField === "email" ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Logistics */}
              <div className="space-y-3 text-xs text-[#5C4D3E]">
                <span className="font-bold text-[#4E3E2F] block uppercase text-[10px] tracking-wider text-[#8C7A6B]">
                  Logistics Details
                </span>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-[#8C7A6B] shrink-0" />
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
                    <Clock className="h-4 w-4 text-[#8C7A6B] shrink-0" />
                    <span>
                      {new Date(booking.eventDate).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#8C7A6B] shrink-0" />
                    <span className="font-semibold text-[#4E3E2F]">{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#8C7A6B] shrink-0" />
                    <span>{booking.guestCount || "N/A"} estimated guests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Design Notes */}
          {booking.designNotes && (
            <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 shadow-2xs space-y-3 text-xs">
              <span className="font-bold block text-[10px] uppercase text-[#8C7A6B] tracking-wider">
                Design Vision & Client Notes:
              </span>
              <p className="italic bg-[#FAF6F0]/60 p-4 rounded-xl border border-[#EBE4DC]/60 leading-relaxed text-[#4E3E2F] font-medium whitespace-pre-wrap">
                "{booking.designNotes}"
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Quote Engine & General Actions (1 Col) */}
        <div className="space-y-6">
          {/* Pricing Suite */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider border-b border-[#EBE4DC]/60 pb-3">
              Pricing & Quote Engine
            </h3>

            {/* STATE 1: Requested (Pending Quote) */}
            {booking.status === "PENDING_QUOTE" && (
              <form onSubmit={handleTransmitQuote} className="space-y-4">
                <div className="space-y-3">
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
                        className="pl-9 h-11 border-[#EBE4DC] bg-white rounded-xl focus-visible:ring-primary/40 focus-visible:border-primary text-sm font-medium"
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
                      className="h-11 border-[#EBE4DC] bg-white rounded-xl focus-visible:ring-primary/40 focus-visible:border-primary text-sm"
                    />
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
                      rows={3}
                      className="border-[#EBE4DC] bg-white rounded-xl focus-visible:ring-primary/40 focus-visible:border-primary text-xs leading-relaxed"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-6 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 transition-transform active:scale-[0.99]"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Transmit Custom Quote
                </Button>
              </form>
            )}

            {/* STATE 2: Quoted */}
            {booking.status === "QUOTED" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-2 leading-relaxed">
                  <span className="font-bold flex items-center gap-1.5 text-blue-900">
                    <Clock className="h-4 w-4 text-blue-700" />
                    Quote of ₹{booking.quotedPrice || "N/A"} transmitted
                  </span>
                  <p>
                    Awaiting customer deposit payment to lock slot. Send reminder notification directly via WhatsApp or copy tracking link.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleCopy(trackingLink, "link")}
                    className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 flex items-center justify-center gap-1.5 rounded-xl text-xs w-full cursor-pointer h-11"
                  >
                    {copiedField === "link" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy Tracking Link
                  </Button>

                  <a
                    href={getWhatsAppLink(booking as any)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 rounded-xl text-xs shadow-xs select-none active:scale-[0.99] transition-transform text-center w-full"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Send WhatsApp Reminder
                  </a>
                </div>
              </div>
            )}

            {/* STATE 3: Accepted */}
            {booking.status === "ACCEPTED" && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2 leading-relaxed">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    Deposit Confirmed & Locked!
                  </span>
                  <p>
                    Session proposal of ₹{booking.quotedPrice || "N/A"} was accepted by customer. Lock in scheduling and mark complete post event.
                  </p>
                </div>

                <Button
                  onClick={handleMarkCompleted}
                  disabled={isPending}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-6 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs select-none active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Session as Completed
                </Button>
              </div>
            )}

            {/* STATE 4: Completed */}
            {booking.status === "COMPLETED" && (
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-zinc-800">
                  <CheckCircle2 className="h-4 w-4 text-zinc-600" />
                  Event Completed & Archived
                </span>
                <p>
                  This session is completed. Details and pricing history are stored permanently in the analytics archive.
                </p>
              </div>
            )}

            {/* STATE 5: Cancelled */}
            {booking.status === "CANCELLED" && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-rose-800">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  Booking Cancelled
                </span>
                <p>
                  This booking session is cancelled. Use the dropdown in the header status menu if you need to manually revive it.
                </p>
              </div>
            )}
          </div>

          {/* Quick Operations / Communications */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider border-b border-[#EBE4DC]/60 pb-3">
              Operations Center
            </h3>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleOpenEmailDialog}
                disabled={isPending}
                className="w-full bg-[#4E3E2F] hover:bg-[#3d3125] text-white flex items-center justify-center gap-1 cursor-pointer text-xs h-11 font-semibold rounded-xl"
              >
                Send Update Email
              </Button>
              
              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  router.push(`/admin/bookings/${booking.id}/edit`);
                }}
                className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 flex items-center justify-center gap-1 cursor-pointer text-xs h-11 font-semibold rounded-xl"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Full Booking Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Send Email Dialog Modal */}
      {emailDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-3xl p-6 max-w-md w-full mx-4 shadow-xl space-y-4 relative overflow-hidden animate-in fade-in-50 zoom-in-95 text-left">
            <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

            <h3 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-2">
              Send Status Email
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block font-semibold">
                  Current Booking Status
                </span>
                <span className="font-bold text-[#4E3E2F] uppercase text-3xs bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EBE4DC] inline-block mt-0.5">
                  {getStatusLabel(booking.status)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground block font-semibold">
                  Recipient
                </span>
                <span className="font-semibold text-[#4E3E2F]">
                  {booking.email}
                </span>
              </div>

              <div className="space-y-1">
                <label htmlFor="bookingEmailSubject" className="text-[10px] font-semibold text-muted-foreground block">
                  Email Subject
                </label>
                <input
                  id="bookingEmailSubject"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  disabled={isPending}
                  className="w-full p-2 text-xs rounded-lg border border-[#EBE4DC] bg-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-[#4E3E2F] font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="bookingEmailBody" className="text-[10px] font-semibold text-muted-foreground block">
                  Email Content
                </label>
                <textarea
                  id="bookingEmailBody"
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  disabled={isPending}
                  className="w-full p-3 text-xs rounded-lg border border-[#EBE4DC] bg-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-[#4E3E2F] leading-relaxed resize-y font-mono font-medium"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEmailDialogOpen(false);
                  setEmailSubject("");
                  setEmailBody("");
                }}
                disabled={isPending}
                className="flex-1 border-[#EBE4DC] text-[#4E3E2F] rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmailSubmit}
                disabled={isPending}
                className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs cursor-pointer"
              >
                {isPending ? "Sending..." : "Confirm & Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
