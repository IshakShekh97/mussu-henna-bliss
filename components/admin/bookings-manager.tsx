"use client";

import React, { useState, useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  Mail,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Send,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageSquare,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  createBooking,
  completeBooking,
  deleteBooking,
  sendBookingQuote,
} from "@/app/actions/admin.action";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  manualBookingSchema,
  type manualBookingSchemaType,
} from "@/lib/zodSchemas";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { DateTimePicker } from "@/components/book/DateTimePicker";

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date | string;
  location: string;
  guestCount?: number | null;
  designNotes?: string | null;
  quotedPrice?: number | null;
  artistNotes?: string | null;
  status: string; // PENDING_QUOTE, QUOTED, ACCEPTED, COMPLETED, CANCELLED
  createdAt: Date | string;
}

interface BookingsManagerProps {
  initialBookings: Booking[];
}

export function BookingsManager({ initialBookings }: BookingsManagerProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    initialBookings.length > 0 ? initialBookings[0].id : null,
  );

  // Tabs states
  const [viewTab, setViewTab] = useState<string>("pipeline"); // pipeline | calendar
  const [filterTab, setFilterTab] = useState<string>("all"); // all | requested | quoted | booked

  // Month navigation for Calendar View
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Input states for Pricing & Negotiation Suite
  const [quotedPriceInput, setQuotedPriceInput] = useState("");
  const [proposedTimeInput, setProposedTimeInput] = useState("");
  const [artistNotesInput, setArtistNotesInput] = useState("");

  // Dialog / Modal states
  const [manualLogOpen, setManualLogOpen] = useState(false);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedBookingId, setGeneratedBookingId] = useState("");

  // Copy indicators
  const [copiedField, setCopiedField] = useState<
    "phone" | "email" | "link" | null
  >(null);

  // Transition & Server Action States
  const [isPending, startTransition] = useTransition();

  // Optimistic UI updates state
  const [optimisticBookings, setOptimisticBookings] = useOptimistic(
    bookings,
    (
      state,
      update: {
        bookingId: string;
        nextStatus: string;
        nextPrice: number;
        nextTime?: string;
      },
    ) =>
      state.map((b) => {
        if (b.id === update.bookingId) {
          let updatedDate = new Date(b.eventDate);
          if (update.nextTime) {
            const [h, m] = update.nextTime.split(":").map(Number);
            updatedDate.setHours(h, m, 0, 0);
          }
          return {
            ...b,
            status: update.nextStatus,
            quotedPrice: update.nextPrice,
            eventDate: updatedDate,
          };
        }
        return b;
      }),
  );

  // Manual creation form hook with react-hook-form and zod
  const manualForm = useForm<manualBookingSchemaType>({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      eventType: "Bridal",
      date: undefined,
      time: "12:00",
      location: "",
      guestCount: undefined,
      designNotes: "",
      status: "PENDING_QUOTE",
      quotedPrice: undefined,
      artistNotes: "",
    },
    mode: "onChange",
  });

  // Sync state if initialBookings updates
  React.useEffect(() => {
    setBookings(initialBookings);
    if (initialBookings.length > 0 && !selectedBookingId) {
      setSelectedBookingId(initialBookings[0].id);
    }
  }, [initialBookings]);

  // Selected Booking Details resolver
  const selectedBooking =
    optimisticBookings.find((b) => b.id === selectedBookingId) || null;

  const selectedBookingDateStr = selectedBooking?.eventDate
    ? new Date(selectedBooking.eventDate).toISOString()
    : "";

  // Set inputs when selected booking shifts
  React.useEffect(() => {
    if (selectedBooking) {
      setQuotedPriceInput(
        selectedBooking.quotedPrice
          ? selectedBooking.quotedPrice.toString()
          : "",
      );
      setArtistNotesInput(selectedBooking.artistNotes || "");

      const dateObj = new Date(selectedBooking.eventDate);
      const h = dateObj.getHours().toString().padStart(2, "0");
      const m = dateObj.getMinutes().toString().padStart(2, "0");
      setProposedTimeInput(`${h}:${m}`);
    }
  }, [
    selectedBookingId,
    selectedBooking?.quotedPrice,
    selectedBooking?.artistNotes,
    selectedBookingDateStr,
  ]);

  // -----------------------------------------
  // Clipboard Copy Utility
  // -----------------------------------------
  const handleCopy = (text: string, field: "phone" | "email" | "link") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // -----------------------------------------
  // Filtering Logic (Left Rail)
  // -----------------------------------------
  const filteredBookings = optimisticBookings.filter((b) => {
    if (filterTab === "requested") return b.status === "PENDING_QUOTE";
    if (filterTab === "quoted") return b.status === "QUOTED";
    if (filterTab === "booked")
      return b.status === "ACCEPTED" || b.status === "COMPLETED";
    return true; // "all"
  });

  // -----------------------------------------
  // Calendar Grid Builder Logic
  // -----------------------------------------
  const buildCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekDay = firstDay.getDay(); // 0: Sun, 1: Mon
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Fill prev month days padding
    for (let i = startWeekDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Fill current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Pad next month days to fit exactly 42 slots (6 weeks)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = buildCalendarDays();

  // Navigation handlers for calendar month
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };
  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // -----------------------------------------
  // Server Action Triggers (CRUD)
  // -----------------------------------------

  // 1. Manual Creation Submit
  const onManualSubmit = (data: manualBookingSchemaType) => {
    // Parse event date and time together
    const dateObj = new Date(data.date);
    const [h, m] = data.time.split(":").map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      dateObj.setHours(h, m, 0, 0);
    }

    startTransition(async () => {
      const response = await createBooking({
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: dateObj.toISOString(),
        location: data.location,
        guestCount: data.guestCount,
        designNotes: data.designNotes || undefined,
        status: data.status,
        quotedPrice: data.quotedPrice || undefined,
        artistNotes: data.artistNotes || undefined,
      });

      if (response.success && response.booking) {
        toast.success("Manual booking logged successfully!");
        setManualLogOpen(false);
        manualForm.reset();
        setSelectedBookingId(response.booking.id);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to save booking.");
      }
    });
  };

  // 2. Transmit Custom Quote (State 1)
  const handleTransmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const priceNum = parseFloat(quotedPriceInput);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please specify a valid price quote greater than 0.");
      return;
    }

    // Optimistic UI updates status to QUOTED instantly
    startTransition(async () => {
      setOptimisticBookings({
        bookingId: selectedBooking.id,
        nextStatus: "QUOTED",
        nextPrice: priceNum,
        nextTime: proposedTimeInput,
      });

      const response = await sendBookingQuote(
        selectedBooking.id,
        priceNum,
        artistNotesInput,
        proposedTimeInput,
      );

      if (response.success && response.booking) {
        setGeneratedLink(
          `localhost:3000/status/booking-${response.booking.id}`,
        );
        setGeneratedBookingId(response.booking.id);
        setHandoffOpen(true);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to transmit quote.");
      }
    });
  };

  // 3. Mark completed (State 3)
  const handleMarkCompleted = () => {
    if (!selectedBooking) return;

    startTransition(async () => {
      const response = await completeBooking(selectedBooking.id);
      if (response.success) {
        toast.success("Event marked as completed!");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update event status.");
      }
    });
  };

  // 4. Delete/Cancel Event
  const handleDeleteBooking = () => {
    if (!selectedBooking) return;

    if (
      !confirm(
        "Are you sure you want to permanently delete this booking record?",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const response = await deleteBooking(selectedBooking.id);
      if (response.success) {
        toast.success("Booking record deleted successfully.");
        setSelectedBookingId(
          bookings.find((b) => b.id !== selectedBooking.id)?.id || null,
        );
        router.refresh();
      } else {
        toast.error(response.error || "Failed to delete record.");
      }
    });
  };

  const getStatusStyle = (status: string) => {
    if (status === "PENDING_QUOTE")
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "QUOTED") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "ACCEPTED")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "COMPLETED")
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    return "bg-rose-50 text-rose-700 border-rose-200"; // Cancelled / Fallback
  };

  const getStatusLabel = (status: string) => {
    if (status === "PENDING_QUOTE") return "Requested";
    if (status === "QUOTED") return "Quoted";
    if (status === "ACCEPTED") return "Accepted";
    if (status === "COMPLETED") return "Completed";
    return status;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 📝 SECTION A: Control Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FDFBF7] border border-[#EBE4DC] p-4 rounded-2xl shadow-xs">
        <Tabs value={viewTab} onValueChange={setViewTab} className="w-fit">
          <TabsList className="bg-[#FAF6F0] border border-[#EBE4DC] p-1 h-10 rounded-xl">
            <TabsTrigger
              value="pipeline"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-[#FDFBF7] data-[state=active]:text-[#4E3E2F] data-[state=active]:shadow-xs text-muted-foreground select-none cursor-pointer"
            >
              Pipeline List View
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-[#FDFBF7] data-[state=active]:text-[#4E3E2F] data-[state=active]:shadow-xs text-muted-foreground select-none cursor-pointer"
            >
              Calendar Grid View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Manual Log trigger */}
        <Button
          onClick={() => {
            manualForm.reset();
            setManualLogOpen(true);
          }}
          className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs px-4 py-5 shadow-md shadow-primary/10 select-none active:scale-[0.98] transition-transform flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Log Manual Event
        </Button>
      </div>

      {/* 🎨 DUAL-VIEW SPLIT LAYOUT */}
      {viewTab === "pipeline" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 📝 SECTION B: Left Rail List View */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-4 shadow-xs flex flex-col gap-3">
              {/* Filter tabs list */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 select-none">
                {[
                  { id: "all", label: "All" },
                  { id: "requested", label: "Requested" },
                  { id: "quoted", label: "Quoted" },
                  { id: "booked", label: "Booked" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className={`text-2xs font-bold px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                      filterTab === tab.id
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-white text-[#8C7A6B] border-[#EBE4DC] hover:border-primary/40 hover:bg-[#FAF6F0]/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Pipeline List Cards */}
              <div className="flex flex-col gap-3 mt-2 max-h-[550px] overflow-y-auto pr-1 no-scrollbar">
                {filteredBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-[#8C7A6B]">
                    <CheckCircle2 className="h-8 w-8 text-[#8C7A6B]/40 mb-2" />
                    <span className="font-semibold text-xs">
                      No bookings found
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      No records match the active filter.
                    </span>
                  </div>
                ) : (
                  filteredBookings.map((b) => {
                    const isSelected = b.id === selectedBookingId;
                    const dateFormatted = new Date(
                      b.eventDate,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    });

                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBookingId(b.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                          isSelected
                            ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/40"
                            : "bg-white border-[#EBE4DC] hover:border-[#D4C3B3] hover:shadow-xs"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold text-xs text-[#4E3E2F] truncate">
                            {b.customerName}
                          </span>
                          <Badge
                            className={`${getStatusStyle(b.status)} text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-md border shrink-0`}
                          >
                            {getStatusLabel(b.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-4xs text-[#8C7A6B] uppercase font-bold tracking-wide">
                          <span>{b.eventType}</span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {dateFormatted}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 📝 SECTION C: Right Canvas Detail Panel */}
          <div className="lg:col-span-2">
            {!selectedBooking ? (
              <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs p-12 text-center flex flex-col items-center justify-center text-[#8C7A6B]">
                <CalendarIcon className="h-10 w-10 text-[#8C7A6B]/30 mb-2" />
                <span className="font-serif font-bold text-lg text-[#4E3E2F]">
                  No Booking Selected
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Select a card on the left list view to display specs.
                </span>
              </Card>
            ) : (
              <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs p-6 flex flex-col gap-6 relative">
                {/* Trash button to delete booking record */}
                <button
                  onClick={handleDeleteBooking}
                  className="absolute top-6 right-6 p-2 rounded-lg border border-[#EBE4DC] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-[#8C7A6B] cursor-pointer"
                  title="Delete booking record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Details Header */}
                <div className="border-b border-[#EBE4DC]/60 pb-5 space-y-1.5 pr-10">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-serif text-2xl font-bold text-[#4E3E2F]">
                      {selectedBooking.customerName}
                    </h2>
                    <Badge
                      className={`${getStatusStyle(selectedBooking.status)} text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border`}
                    >
                      {getStatusLabel(selectedBooking.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Record ID:{" "}
                    <span className="font-mono text-3xs">
                      {selectedBooking.id}
                    </span>
                  </p>
                </div>

                {/* 1. Core Event Spec Sheet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF6F0] border border-[#EBE4DC] p-5 rounded-xl text-xs text-[#5C4D3E]">
                  {/* Customer Core details */}
                  <div className="space-y-3.5">
                    <span className="font-bold block border-b border-[#EBE4DC] pb-1 uppercase text-[10px] tracking-wider text-[#8C7A6B]">
                      Client Contact
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                        <span className="font-medium">
                          {selectedBooking.phone}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(selectedBooking.phone, "phone")
                        }
                        className="p-1 hover:bg-[#EBE4DC] rounded text-[#8C7A6B] transition-colors cursor-pointer"
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
                        <span className="font-medium truncate max-w-[170px]">
                          {selectedBooking.email}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(selectedBooking.email, "email")
                        }
                        className="p-1 hover:bg-[#EBE4DC] rounded text-[#8C7A6B] transition-colors cursor-pointer"
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
                  <div className="space-y-3.5">
                    <span className="font-bold text-[#4E3E2F] block border-b border-[#EBE4DC] pb-1 uppercase text-[10px] tracking-wider ">
                      Logistics Details
                    </span>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                      <span>
                        {new Date(selectedBooking.eventDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            weekday: "short",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                      <span>
                        {new Date(selectedBooking.eventDate).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                      <span
                        className="truncate max-w-[200px]"
                        title={selectedBooking.location}
                      >
                        {selectedBooking.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                      <span>
                        {selectedBooking.guestCount || "N/A"} people needing
                        henna
                      </span>
                    </div>
                  </div>
                </div>

                {/* Design notes */}
                {selectedBooking.designNotes && (
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold block text-[10px] uppercase text-[#8C7A6B] tracking-wider">
                      Design Vision & Notes:
                    </span>
                    <p className="italic bg-white p-3 rounded-xl border border-[#EBE4DC] leading-relaxed text-[#4E3E2F] shadow-2xs">
                      "{selectedBooking.designNotes}"
                    </p>
                  </div>
                )}

                {/* 2. Pricing & Negotiation Suite */}
                <div className="border-t border-[#EBE4DC]/60 pt-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#4E3E2F]">
                    Pricing & Negotiation Suite
                  </h3>

                  {/* STATE 1: Requested (Pending Quote) */}
                  {selectedBooking.status === "PENDING_QUOTE" && (
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
                              onChange={(e) =>
                                setQuotedPriceInput(e.target.value)
                              }
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
                            onChange={(e) =>
                              setProposedTimeInput(e.target.value)
                            }
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
                        Transmit Custom Quote
                      </Button>
                    </form>
                  )}

                  {/* STATE 2: Quoted */}
                  {selectedBooking.status === "QUOTED" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-1.5 leading-relaxed">
                        <span className="font-bold flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-blue-700" />
                          Quote of ₹{selectedBooking.quotedPrice || "N/A"}{" "}
                          transmitted successfully
                        </span>
                        <p>
                          Awaiting customer action. The customer has received
                          their live tracking link and is reviewing the quote.
                        </p>
                      </div>

                      {/* Manual WhatsApp Dispatch Button */}
                      <a
                        href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hi ${selectedBooking.customerName}, Muskan here from Mussu's Henna Bliss! ✨ Just checking in regarding your henna booking request. You can review the quote and track status here: http://localhost:3000/status/booking-${selectedBooking.id}`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-xs select-none active:scale-[0.99] transition-transform text-center"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Send WhatsApp Reminder
                      </a>
                    </div>
                  )}

                  {/* STATE 3: Accepted */}
                  {selectedBooking.status === "ACCEPTED" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1.5">
                        <span className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                          Customer accepted this quote
                        </span>
                        <p>
                          Price quote of ₹{selectedBooking.quotedPrice || "N/A"}{" "}
                          was accepted. This session is locked. Complete the
                          session upon event execution.
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
                  {selectedBooking.status === "COMPLETED" && (
                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 space-y-1.5">
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-zinc-600" />
                        Event Completed & Archived
                      </span>
                      <p>
                        This session is completed. Details and pricing history
                        are stored permanently in the analytics archive.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* 📝 SECTION A: Calendar Grid View */
        <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-5 shadow-xs">
          {/* Calendar Month Navigation Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl font-bold text-[#4E3E2F]">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                className="h-9 w-9 border-[#EBE4DC] hover:bg-[#FAF6F0]/50 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-[#8C7A6B]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                className="h-9 w-9 border-[#EBE4DC] hover:bg-[#FAF6F0]/50 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-[#8C7A6B]" />
              </Button>
            </div>
          </div>

          {/* Grid Layout of Days */}
          <div className="grid grid-cols-7 gap-2 text-center font-semibold text-xs text-[#8C7A6B] border-b border-[#EBE4DC]/60 pb-3 mb-2 select-none">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              // Find bookings on this day
              const dayBookings = optimisticBookings.filter((b) => {
                const bDate = new Date(b.eventDate);
                return (
                  bDate.getDate() === date.getDate() &&
                  bDate.getMonth() === date.getMonth() &&
                  bDate.getFullYear() === date.getFullYear()
                );
              });

              return (
                <div
                  key={index}
                  className={`min-h-[90px] border border-[#EBE4DC]/50 rounded-xl p-2 flex flex-col gap-1.5 transition-all text-left ${
                    isCurrentMonth
                      ? "bg-white"
                      : "bg-[#FAF6F0]/30 text-muted-foreground/60"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold ${isCurrentMonth ? "text-[#4E3E2F]" : "text-muted-foreground/50"}`}
                  >
                    {date.getDate()}
                  </span>

                  {/* Badge elements of bookings for this day */}
                  <div className="flex flex-col gap-1 overflow-y-auto max-h-[70px] no-scrollbar">
                    {dayBookings.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setViewTab("pipeline");
                        }}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border text-left truncate cursor-pointer block select-none ${getStatusStyle(
                          b.status,
                        )}`}
                      >
                        {b.customerName.split(" ")[0]} (
                        {b.eventType.split(" ")[0]})
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🛠️ 3. INTERACTIVE MECHANICS DIALOGS */}

      {/* Manual Booking Log Dialog */}
      <Dialog open={manualLogOpen} onOpenChange={setManualLogOpen}>
        <DialogContent className="border border-[#EBE4DC] rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh] no-scrollbar gap-5 max-w-3xl! w-full">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-[#4E3E2F] flex items-center gap-2">
              <span className="text-primary font-bold">✨</span> Log Manual
              Event
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log phone-in, walk-in, or cash-based custom event requests.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={manualForm.handleSubmit(onManualSubmit)}
            className="space-y-5 mt-2 w-full"
          >
            {/* Row 1: Customer Name & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="customerName"
                control={manualForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="manual-name"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Customer Name *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="manual-name"
                      placeholder="Enter name"
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={manualForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="manual-phone"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Phone Number *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="manual-phone"
                      placeholder="E.g. +91 98765 43210"
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Row 2: Email Address & Event Occasion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="email"
                control={manualForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="manual-email"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Email Address *
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      id="manual-email"
                      placeholder="customer@email.com"
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="eventType"
                control={manualForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="manual-type"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Event Occasion *
                    </FieldLabel>
                    <select
                      {...field}
                      id="manual-type"
                      className="w-full px-3 h-10 border border-[#EBE4DC] bg-white rounded-lg text-xs focus-visible:ring-primary/40"
                    >
                      <option value="Bridal">Bridal Mehndi</option>
                      <option value="Sangeet">Sangeet Party</option>
                      <option value="Guest">Guest Mehndi</option>
                      <option value="Festive">Festive Mehndi</option>
                      <option value="Photoshoot">Photoshoot / Other</option>
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Row 3: Date & Time Picker */}
            <div className="w-full">
              <Controller
                name="date"
                control={manualForm.control}
                render={({ field: dateField, fieldState: dateState }) => (
                  <Controller
                    name="time"
                    control={manualForm.control}
                    render={({ field: timeField, fieldState: timeState }) => (
                      <DateTimePicker
                        date={dateField.value}
                        onDateChange={dateField.onChange}
                        time={timeField.value}
                        onTimeChange={timeField.onChange}
                        dateError={dateState.error}
                        timeError={timeState.error}
                      />
                    )}
                  />
                )}
              />
            </div>

            {/* Row 4: Venue Location & Guest Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="location"
                control={manualForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="manual-location"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Venue Location *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="manual-location"
                      placeholder="E.g. Salt Lake Sector V, Kolkata"
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="guestCount"
                control={manualForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="manual-guests"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Guest Count
                    </FieldLabel>
                    <Input
                      id="manual-guests"
                      type="number"
                      min="1"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Row 5: Design Notes */}
            <Controller
              name="designNotes"
              control={manualForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="manual-design"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Design Notes
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="manual-design"
                    placeholder="Specify design details..."
                    rows={2}
                    className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs leading-relaxed"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Row 6: Log Ledger Settings */}
            <div className="border-t border-[#EBE4DC]/60 pt-4 space-y-4">
              <span className="font-bold text-[10px] text-[#8C7A6B] uppercase tracking-wider block">
                Log Ledger Settings
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Initial Status */}
                <Controller
                  name="status"
                  control={manualForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="manual-status"
                        className="text-xs font-semibold text-[#5C4D3E]"
                      >
                        Initial Status
                      </FieldLabel>
                      <select
                        {...field}
                        id="manual-status"
                        className="w-full px-3 h-10 border border-[#EBE4DC] bg-white rounded-lg text-xs focus-visible:ring-primary/40"
                      >
                        <option value="PENDING_QUOTE">Requested</option>
                        <option value="ACCEPTED">Accepted (Booked)</option>
                      </select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Quoted Price */}
                <Controller
                  name="quotedPrice"
                  control={manualForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="manual-price"
                        className="text-xs font-semibold text-[#5C4D3E]"
                      >
                        Quoted Price (₹)
                      </FieldLabel>
                      <Input
                        id="manual-price"
                        type="number"
                        placeholder="E.g. 5000"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-primary/95 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🎉 Handoff Quote Generated Success Dialog */}
      <Dialog open={handoffOpen} onOpenChange={setHandoffOpen}>
        <DialogContent className="max-w-md bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-6 shadow-lg text-center gap-5">
          <DialogHeader className="items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-2">
              <Sparkles className="h-6 w-6 text-emerald-600 animate-pulse" />
            </div>
            <DialogTitle className="font-serif text-2xl font-bold text-[#4E3E2F]">
              🎉 Quote Generated Successfully
            </DialogTitle>
            <DialogDescription className="text-xs">
              Live tracking link generated for custom price quotes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-[#FAF6F0] border border-[#EBE4DC] p-3.5 rounded-xl font-mono text-2xs text-[#4E3E2F] select-all break-all flex justify-between items-center gap-2">
              <span>{generatedLink}</span>
              <button
                onClick={() => handleCopy(generatedLink, "link")}
                className="p-1.5 hover:bg-[#EBE4DC] rounded text-[#8C7A6B] transition-colors shrink-0 cursor-pointer"
                title="Copy tracking link"
              >
                {copiedField === "link" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => handleCopy(generatedLink, "link")}
                className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 flex items-center justify-center gap-1.5 rounded-xl text-xs py-5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Link
              </Button>
              <a
                href={`https://wa.me/${(selectedBooking?.phone ?? "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hi ${selectedBooking?.customerName}, Muskan here from Mussu's Henna Bliss! ✨ I have reviewed your request for ${selectedBooking?.eventType}. Here is your custom quote: ₹${quotedPriceInput}. Review details and track your booking status here: http://${generatedLink}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-xs items-center justify-center gap-1.5 select-none active:scale-[0.99] transition-transform text-center"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Open WhatsApp Dispatch Tool
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple loader helper
function Loader2({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
