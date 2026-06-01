"use client";

import React, {
  useState,
  useTransition,
  useOptimistic,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateBookingStatus } from "@/app/actions/booking.action";

import { PipelineView } from "./pipeline-view";
import { CalendarView } from "./calendar-view";
import { ViewBookingDialog } from "./view-booking-dialog";
import { DeleteBookingDialog } from "./delete-booking-dialog";
import { HandoffDialog } from "./handoff-dialog";
import { Booking } from "@/lib/zodSchemas";
import { getStatusLabel } from "@/lib/utils";

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
  const [filterTab, setFilterTab] = useState<string>("all"); // all | requested | quoted | accepted | completed | cancelled

  // Dialog / Modal states
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedBookingId, setGeneratedBookingId] = useState("");

  // View, Edit, Delete Dialog States
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDeleteId, setBookingToDeleteId] = useState<string | null>(
    null,
  );

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
            if (!isNaN(h) && !isNaN(m)) {
              updatedDate.setHours(h, m, 0, 0);
            }
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

  // Sync state if initialBookings updates
  useEffect(() => {
    setBookings(initialBookings);
    if (initialBookings.length > 0 && !selectedBookingId) {
      setSelectedBookingId(initialBookings[0].id);
    }
  }, [initialBookings, selectedBookingId]);

  // Selected Booking Details resolver
  const selectedBooking =
    optimisticBookings.find((b) => b.id === selectedBookingId) || null;

  // -----------------------------------------
  // Filtering Logic (Left Rail)
  // -----------------------------------------
  const filteredBookings = optimisticBookings.filter((b) => {
    if (filterTab === "requested") return b.status === "PENDING_QUOTE";
    if (filterTab === "quoted") return b.status === "QUOTED";
    if (filterTab === "accepted") return b.status === "ACCEPTED";
    if (filterTab === "completed") return b.status === "COMPLETED";
    if (filterTab === "cancelled") return b.status === "CANCELLED";
    return true; // "all"
  });

  // -----------------------------------------
  // Dialog Open Helpers
  // -----------------------------------------
  const handleOpenView = (booking: Booking) => {
    setSelectedBookingId(booking.id);
    setViewDialogOpen(true);
  };

  const handleOpenEdit = (booking: Booking) => {
    router.push(`/admin/bookings/${booking.id}/edit`);
  };

  const handleOpenDelete = (bookingId: string) => {
    setBookingToDeleteId(bookingId);
    setDeleteDialogOpen(true);
  };

  const handleStatusChangeFromCard = (id: string, nextStatus: string) => {
    startTransition(async () => {
      const targetBooking = bookings.find((b) => b.id === id);
      const currentPrice = targetBooking?.quotedPrice || 0;
      setOptimisticBookings({
        bookingId: id,
        nextStatus,
        nextPrice: currentPrice,
      });

      const response = await updateBookingStatus(id, nextStatus as any);
      if (response.success) {
        toast.success(
          `Booking status updated to ${getStatusLabel(nextStatus)}`,
        );
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update status.");
      }
    });
  };

  const handleQuoteSuccess = (link: string, bookingId: string) => {
    setGeneratedLink(link);
    setGeneratedBookingId(bookingId);
    setViewDialogOpen(false);
    setHandoffOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 📝 SECTION A: Control Top Bar - Redesigned full width tabs */}
      <div className="w-full">
        <Tabs value={viewTab} onValueChange={setViewTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="pipeline"
              className="rounded-lg text-sm font-semibold py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xs text-muted-foreground select-none cursor-pointer"
            >
              Pipeline List View
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="rounded-lg text-sm font-semibold py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xs text-muted-foreground select-none cursor-pointer"
            >
              Calendar Grid View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 📝 SECTION B: Filters & Toolbar - Repositioned status categories and log manual button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FDFBF7] border border-[#EBE4DC] p-4 rounded-2xl shadow-xs">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 md:pb-0 w-full md:w-auto select-none no-scrollbar">
          {[
            { id: "all", label: "All" },
            { id: "requested", label: "Requested" },
            { id: "quoted", label: "Quoted" },
            { id: "accepted", label: "Accepted" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => {
            const count = optimisticBookings.filter((b) => {
              if (tab.id === "all") return true;
              if (tab.id === "requested") return b.status === "PENDING_QUOTE";
              if (tab.id === "quoted") return b.status === "QUOTED";
              if (tab.id === "accepted") return b.status === "ACCEPTED";
              if (tab.id === "completed") return b.status === "COMPLETED";
              if (tab.id === "cancelled") return b.status === "CANCELLED";
              return true;
            }).length;

            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`text-2xs font-bold px-3 py-2 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  filterTab === tab.id
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-[#8C7A6B] border-[#EBE4DC] hover:border-primary/40 hover:bg-[#FAF6F0]/50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    filterTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-[#8C7A6B]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Log Manual Button */}
        <Button
          onClick={() => {
            router.push("/admin/bookings/create");
          }}
          className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs px-4 py-5 shadow-md shadow-primary/10 select-none active:scale-[0.98] transition-transform flex items-center gap-1.5 cursor-pointer w-full md:w-auto justify-center shrink-0"
        >
          <Plus className="h-4 w-4" />
          Log Manual Event
        </Button>
      </div>

      {/* 🎨 DUAL-VIEW SPLIT LAYOUT */}
      {viewTab === "pipeline" ? (
        <PipelineView
          bookings={filteredBookings}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onStatusChange={handleStatusChangeFromCard}
          isPending={isPending}
        />
      ) : (
        <CalendarView bookings={optimisticBookings} onView={handleOpenView} />
      )}

      {/* 🛠️ INTERACTIVE MECHANICS DIALOGS */}

      {/* Detail Dialog */}
      <ViewBookingDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        booking={selectedBooking}
        onOpenEdit={handleOpenEdit}
        onStatusChangeOptimistic={(bookingId, status, price, time) => {
          setOptimisticBookings({
            bookingId,
            nextStatus: status,
            nextPrice: price,
            nextTime: time,
          });
        }}
        onQuoteSuccess={handleQuoteSuccess}
      />



      {/* Delete Confirmation Dialog */}
      <DeleteBookingDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        bookingId={bookingToDeleteId}
        onSuccess={(deletedId) => {
          setBookingToDeleteId(null);
          setSelectedBookingId(
            bookings.find((b) => b.id !== deletedId)?.id || null,
          );
        }}
      />

      {/* 🎉 Handoff Quote Generated Success Dialog */}
      <HandoffDialog
        open={handoffOpen}
        onOpenChange={setHandoffOpen}
        generatedLink={generatedLink}
        booking={selectedBooking}
      />
    </div>
  );
}
