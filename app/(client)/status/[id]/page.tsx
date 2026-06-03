import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  Clock,
  Truck,
  AlertTriangle,
  User,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  IndianRupee,
} from "lucide-react";

import prisma from "@/lib/prisma";
import TulipSeprator from "@/components/common/TulipSeprator";
import { Button } from "@/components/ui/button";
import { cn, getStatusLabel } from "@/lib/utils";
import { FadeIn, SectionHeader } from "@/components/animations";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderStatusPage({ params }: PageProps) {
  const { id } = await params;

  let order = null;
  let booking = null;

  const isBookingLookup = id.startsWith("booking-");
  const lookupId = isBookingLookup ? id.replace("booking-", "") : id;

  if (isBookingLookup) {
    booking = await prisma.booking.findUnique({
      where: { id: lookupId },
    });
  } else {
    // Try order first
    order = await prisma.order.findUnique({
      where: { id: lookupId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Fallback to booking
    if (!order) {
      booking = await prisma.booking.findUnique({
        where: { id: lookupId },
      });
    }
  }

  // Render a beautiful not found state inside the component for better UX
  if (!order && !booking) {
    const ownerWhatsAppNumber = process.env.NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER;
    const helpUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(
      `Hi Muskan! I am trying to track my order/booking but the system says it doesn't exist. My ID is: ${id}`,
    )}`;

    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] shadow-sm relative overflow-hidden my-12 font-[family-name:var(--font-geist-sans)]">
        {/* Vintage Corner Flourishes */}
        <div className="absolute top-3 left-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute top-3 right-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute bottom-3 left-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute bottom-3 right-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

        <AlertTriangle className="h-16 w-16 text-primary mx-auto mb-4 stroke-[1.2]" />
        <h1 className="text-3xl font-morlana font-light text-gray-800 mb-2">
          Tracking ID Not Found
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
          We couldn't find an order or booking with ID{" "}
          <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-xs">
            {id}
          </span>
          . Please verify your tracking URL or contact Muskan for help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#EBE4DC] hover:bg-muted font-sans px-6 py-5 transition-all duration-300 hover:scale-[1.02]"
          >
            <Link href="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans px-6 py-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
          >
            <a href={helpUrl} target="_blank" rel="noopener noreferrer">
              Contact Support
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (booking) {
    const isCancelled = booking.status === "CANCELLED";
    const isCompletedStep2 = booking.status !== "PENDING_QUOTE" && booking.status !== "CANCELLED";
    const isCompletedStep3 = (booking.status === "ACCEPTED" || booking.status === "COMPLETED") && !isCancelled;
    const isCompletedStep4 = booking.status === "COMPLETED" && !isCancelled;

    const ownerWhatsAppNumber = process.env.NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER;
    const bookingContactUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(
      `Hi Muskan! I have a question about my booking "${booking.eventType}" (ID: ${booking.id}).`
    )}`;

    return (
      <div className="w-full max-w-5xl mx-auto py-6 md:py-12">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </div>

        {/* Animated Header */}
        <SectionHeader
          badge="✨ Booking Tracking"
          title="Track Your Henna Booking"
          highlightedWord="Henna Booking"
          description=""
        />
        <p className="text-sm text-muted-foreground text-center -mt-10 mb-10 font-light">
          Booking ID:{" "}
          <span className="font-mono text-xs bg-[#FAF9F5] border border-[#EBE4DC] px-2 py-1 rounded-md text-foreground">
            booking-${booking.id}
          </span>
        </p>

        <TulipSeprator variant="wavy" className="my-8" />

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-10 font-[family-name:var(--font-geist-sans)]">
          {/* Left Hand: Timeline & Help Card */}
          <FadeIn direction="left" delay={0.2} className="lg:col-span-2">
            <div className="space-y-8">
              {/* Visual Timeline */}
              <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-8 md:p-10 relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                {/* Vintage Corner Flourishes */}
                <div className="absolute top-3 left-3 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute top-3 right-3 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute bottom-3 left-3 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute bottom-3 right-3 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

                <h3 className="font-serif text-2xl font-light text-gray-800 mb-8 pb-3 border-b border-[#EBE4DC]">
                  Booking Pipeline
                </h3>

                {isCancelled ? (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive mb-6">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Booking Cancelled</h4>
                      <p className="text-xs font-light mt-0.5">
                        This booking session has been cancelled. Please reach out to Muskan if you require any changes or want to reschedule.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Vertical Steps */}
                <div className="relative border-l border-[#EBE4DC] ml-4 pl-8 space-y-8 py-2">
                  {/* Step 1: Request Logged */}
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0.5 bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center border-4 border-[#FDFBF7]">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">
                        Booking Request Received
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                        We have logged your event details, style selections, and contact information.
                      </p>
                      <span className="text-[10px] text-muted-foreground/70 font-mono mt-1 block">
                        {new Date(booking.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Custom Quote */}
                  <div className="relative">
                    <div
                      className={cn(
                        "absolute -left-[41px] top-0.5 rounded-full h-6 w-6 flex items-center justify-center border-4 border-[#FDFBF7] transition-all duration-300",
                        isCompletedStep2
                          ? "bg-green-500 text-white"
                          : isCancelled
                            ? "bg-destructive text-white"
                            : "bg-yellow-500 text-white animate-pulse",
                      )}
                    >
                      {isCompletedStep2 ? (
                        <Check className="h-3 w-3" />
                      ) : isCancelled ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">
                        Custom Quote Proposed
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                        {isCancelled
                          ? "This booking was cancelled."
                          : isCompletedStep2
                            ? `Muskan has proposed a custom quote of ₹${booking.quotedPrice?.toLocaleString("en-IN")}.`
                            : "Muskan is currently reviewing your event occasion and details to prepare a personalized quote."}
                      </p>
                      {booking.artistNotes && isCompletedStep2 && (
                        <div className="text-xs italic bg-white p-2 rounded-lg border border-[#EBE4DC] text-gray-700 mt-2 font-light">
                          " {booking.artistNotes} "
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Confirmation / Deposit */}
                  <div className="relative">
                    <div
                      className={cn(
                        "absolute -left-[41px] top-0.5 rounded-full h-6 w-6 flex items-center justify-center border-4 border-[#FDFBF7] transition-all duration-300",
                        isCompletedStep3
                          ? "bg-green-500 text-white"
                          : isCancelled
                            ? "bg-destructive/30 text-destructive"
                            : "bg-gray-200 text-gray-400",
                      )}
                    >
                      {isCompletedStep3 ? (
                        <Check className="h-3 w-3" />
                      ) : isCancelled ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <IndianRupee className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">
                        Booking Confirmed & Date Locked
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                        {isCancelled
                          ? "Booking cancelled."
                          : isCompletedStep3
                            ? "Deposit received! Your event slot is officially locked in our calendar."
                            : booking.status === "QUOTED"
                              ? `Awaiting a 50% deposit (₹${((booking.quotedPrice || 0) * 0.5).toLocaleString("en-IN")}) to confirm and lock the date.`
                              : "Pending quote proposal."}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Event Completed */}
                  <div className="relative">
                    <div
                      className={cn(
                        "absolute -left-[41px] top-0.5 rounded-full h-6 w-6 flex items-center justify-center border-4 border-[#FDFBF7] transition-all duration-300",
                        isCompletedStep4
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400",
                      )}
                    >
                      {isCompletedStep4 ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Calendar className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">
                        Event Executed
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                        {isCompletedStep4
                          ? "Thank you for choosing Mussu's Henna Bliss! Your event henna session was completed."
                          : "The henna session will be executed on the scheduled event details."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Box */}
              <div className="bg-[#FAF6EE] rounded-3xl border border-[#E9DFD0] p-6 md:p-8 space-y-4 transition-all duration-300 hover:shadow-md">
                <h3 className="font-serif text-xl font-medium text-gray-800">
                  Discuss Details on WhatsApp
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  To discuss custom design options, send visual inspiration photos, or confirm your deposit payment status, please send a message to Muskan on WhatsApp.
                </p>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.005]"
                >
                  <a href={bookingContactUrl} target="_blank" rel="noopener noreferrer">
                    Chat with Muskan
                  </a>
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Right Hand: Logistics & Client Card */}
          <FadeIn direction="right" delay={0.4}>
            <div className="space-y-8">
              {/* Event Logistics details */}
              <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="absolute top-2 left-2 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute top-2 right-2 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute bottom-2 left-2 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute bottom-2 right-2 text-[#D4C3B3] pointer-events-none">
                  <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
                </div>
                <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

                <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-[#EBE4DC]/60 flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-primary" /> Event Information
                </h3>

                <div className="space-y-4 text-xs text-gray-700 font-light">
                  <div className="grid grid-cols-3 gap-1 border-b border-[#EBE4DC]/40 pb-2 text-left">
                    <span className="font-semibold text-gray-500">Occasion:</span>
                    <span className="col-span-2 font-bold text-gray-900">{booking.eventType}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 border-b border-[#EBE4DC]/40 pb-2 text-left">
                    <span className="font-semibold text-gray-500">Event Date:</span>
                    <span className="col-span-2 font-semibold text-gray-800">
                      {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 border-b border-[#EBE4DC]/40 pb-2 text-left">
                    <span className="font-semibold text-gray-500">Time Slot:</span>
                    <span className="col-span-2 font-semibold text-gray-800">
                      {new Date(booking.eventDate).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 border-b border-[#EBE4DC]/40 pb-2 text-left">
                    <span className="font-semibold text-gray-500">Location:</span>
                    <span className="col-span-2 font-semibold text-gray-800 truncate" title={booking.location}>
                      {booking.location}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 border-b border-[#EBE4DC]/40 pb-2 text-left">
                    <span className="font-semibold text-gray-500">Est. Guests:</span>
                    <span className="col-span-2 font-semibold text-gray-800">{booking.guestCount || "N/A"}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 border-b border-[#EBE4DC]/40 pb-2 text-left">
                    <span className="font-semibold text-gray-500">Quoted Price:</span>
                    <span className="col-span-2 font-bold text-primary">
                      {booking.quotedPrice ? `₹${booking.quotedPrice.toLocaleString("en-IN")}` : "Pending Review"}
                    </span>
                  </div>

                  {booking.designNotes && (
                    <div className="pt-2 text-left">
                      <span className="font-semibold text-gray-500 block mb-1">Design vision:</span>
                      <p className="bg-white p-2 rounded-lg border border-[#EBE4DC]/60 italic whitespace-pre-wrap leading-relaxed text-gray-800 font-normal">
                        {booking.designNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Contact details card */}
              <div className="bg-white rounded-3xl border border-[#EBE4DC] p-6 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
                <h3 className="font-serif text-lg font-semibold text-gray-800 pb-2 border-b text-left">
                  Client Details
                </h3>
                <div className="space-y-4 text-sm text-left">
                  {[
                    {
                      icon: User,
                      label: "Client Name",
                      value: booking.customerName,
                    },
                    {
                      icon: Phone,
                      label: "WhatsApp Number",
                      value: booking.phone,
                    },
                    {
                      icon: Mail,
                      label: "Email Address",
                      value: booking.email,
                      truncate: true,
                    },
                  ].map((detail, idx) => {
                    const Icon = detail.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block">
                            {detail.label}
                          </span>
                          <span
                            className={cn(
                              "font-medium text-gray-800",
                              detail.truncate && "truncate block max-w-[200px]"
                            )}
                          >
                            {detail.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const isCancelled = order.status === "CANCELLED";
  const isFulfilled = order.status === "FULFILLED";
  const isCompletedStep2 =
    order.status === "PAID" || order.status === "FULFILLED";

  const ownerWhatsAppNumber = process.env.NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER;
  const contactUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(
    `Hi Muskan! I have a question about my order ${order.id}.`,
  )}`;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 md:py-12">
      {/* Top Navigation */}
      <div className="mb-8">
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </Link>
      </div>

      {/* Animated Header */}
      <SectionHeader
        badge="✨ Order Tracking"
        title="Track Your Henna Bliss Order"
        highlightedWord="Henna Bliss"
        description=""
      >
      </SectionHeader>
      <p className="text-sm text-muted-foreground text-center -mt-10 mb-10 font-light">
        Order ID:{" "}
        <span className="font-mono text-xs bg-[#FAF9F5] border border-[#EBE4DC] px-2 py-1 rounded-md text-foreground">
          {order.id}
        </span>
      </p>

      <TulipSeprator variant="wavy" className="my-8" />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-10 font-[family-name:var(--font-geist-sans)]">
        {/* Left Hand: Order Timeline & Help Card */}
        <FadeIn direction="left" delay={0.2} className="lg:col-span-2">
          <div className="space-y-8">
            {/* Visual Order Timeline */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-8 md:p-10 relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
              {/* Vintage Corner Flourishes */}
              <div className="absolute top-3 left-3 text-[#D4C3B3] pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute top-3 right-3 text-[#D4C3B3] pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute bottom-3 left-3 text-[#D4C3B3] pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute bottom-3 right-3 text-[#D4C3B3] pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

              <h3 className="font-serif text-2xl font-light text-gray-800 mb-8 pb-3 border-b border-[#EBE4DC]">
                Delivery Timeline
              </h3>

              {isCancelled ? (
                <div className="flex items-start gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive mb-6">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Order Cancelled</h4>
                    <p className="text-xs font-light mt-0.5">
                      This order has been marked as cancelled. Please contact
                      Muskan if you think this is a mistake.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Vertical Steps */}
              <div className="relative border-l border-[#EBE4DC] ml-4 pl-8 space-y-8 py-2">
                {/* Step 1: Order Placed */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0.5 bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center border-4 border-[#FDFBF7]">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">
                      Order Received
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                      We have successfully logged your order details.
                    </p>
                    <span className="text-[10px] text-muted-foreground/70 font-mono mt-1 block">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Step 2: Preparation & Payment */}
                <div className="relative">
                  <div
                    className={cn(
                      "absolute -left-[41px] top-0.5 rounded-full h-6 w-6 flex items-center justify-center border-4 border-[#FDFBF7] transition-all duration-300",
                      isCompletedStep2
                        ? "bg-green-500 text-white"
                        : isCancelled
                          ? "bg-destructive text-white"
                          : "bg-yellow-500 text-white animate-pulse",
                    )}
                  >
                    {isCompletedStep2 ? (
                      <Check className="h-3 w-3" />
                    ) : isCancelled ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">
                      Preparation & Confirmation
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                      {isCancelled
                        ? "This order was cancelled."
                        : isCompletedStep2
                          ? "Your order has been confirmed and freshly prepared."
                          : "Muskan is reviewing your details to prepare your fresh, natural henna cones."}
                    </p>
                  </div>
                </div>

                {/* Step 3: Shipped / Fulfilled */}
                <div className="relative">
                  <div
                    className={cn(
                      "absolute -left-[41px] top-0.5 rounded-full h-6 w-6 flex items-center justify-center border-4 border-[#FDFBF7] transition-all duration-300",
                      isFulfilled
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400",
                    )}
                  >
                    {isFulfilled ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Truck className="h-3 w-3" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">
                      Shipped & Fulfilled
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                      {isFulfilled
                        ? "Your fresh cones have been dispatched and delivered!"
                        : "Cones will be prepared fresh and shipped on the nearest Monday or Tuesday batch."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Handoff Help Box */}
            <div className="bg-[#FAF6EE] rounded-3xl border border-[#E9DFD0] p-6 md:p-8 space-y-4 transition-all duration-300 hover:shadow-md">
              <h3 className="font-serif text-xl font-medium text-gray-800">
                Confirm Order on WhatsApp
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                To expedite shipping, please make sure you have shared your{" "}
                <strong>Order ID</strong> with Muskan on WhatsApp. You can also
                send receipt screenshots or discuss customizable cone options.
              </p>
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.005]"
              >
                <a href={contactUrl} target="_blank" rel="noopener noreferrer">
                  Message Muskan on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Right Hand: Order Summary & Address Cards */}
        <FadeIn direction="right" delay={0.4}>
          <div className="space-y-8">
            {/* Order Summary receipt card */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
              {/* Vintage Corner Flourishes */}
              <div className="absolute top-2 left-2 text-[#D4C3B3] pointer-events-none">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute top-2 right-2 text-[#D4C3B3] pointer-events-none">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute bottom-2 left-2 text-[#D4C3B3] pointer-events-none">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute bottom-2 right-2 text-[#D4C3B3] pointer-events-none">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

              <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-[#EBE4DC]/60 flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-primary" /> Receipt
                Details
              </h3>

              <div className="divide-y divide-[#EBE4DC]/40 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-4 pt-3 first:pt-0"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} × ₹
                        {item.priceAtPurchase.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-medium text-sm text-gray-700 shrink-0">
                      ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#EBE4DC] mt-6 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-[#EBE4DC]/40 pt-2 mt-2">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address details card */}
            <div className="bg-white rounded-3xl border border-[#EBE4DC] p-6 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
              <h3 className="font-serif text-lg font-semibold text-gray-800 pb-2 border-b">
                Delivery Details
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    icon: User,
                    label: "Customer Name",
                    value: order.customerName,
                  },
                  {
                    icon: MapPin,
                    label: "Delivery Address",
                    value: order.address,
                  },
                  {
                    icon: Phone,
                    label: "WhatsApp Number",
                    value: order.phone,
                  },
                  {
                    icon: Mail,
                    label: "Email Address",
                    value: order.email,
                    truncate: true,
                  },
                ].map((detail, idx) => {
                  const Icon = detail.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          {detail.label}
                        </span>
                        <span
                          className={cn(
                            "font-medium text-gray-800",
                            detail.truncate &&
                              "truncate block max-w-[200px]",
                            detail.label === "Delivery Address" &&
                              "leading-relaxed block"
                          )}
                        >
                          {detail.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
