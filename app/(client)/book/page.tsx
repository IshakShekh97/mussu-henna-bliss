import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { BookingForm } from "@/components/book/BookingForm";
import TulipSeprator from "@/components/common/TulipSeprator";

export const metadata: Metadata = {
  title: "Reserve Your Date | Mussu's Mehendi Bliss",
  description:
    "Reserve your special date for bespoke, intricate mehendi artwork. Get a custom price quote directly via WhatsApp for bridal, festive, and group events.",
};

export default function BookingPage() {
  const steps = [
    {
      num: "1",
      text: "Tell us about your event and design vision.",
    },
    {
      num: "2",
      text: "Muskan will review the details and confirm availability.",
    },
    {
      num: "3",
      text: "Receive a custom price quote directly via WhatsApp to secure your booking.",
    },
  ];

  return (
    <div className="w-full">
      {/* Page Title for Accessibility / Heading Structure */}
      <h1 className="sr-only">Book a Mehendi Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-16 items-start w-full">
        {/* Left Column (Sticky Visual & Trust Area) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 w-full flex flex-col gap-6">
          {/* Stunning Photo Container */}
          <div className="relative h-80 sm:h-100 lg:h-130 w-full rounded-2xl overflow-hidden shadow-md border border-primary/10">
            <Image
              src="/images/hero-4.jpg"
              alt="Intricate bridal henna design art"
              fill
              sizes="(max-width: 1024px) 100vw, 35vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Trust Text & Instructions */}
          <div className="space-y-4 px-1">
            <h2 className="text-3xl lg:text-4xl font-heading text-primary font-black tracking-wide">
              Reserve Your Date
            </h2>
            <p className="text-lg font-sans text-muted-foreground leading-relaxed">
              Let’s create something beautiful for your special day.
            </p>
            <TulipSeprator />
            {/* How It Works List */}
            <div className="pt-4 space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-primary">
                How it works
              </span>
              <ul className="space-y-3.5 mt-2">
                {steps.map((step) => (
                  <li key={step.num} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-sans">
                      {step.num}
                    </span>
                    <span className="text-sm font-sans font-light text-muted-foreground leading-relaxed">
                      {step.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Right Column (Scrollable Form) */}
        <main className="lg:col-span-6 w-full flex flex-col gap-6">
          <BookingForm />
        </main>
      </div>
    </div>
  );
}
