"use client";

import React, { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { DateTimePicker } from "@/components/book/DateTimePicker";
import {
  Booking,
  editBookingSchema,
  type editBookingSchemaType,
} from "@/lib/zodSchemas";
import { updateBooking } from "@/app/actions/booking.action";

interface EditBookingFormStandaloneProps {
  booking: Booking;
}

export function EditBookingFormStandalone({
  booking,
}: EditBookingFormStandaloneProps) {
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

  // Sync initial state when booking details are fetched
  useEffect(() => {
    if (booking) {
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
  }, [booking, form]);

  const onSubmit = (data: editBookingSchemaType) => {
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
        router.push("/admin/bookings");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to save modifications.");
      }
    });
  };

  return (
    <div className="w-full font-sans space-y-6">
      {/* Header and navigation */}
      <div className="space-y-1.5 pb-6 border-b border-[#EBE4DC]">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7A6B] hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Bookings
          </Link>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#4E3E2F]">
          Modify Booking Record
        </h1>
        <p className="text-xs text-muted-foreground">
          Correct or modify booking details for {booking.customerName}.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
      >
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Customer Details
            </h2>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="md:col-span-2"
                  >
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
            </FieldGroup>
          </div>

          {/* Event Details section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Event Logistics & Details
            </h2>
            <FieldGroup className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            e.target.value === ""
                              ? null
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

              {/* Location */}
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
            </FieldGroup>
          </div>

          {/* Design Notes Section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Design Vision Requirements
            </h2>
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
                    rows={4}
                    className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs leading-relaxed"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Right Column: Ledger Settings & Actions */}
        <div className="space-y-6">
          {/* Management Ledger & Overrides */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Management Ledger
            </h2>
            <FieldGroup className="space-y-4">
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
                  <Field data-invalid={fieldState.invalid}>
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
            </FieldGroup>
          </div>

          {/* Action buttons */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Actions
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold shadow-md shadow-primary/10 select-none active:scale-[0.99] transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/bookings")}
                className="w-full border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] h-11 rounded-xl"
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
