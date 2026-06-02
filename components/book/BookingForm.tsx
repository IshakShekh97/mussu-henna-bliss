"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Sparkles, Users, Calendar, Plus, Minus, Send, Paintbrush, Layers, Settings, Flower } from "lucide-react";

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
import { bookingFormSchemaType, bookingSchema } from "@/lib/zodSchemas";
import { createCustomerBooking } from "@/app/actions/booking.action";

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomOccasion, setIsCustomOccasion] = useState(false);
  const [customOccasion, setCustomOccasion] = useState("");

  const form = useForm<bookingFormSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      occasion: "Bridal Mehndi",
      date: undefined,
      time: "10:00",
      location: "",
      peopleCount: 1,
      hennaStyle: "Traditional Rajasthani",
      hennaType: "Organic Natural Henna (Red/Brown)",
      coverage: "Hands Only",
      vision: "",
      fullName: "",
      whatsapp: "",
      email: "",
    },
    mode: "onChange",
  });

  const occasionOptions = [
    {
      value: "Bridal Mehndi",
      label: "Bridal Mehndi",
      description: "Full hands, arms, and feet. Intricate, traditional or modern designs.",
      icon: Sparkles,
    },
    {
      value: "Guest Mehndi",
      label: "Guest / Party Mehndi",
      description: "Sangeet, bridesmaids, or group event bookings.",
      icon: Users,
    },
    {
      value: "Festive Mehndi",
      label: "Festive / Occasion",
      description: "Eid, Karwa Chauth, Teej, or private celebrations.",
      icon: Calendar,
    },
  ] as const;

  const hennaStyleOptions = [
    "Traditional Rajasthani",
    "Arabic / Gulf Style",
    "Indo-Arabic Fusion",
    "Modern Minimalist / Mandala",
    "Custom / Unsure",
  ];

  const hennaTypeOptions = [
    "Organic Natural Henna (Red/Brown)",
    "White Henna (Waterproof)",
    "Black / Instant Henna",
  ];

  const coverageOptions = [
    "Palms Only",
    "Up to Wrists",
    "Up to Mid-Forearms",
    "Up to Elbows",
    "Hands & Feet",
  ];

  const handleOccasionChange = (val: string, onChange: (v: string) => void) => {
    if (val === "custom") {
      setIsCustomOccasion(true);
      onChange(customOccasion);
    } else {
      setIsCustomOccasion(false);
      onChange(val);
    }
  };

  const handleCustomOccasionInput = (text: string, onChange: (v: string) => void) => {
    setCustomOccasion(text);
    onChange(text);
  };

  async function onSubmit(data: bookingFormSchemaType) {
    setIsSubmitting(true);
    try {
      const res = await createCustomerBooking(data);
      if (res.success) {
        toast.success("Booking request submitted!", {
          description: `Thank you ${data.fullName}! Muskan will review your request and reach out on WhatsApp (${data.whatsapp}) with a custom quote.`,
          position: "bottom-right",
          duration: 6000,
        });

        // Reset the form values
        form.reset({
          occasion: "Bridal Mehndi",
          date: undefined,
          time: "10:00",
          location: "",
          peopleCount: 1,
          hennaStyle: "Traditional Rajasthani",
          hennaType: "Organic Natural Henna (Red/Brown)",
          coverage: "Hands Only",
          vision: "",
          fullName: "",
          whatsapp: "",
          email: "",
        });
        setIsCustomOccasion(false);
        setCustomOccasion("");
      } else {
        toast.error(res.error || "Failed to submit booking request. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 w-full max-w-2xl pb-10 font-sans"
    >
      {/* SECTION 1: The Occasion */}
      <section className="rounded-2xl p-6 sm:p-8 space-y-5 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm relative overflow-hidden">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 font-serif flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            1. The Occasion
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            What type of event are you planning? Select a category or specify below.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <Controller
            name="occasion"
            control={form.control}
            render={({ field }) => (
              <Field className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {occasionOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = !isCustomOccasion && field.value === option.value;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "relative flex flex-col p-5 rounded-xl border cursor-pointer hover:border-primary/50 transition-all duration-300 group select-none text-left bg-white",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-[#EBE4DC] hover:bg-primary/2"
                        )}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleOccasionChange(option.value, field.onChange)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-100 text-gray-400 group-hover:text-primary group-hover:bg-primary/5"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <span className="font-semibold text-sm text-gray-800 leading-tight">
                          {option.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1.5 leading-normal font-light">
                          {option.description}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Custom Occasion Option Trigger */}
                <div className="flex justify-start">
                  <label
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-all select-none",
                      isCustomOccasion
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-[#EBE4DC] bg-white text-gray-600 hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value="custom"
                      checked={isCustomOccasion}
                      onChange={() => handleOccasionChange("custom", field.onChange)}
                      className="sr-only"
                    />
                    <Plus className="w-3.5 h-3.5" />
                    Custom / Other Occasion
                  </label>
                </div>

                {/* Custom Occasion Text Input */}
                {isCustomOccasion && (
                  <div className="pt-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                    <FieldLabel htmlFor="custom-occasion" className="text-xs font-medium text-gray-700">
                      Specify Custom Occasion / Event Name
                    </FieldLabel>
                    <Input
                      id="custom-occasion"
                      value={customOccasion}
                      onChange={(e) => handleCustomOccasionInput(e.target.value, field.onChange)}
                      placeholder="E.g., Engagement Party, Baby Shower, Photoshoot"
                      className="h-10 mt-1 bg-white border-[#EBE4DC] rounded-lg focus-visible:ring-primary/20"
                    />
                  </div>
                )}

                <FieldError errors={[form.formState.errors.occasion]} />
              </Field>
            )}
          />
        </div>
      </section>

      <TulipSeprator variant="wavy" />

      {/* SECTION 2: Time & Place */}
      <section className="rounded-2xl p-6 sm:p-8 space-y-5 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm relative overflow-hidden">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 font-serif flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            2. Time & Place
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            When and where will the henna session happen?
          </p>
        </div>

        <div className="relative z-10 space-y-4">
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
                  className="text-sm font-medium text-gray-700"
                >
                  Event Location / City Address
                </FieldLabel>
                <Input
                  {...field}
                  id="booking-location"
                  placeholder="E.g., Bandra West, Mumbai"
                  aria-invalid={fieldState.invalid}
                  className="h-10 bg-white rounded-lg focus-visible:ring-primary/20 border-[#EBE4DC]"
                />
                <FieldDescription className="text-[10px] text-muted-foreground font-light">
                  Provide details of the venue. Travel charges might apply depending on proximity.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </section>

      <TulipSeprator variant="wavy" />

      {/* SECTION 3: Henna Preferences */}
      <section className="rounded-2xl p-6 sm:p-8 space-y-5 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm relative overflow-hidden">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 font-serif flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            3. Henna Preferences
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Customize style details, material preferences, and layout.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {/* Henna Style Selector */}
          <Controller
            name="hennaStyle"
            control={form.control}
            render={({ field }) => (
              <Field className="space-y-2">
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Henna Style Preference
                </FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {hennaStyleOptions.map((style) => {
                    const isSelected = field.value === style;
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => field.onChange(style)}
                        className={cn(
                          "px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-all select-none",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-[#EBE4DC] bg-white text-gray-600 hover:border-primary/30"
                        )}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}
          />

          {/* Henna Type Selector */}
          <Controller
            name="hennaType"
            control={form.control}
            render={({ field }) => (
              <Field className="space-y-2">
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Henna Paste Material Type
                </FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {hennaTypeOptions.map((type) => {
                    const isSelected = field.value === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => field.onChange(type)}
                        className={cn(
                          "px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-all select-none",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-[#EBE4DC] bg-white text-gray-600 hover:border-primary/30"
                        )}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
                <FieldDescription className="text-[10px] text-muted-foreground font-light">
                  Organic natural henna takes 24-48 hours for deep stain. White/Black options are instant.
                </FieldDescription>
              </Field>
            )}
          />

          {/* Coverage Selector */}
          <Controller
            name="coverage"
            control={form.control}
            render={({ field }) => (
              <Field className="space-y-2">
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Henna Layout & Coverage
                </FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {coverageOptions.map((coverageVal) => {
                    const isSelected = field.value === coverageVal;
                    return (
                      <button
                        key={coverageVal}
                        type="button"
                        onClick={() => field.onChange(coverageVal)}
                        className={cn(
                          "px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-all select-none",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-[#EBE4DC] bg-white text-gray-600 hover:border-primary/30"
                        )}
                      >
                        {coverageVal}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}
          />
        </div>
      </section>

      <TulipSeprator variant="wavy" />

      {/* SECTION 4: Design Requirements & Details */}
      <section className="rounded-2xl p-6 sm:p-8 space-y-5 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm relative overflow-hidden">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 font-serif flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            4. Design Details
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Specify head counts and describe visual expectations.
          </p>
        </div>

        <div className="relative z-10 space-y-5">
          {/* Estimated number of people counter */}
          <Controller
            name="peopleCount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-medium text-gray-700">
                  Estimated number of people needing henna:
                </FieldLabel>
                <div className="flex items-center gap-4 mt-1 select-none">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-lg border-[#EBE4DC] bg-white hover:bg-primary/5 active:scale-95 transition-all text-gray-700 cursor-pointer"
                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                    disabled={field.value <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center font-bold text-base text-gray-800 tabular-nums">
                    {field.value}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-lg border-[#EBE4DC] bg-white hover:bg-primary/5 active:scale-95 transition-all text-gray-700 cursor-pointer"
                    onClick={() => field.onChange(field.value + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FieldDescription className="text-[10px] text-muted-foreground font-light">
                  Includes the main person (e.g. bride) plus guest/family counts.
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
                    className="text-sm font-medium text-gray-700"
                  >
                    Tell us about your style vision
                  </FieldLabel>
                  <span className="text-[10px] text-muted-foreground tabular-nums select-none font-light">
                    {field.value.length}/1000
                  </span>
                </div>
                <Textarea
                  {...field}
                  id="booking-vision"
                  placeholder='E.g., "I want intricate traditional motifs with peacock patterns up to my elbows, and Arabic layout for my bridesmaids..."'
                  aria-invalid={fieldState.invalid}
                  rows={4}
                  className="bg-white rounded-lg focus-visible:ring-primary/20 border-[#EBE4DC] resize-none leading-relaxed text-sm text-gray-800"
                />
                <FieldDescription className="text-[10px] text-muted-foreground font-light">
                  Specify details such as design length, motifs (elephants, flowers, portraits), or special custom requests.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </section>

      <TulipSeprator variant="wavy" />

      {/* SECTION 5: Contact & Handoff */}
      <section className="rounded-2xl p-6 sm:p-8 space-y-5 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm relative overflow-hidden">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 font-serif flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            5. Contact Details
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Where can we reach you to finalize quotes and dispatch details?
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {/* Full Name */}
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="booking-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id="booking-name"
                  placeholder="Enter your full name"
                  aria-invalid={fieldState.invalid}
                  className="h-10 bg-white rounded-lg focus-visible:ring-primary/20 border-[#EBE4DC]"
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
                    className="text-sm font-medium text-gray-700"
                  >
                    WhatsApp Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="booking-whatsapp"
                    type="tel"
                    placeholder="E.g., 9876543210"
                    aria-invalid={fieldState.invalid}
                    className="h-10 bg-white rounded-lg focus-visible:ring-primary/20 border-[#EBE4DC]"
                  />
                  <FieldDescription className="text-[10px] text-muted-foreground font-light">
                    We will send availability and quote notifications here.
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
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="booking-email"
                    type="email"
                    placeholder="Enter your email address"
                    aria-invalid={fieldState.invalid}
                    className="h-10 bg-white rounded-lg focus-visible:ring-primary/20 border-[#EBE4DC]"
                  />
                  <FieldDescription className="text-[10px] text-muted-foreground font-light">
                    We will email your quote invoice and order summaries here.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
      </section>

      <TulipSeprator variant="wavy" />

      {/* SECTION 6: Submit Action */}
      <div className="space-y-4 pt-2">
        <Button
          type="submit"
          className="w-full py-6 text-base font-semibold tracking-wide bg-primary hover:bg-primary/95 text-white rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2 select-none hover:scale-[1.005] active:scale-[0.995] cursor-pointer"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
              Processing Request...
            </>
          ) : (
            <>
              <Send className="h-4.5 w-4.5 mr-1" />
              Request Custom Quote
            </>
          )}
        </Button>

        <p className="text-center text-[10px] text-muted-foreground max-w-md mx-auto leading-relaxed font-light">
          Submitting this booking request does not require any payment today. Muskan will follow up to negotiate dates and prepare your quote.
        </p>
      </div>
    </form>
  );
}

