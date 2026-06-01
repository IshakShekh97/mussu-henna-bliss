"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteBooking } from "@/app/actions/booking.action";
import Loader2 from "./loader";

interface DeleteBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string | null;
  onSuccess: (deletedId: string) => void;
}

export function DeleteBookingDialog({
  open,
  onOpenChange,
  bookingId,
  onSuccess,
}: DeleteBookingDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const confirmDelete = () => {
    if (!bookingId) return;

    startTransition(async () => {
      const response = await deleteBooking(bookingId);
      if (response.success) {
        toast.success("Booking record deleted successfully.");
        onOpenChange(false);
        onSuccess(bookingId);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to delete record.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-[#EBE4DC] rounded-2xl p-6 shadow-lg text-center gap-5">
        <DialogHeader className="items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-200 mb-2">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
          <DialogTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
            Delete Booking Record?
          </DialogTitle>
          <DialogDescription className="text-xs mt-1 leading-relaxed">
            Are you sure you want to permanently delete this booking request?
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-4 w-full">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => {
              onOpenChange(false);
            }}
            className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 flex-1 py-5 rounded-xl cursor-pointer disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={confirmDelete}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold flex-1 py-5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4" />
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Record
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
