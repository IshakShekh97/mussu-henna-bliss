"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/book/DateTimePicker";
import { manualBookingSchema, type manualBookingSchemaType } from "@/lib/zodSchemas";
import { createBooking } from "@/app/actions/booking.action";

export function ManualBookingFormStandalone() {
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
        form.reset();
        router.push("/admin/bookings");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to save booking.");
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
          Log Manual Event
        </h1>
        <p className="text-xs text-muted-foreground">
          Log phone-in, walk-in, or cash-based custom event requests.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                    <FieldLabel htmlFor="manual-name" className="text-xs font-semibold text-[#5C4D3E]">
                      Customer Name *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="manual-name"
                      disabled={isPending}
                      placeholder="Enter name"
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="manual-phone" className="text-xs font-semibold text-[#5C4D3E]">
                      Phone Number *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="manual-phone"
                      disabled={isPending}
                      placeholder="E.g. +91 98765 43210"
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                    <FieldLabel htmlFor="manual-email" className="text-xs font-semibold text-[#5C4D3E]">
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                      <FieldLabel htmlFor="manual-type" className="text-xs font-semibold text-[#5C4D3E]">
                        Event Occasion *
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <SelectTrigger id="manual-type" className="bg-white border-[#EBE4DC] h-10 text-xs">
                          <SelectValue placeholder="Select Occasion" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#EBE4DC]">
                          <SelectItem value="Bridal">Bridal Mehndi</SelectItem>
                          <SelectItem value="Sangeet">Sangeet Party</SelectItem>
                          <SelectItem value="Guest">Guest Mehndi</SelectItem>
                          <SelectItem value="Festive">Festive Mehndi</SelectItem>
                          <SelectItem value="Photoshoot">Photoshoot / Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="guestCount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="manual-guests" className="text-xs font-semibold text-[#5C4D3E]">
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
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                        className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                    <FieldLabel htmlFor="manual-location" className="text-xs font-semibold text-[#5C4D3E]">
                      Venue Location *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="manual-location"
                      disabled={isPending}
                      placeholder="E.g. Salt Lake Sector V, Kolkata"
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Design Notes Section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Design Requirements
            </h2>
            <Controller
              name="designNotes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="manual-design" className="text-xs font-semibold text-[#5C4D3E]">
                    Design Notes
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="manual-design"
                    disabled={isPending}
                    placeholder="Specify design details, styles requested, custom motifs..."
                    rows={4}
                    className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs leading-relaxed"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Right Column: Ledger Settings & Actions */}
        <div className="space-y-6">
          {/* Log Ledger settings */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Log Ledger Settings
            </h2>
            <FieldGroup className="space-y-4">
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="manual-status" className="text-xs font-semibold text-[#5C4D3E]">
                      Initial Status
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger id="manual-status" className="bg-white border-[#EBE4DC] h-10 text-xs">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#EBE4DC]">
                        <SelectItem value="PENDING_QUOTE">Requested</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted (Booked)</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="quotedPrice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="manual-price" className="text-xs font-semibold text-[#5C4D3E]">
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
                          e.target.value === "" ? undefined : Number(e.target.value)
                        )
                      }
                      className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  "Save Booking"
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
