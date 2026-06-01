"use client";

import React, { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { DateTimePicker } from "@/components/book/DateTimePicker";

import { updateBooking } from "@/app/actions/booking.action";
import Loader2 from "./loader";
import {
  Booking,
  editBookingSchema,
  editBookingSchemaType,
} from "@/lib/zodSchemas";

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onSuccess: () => void;
}

export function EditBookingDialog({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: EditBookingDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<editBookingSchemaType>({
    resolver: zodResolver(editBookingSchema),
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

  // Sync state when selected booking shifts or modal opens
  useEffect(() => {
    if (booking && open) {
      const dateObj = new Date(booking.eventDate);
      const h = dateObj.getHours().toString().padStart(2, "0");
      const m = dateObj.getMinutes().toString().padStart(2, "0");

      form.reset({
        customerName: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        eventType: booking.eventType,
        date: dateObj,
        time: `${h}:${m}`,
        location: booking.location,
        guestCount: booking.guestCount || undefined,
        designNotes: booking.designNotes || "",
        quotedPrice: booking.quotedPrice || undefined,
        artistNotes: booking.artistNotes || "",
        status: booking.status as any,
      });
    }
  }, [booking, open, form]);

  const onSubmit = (data: editBookingSchemaType) => {
    if (!booking) return;

    const dateObj = new Date(data.date);
    const [h, m] = data.time.split(":").map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      dateObj.setHours(h, m, 0, 0);
    }

    startTransition(async () => {
      const response = await updateBooking(booking.id, {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: dateObj.toISOString(),
        location: data.location,
        guestCount: data.guestCount || null,
        designNotes: data.designNotes || null,
        quotedPrice: data.quotedPrice || null,
        artistNotes: data.artistNotes || null,
        status: data.status,
      });

      if (response.success) {
        toast.success("Booking details modified successfully!");
        onOpenChange(false);
        onSuccess();
        router.refresh();
      } else {
        toast.error(response.error || "Failed to save modifications.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-[#EBE4DC] rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh] no-scrollbar gap-5 max-w-3xl! w-full">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-[#4E3E2F] flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" /> Modify Booking Record
          </DialogTitle>
          <DialogDescription className="text-xs">
            Correct or modify any details inputted by the client or artist.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 mt-2 w-full"
        >
          {/* Customer Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="customerName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-name"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Customer Name *
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-name"
                    disabled={isPending}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-phone"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Phone Number *
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-phone"
                    disabled={isPending}
                    className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Email & Event occasion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-email"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Email Address *
                  </FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="edit-email"
                    disabled={isPending}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-type"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Event Occasion *
                  </FieldLabel>
                  <select
                    {...field}
                    id="edit-type"
                    disabled={isPending}
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

          {/* Date & Time Picker */}
          <div className="w-full">
            <Controller
              name="date"
              control={form.control}
              render={({ field: dateField, fieldState: dateState }) => (
                <Controller
                  name="time"
                  control={form.control}
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

          {/* Logistics details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-location"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Venue Location *
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-location"
                    disabled={isPending}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-guests"
                    className="text-xs font-semibold text-[#5C4D3E]"
                  >
                    Guest Count
                  </FieldLabel>
                  <Input
                    id="edit-guests"
                    type="number"
                    min="1"
                    disabled={isPending}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value),
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

          {/* Design Notes */}
          <Controller
            name="designNotes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="edit-design"
                  className="text-xs font-semibold text-[#5C4D3E]"
                >
                  Design Vision Notes
                </FieldLabel>
                <Textarea
                  {...field}
                  id="edit-design"
                  disabled={isPending}
                  value={field.value || ""}
                  rows={2}
                  className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs leading-relaxed"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Management & Status Overrides */}
          <div className="border-t border-[#EBE4DC]/60 pt-4 space-y-4">
            <span className="font-bold text-[10px] text-[#8C7A6B] uppercase tracking-wider block">
              Management Ledger & Overrides
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="edit-status"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Current Status
                    </FieldLabel>
                    <select
                      {...field}
                      id="edit-status"
                      disabled={isPending}
                      className="w-full px-3 h-10 border border-[#EBE4DC] bg-white rounded-lg text-xs focus-visible:ring-primary/40"
                    >
                      <option value="PENDING_QUOTE">Requested</option>
                      <option value="QUOTED">Quoted</option>
                      <option value="ACCEPTED">Accepted (Booked)</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="quotedPrice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="edit-price"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Quoted Price (₹)
                    </FieldLabel>
                    <Input
                      id="edit-price"
                      type="number"
                      disabled={isPending}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value),
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

              <Controller
                name="artistNotes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="md:col-span-1"
                  >
                    <FieldLabel
                      htmlFor="edit-notes"
                      className="text-xs font-semibold text-[#5C4D3E]"
                    >
                      Artist Notes
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-notes"
                      disabled={isPending}
                      value={field.value || ""}
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
                disabled={isPending}
                className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/95 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isPending ? <Loader2 className="h-4 w-4" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
