"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import {
  manualBookingSchema,
  type manualBookingSchemaType,
} from "@/lib/zodSchemas";
import { createBooking } from "@/app/actions/booking.action";
import Loader2 from "./loader";

interface ManualBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (bookingId: string) => void;
}

export function ManualBookingDialog({
  open,
  onOpenChange,
  onSuccess,
}: ManualBookingDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<manualBookingSchemaType>({
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

  const onSubmit = (data: manualBookingSchemaType) => {
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
        onOpenChange(false);
        form.reset();
        onSuccess(response.booking.id);
        router.refresh();
      } else {
        toast.error(response.error || "Failed to save booking.");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          form.reset();
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="border border-[#EBE4DC] rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh] no-scrollbar gap-5 max-w-3xl! w-full">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-[#4E3E2F] flex items-center gap-2">
            <span className="text-primary font-bold">✨</span> Log Manual Event
          </DialogTitle>
          <DialogDescription className="text-xs">
            Log phone-in, walk-in, or cash-based custom event requests.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 mt-2 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="customerName"
              control={form.control}
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
                    disabled={isPending}
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
              control={form.control}
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
                    disabled={isPending}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="email"
              control={form.control}
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
                    disabled={isPending}
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
              control={form.control}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="location"
              control={form.control}
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
                    disabled={isPending}
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
              control={form.control}
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
                    disabled={isPending}
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

          <Controller
            name="designNotes"
            control={form.control}
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
                  disabled={isPending}
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

          <div className="border-t border-[#EBE4DC]/60 pt-4 space-y-4">
            <span className="font-bold text-[10px] text-[#8C7A6B] uppercase tracking-wider block">
              Log Ledger Settings
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="status"
                control={form.control}
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
                      disabled={isPending}
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

              <Controller
                name="quotedPrice"
                control={form.control}
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
                      disabled={isPending}
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
              {isPending ? <Loader2 className="h-4 w-4" /> : "Save Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
