"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendBookingQuote } from "@/app/actions/booking.action";

interface BookingQuoteDialogProps {
  booking: {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate: Date | string;
    location: string;
    guestCount?: number | null;
    designNotes?: string | null;
    status: string;
  };
}

export function BookingQuoteDialog({ booking }: BookingQuoteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [artistNotes, setArtistNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price quote greater than 0.");
      return;
    }

    startTransition(async () => {
      const result = await sendBookingQuote(booking.id, priceNum, artistNotes);
      if (result.success) {
        toast.success(
          `Quote of ₹${priceNum} sent to ${booking.customerName}!`,
          {
            description: "A WhatsApp notification has been simulated in logs.",
          },
        );
        setOpen(false);
        setPrice("");
        setArtistNotes("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to submit quote.");
      }
    });
  };

  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm cursor-pointer select-none active:scale-[0.98] transition-transform flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Review & Send Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl overflow-hidden p-6 gap-5 shadow-lg">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="font-serif text-2xl font-bold text-[#4E3E2F] flex items-center gap-2">
            <span className="text-primary font-bold">✨</span> Create Package
            Quote
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Review event details and send a WhatsApp tracking quote to the
            client.
          </p>
        </DialogHeader>

        {/* Event details summary */}
        <div className="space-y-3.5 bg-[#FAF6F0] border border-[#EBE4DC] rounded-xl p-4 text-[#5C4D3E] text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE4DC]/60">
            <span className="font-bold text-sm text-[#4E3E2F]">
              {booking.customerName}
            </span>
            <span className="uppercase text-[9px] font-extrabold tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {booking.eventType}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
              <span>{formatDate(booking.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
              <span className="truncate">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
              <span>{booking.guestCount || 1} people needing henna</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
              <span>{booking.phone}</span>
            </div>
          </div>

          {booking.designNotes && (
            <div className="mt-2.5 pt-2.5 border-t border-[#EBE4DC]/60">
              <span className="font-semibold block mb-1 text-[10px] uppercase text-[#8C7A6B] tracking-wider">
                Design Vision:
              </span>
              <p className="italic bg-white/60 p-2 rounded-lg border border-[#EBE4DC]/40 max-h-24 overflow-y-auto leading-relaxed text-[#4E3E2F]">
                "{booking.designNotes}"
              </p>
            </div>
          )}
        </div>

        {/* Input fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="dialog-price"
              className="text-sm font-semibold text-[#4E3E2F]"
            >
              Quoted Package Price (₹)
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee className="h-4 w-4 text-[#8C7A6B]" />
              </div>
              <Input
                id="dialog-price"
                type="number"
                required
                min="1"
                placeholder="E.g., 4500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-9 h-11 border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 focus-visible:border-primary text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="dialog-notes"
              className="text-sm font-semibold text-[#4E3E2F]"
            >
              Artist Notes (Optional)
            </Label>
            <Textarea
              id="dialog-notes"
              placeholder="E.g., 'Includes bridal organic cones and travel expenses. Standard application time is 4 hours.'"
              value={artistNotes}
              onChange={(e) => setArtistNotes(e.target.value)}
              rows={3}
              className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 focus-visible:border-primary text-sm leading-relaxed"
            />
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 hover:text-foreground"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/95 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-primary/10 select-none active:scale-[0.99] transition-transform"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Quote...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Quote
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
