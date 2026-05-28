"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Sparkles, Users, Calendar, Plus, Minus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "./DateTimePicker";
import { cn } from "@/lib/utils";
import TulipSeprator from "../common/TulipSeprator";

// Form Validation Schema
const bookingSchema = z.object({
  occasion: z.enum(["bridal", "guest", "festive"]),
  date: z.date({
    message: "Please select a date for your event.",
  }),
  time: z.string().min(1, "Please select a start time."),
  location: z.string().min(5, "Event location must be at least 5 characters."),
  peopleCount: z.number().min(1, "At least 1 person is required."),
  vision: z
    .string()
    .min(10, "Please describe your vision in at least 10 characters.")
    .max(1000, "Vision description cannot exceed 1000 characters."),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  whatsapp: z
    .string()
    .min(10, "WhatsApp number must be at least 10 digits.")
    .regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      occasion: "bridal",
      date: undefined,
      time: "10:00",
      location: "",
      peopleCount: 1,
      vision: "",
      fullName: "",
      whatsapp: "",
      email: "",
    },
    mode: "onChange",
  });

  const occasionOptions = [
    {
      value: "bridal",
      label: "Bridal Mehndi",
      description:
        "Full hands, arms, and feet. Intricate, traditional, or modern figures.",
      icon: Sparkles,
    },
    {
      value: "guest",
      label: "Guest / Party Mehndi",
      description: "Sangeet, bridesmaids, or group bookings.",
      icon: Users,
    },
    {
      value: "festive",
      label: "Festive / Occasion",
      description: "Eid, Karwa Chauth, Baby Showers, or casual wear.",
      icon: Calendar,
    },
  ] as const;

  async function onSubmit(data: BookingFormValues) {
    setIsSubmitting(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    console.log(data);
    toast.success("Booking request submitted!", {
      description: `Thank you ${data.fullName}! Muskan will review your request and reach out on WhatsApp (${data.whatsapp}) with a custom quote.`,
      position: "bottom-right",
      duration: 6000,
    });

    // Reset the form values
    form.reset({
      occasion: "bridal",
      date: undefined,
      time: "10:00",
      location: "",
      peopleCount: 1,
      vision: "",
      fullName: "",
      whatsapp: "",
      email: "",
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 w-full max-w-2xl pb-10"
    >
      {/* SECTION 1: The Occasion */}
      <section className="rounded-2xl p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
            1. The Occasion
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            What type of event are you planning?
          </p>
        </div>

        <Controller
          name="occasion"
          control={form.control}
          render={({ field }) => (
            <Field className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {occasionOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "relative flex flex-col p-5 rounded-xl border cursor-pointer hover:border-primary/50 transition-all duration-300 group select-none text-left",
                        isSelected
                          ? "border-primary bg-primary/2 shadow-[0_0_0_1px_oklch(var(--primary))]"
                          : "border-border bg-transparent hover:bg-muted/10",
                      )}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/5",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <span className="font-semibold text-base text-foreground leading-tight">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1.5 leading-normal">
                        {option.description}
                      </span>
                    </label>
                  );
                })}
              </div>
              <FieldError errors={[form.formState.errors.occasion]} />
            </Field>
          )}
        />
      </section>
      <TulipSeprator variant="wavy" />
      {/* SECTION 2: Time & Place */}
      <section className="p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
            2. Time & Place
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            When and where will the session happen?
          </p>
        </div>

        {/* Date and Time Picker */}
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

        {/* Location Input */}
        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="booking-location"
                className="text-sm font-medium text-foreground"
              >
                Event Location / City
              </FieldLabel>
              <Input
                {...field}
                id="booking-location"
                placeholder="E.g., Bandra West, Mumbai"
                aria-invalid={fieldState.invalid}
                className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
              />
              <FieldDescription className="text-xs text-muted-foreground">
                Where will the application take place? Travel fees may apply
                depending on the distance.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>
      <TulipSeprator variant="wavy" />

      {/* SECTION 3: The Details */}
      <section className="p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
            3. Design Requirements
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Specify estimated requirements and style vision.
          </p>
        </div>

        {/* Estimated number of people counter */}
        <Controller
          name="peopleCount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-sm font-medium text-foreground">
                Estimated number of people needing henna:
              </FieldLabel>
              <div className="flex items-center gap-4 mt-1 select-none">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-lg border-border hover:bg-muted hover:border-primary/20 active:scale-95 transition-all text-foreground"
                  onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  disabled={field.value <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-16 text-center font-bold text-lg text-foreground tabular-nums">
                  {field.value}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-lg border-border hover:bg-muted hover:border-primary/20 active:scale-95 transition-all text-foreground"
                  onClick={() => field.onChange(field.value + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FieldDescription className="text-xs text-muted-foreground">
                Including the bride, bridesmaids, and family members.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Vision details textarea */}
        <Controller
          name="vision"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="booking-vision"
                  className="text-sm font-medium text-foreground"
                >
                  Tell us about your vision
                </FieldLabel>
                <span className="text-xs text-muted-foreground tabular-nums select-none">
                  {field.value.length}/1000
                </span>
              </div>
              <Textarea
                {...field}
                id="booking-vision"
                placeholder='E.g., "I want traditional Rajasthani designs on both sides of my hands up to the elbows, and simple Arabic designs for 5 bridesmaids..."'
                aria-invalid={fieldState.invalid}
                rows={4}
                className="rounded-lg focus-visible:ring-ring/50 border-input bg-transparent resize-none leading-relaxed"
              />
              <FieldDescription className="text-xs text-muted-foreground">
                Specify design length (elbow, wrist, etc.), themes (lotus,
                elephant, portraits), or special requests.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>
      <TulipSeprator variant="wavy" />

      {/* SECTION 4: Contact & Handoff */}
      <section className="p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
            4. Your Details
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Where can we reach you to finalize details?
          </p>
        </div>

        {/* Full Name */}
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="booking-name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </FieldLabel>
              <Input
                {...field}
                id="booking-name"
                placeholder="Enter your full name"
                aria-invalid={fieldState.invalid}
                className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* WhatsApp & Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* WhatsApp */}
          <Controller
            name="whatsapp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="booking-whatsapp"
                  className="text-sm font-medium text-foreground"
                >
                  WhatsApp Number
                </FieldLabel>
                <Input
                  {...field}
                  id="booking-whatsapp"
                  type="tel"
                  placeholder="E.g., +91 98765 43210"
                  aria-invalid={fieldState.invalid}
                  className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                />
                <FieldDescription className="text-xs text-muted-foreground">
                  We will send your quote and availability updates here.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="booking-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </FieldLabel>
                <Input
                  {...field}
                  id="booking-email"
                  type="email"
                  placeholder="Enter your email address"
                  aria-invalid={fieldState.invalid}
                  className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                />
                <FieldDescription className="text-xs text-muted-foreground">
                  We will send a secure link to track your booking status.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </section>
      <TulipSeprator variant="wavy" />

      {/* SECTION 5: Submit Action */}
      <div className="space-y-4 pt-2">
        <Button
          type="submit"
          className="w-full py-6 text-base font-semibold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 select-none hover:scale-[1.005] active:scale-[0.995]"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1" />
              Processing Request...
            </>
          ) : (
            <>
              <Send className="h-4.5 w-4.5 mr-1" />
              Request Custom Quote
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          No payment is required today. Submitting this form does not lock you
          into a contract.
        </p>
      </div>
    </form>
  );
}
