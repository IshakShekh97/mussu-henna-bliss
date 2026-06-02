import React from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";

import prisma from "@/lib/prisma";
import TulipSeprator from "@/components/common/TulipSeprator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderStatusPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch the order, its items, and nested product details
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Render a beautiful not found state inside the component for better UX
  if (!order) {
    const ownerWhatsAppNumber = process.env.NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER;
    const helpUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(
      `Hi Muskan! I am trying to track my order but the system says it doesn't exist. My Order ID is: ${id}`,
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

        <AlertTriangle className="h-16 w-16 text-primary mx-auto mb-4 stroke-[1.2] animate-bounce-slow" />
        <h1 className="text-3xl font-morlana font-light text-gray-800 mb-2">
          Order Not Found
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
          We couldn't find an order with ID{" "}
          <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-xs">
            {id}
          </span>
          . Please verify your tracking URL or contact Muskan for help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-[#EBE4DC] hover:bg-muted font-sans px-6 py-5"
          >
            <Link href="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-sans px-6 py-5"
          >
            <a href={helpUrl} target="_blank" rel="noopener noreferrer">
              Contact Support
            </a>
          </Button>
        </div>
      </div>
    );
  }

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

      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-lg font-light mb-2 font-serif text-primary">
          ✨ Order Tracking
        </div>
        <h1 className="text-4xl md:text-5xl font-morlana font-light text-gray-800 leading-tight">
          Track Your{" "}
          <span className="text-primary font-black">Henna Bliss</span> Order
        </h1>
        <p className="text-sm text-muted-foreground mt-3 font-light">
          Order ID:{" "}
          <span className="font-mono text-xs bg-[#FAF9F5] border border-[#EBE4DC] px-2 py-1 rounded-md text-foreground">
            {order.id}
          </span>
        </p>
      </div>

      <TulipSeprator variant="wavy" className="my-8" />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-10 font-[family-name:var(--font-geist-sans)]">
        {/* Left Hand: Order Timeline & Help Card */}
        <div className="lg:col-span-2 space-y-8">
          {/* Visual Order Timeline */}
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-8 md:p-10 relative overflow-hidden shadow-sm">
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
          <div className="bg-[#FAF6EE] rounded-3xl border border-[#E9DFD0] p-6 md:p-8 space-y-4">
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
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.005]"
            >
              <a href={contactUrl} target="_blank" rel="noopener noreferrer">
                Message Muskan on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Right Hand: Order Summary & Address Cards */}
        <div className="space-y-8">
          {/* Order Summary receipt card */}
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 relative overflow-hidden shadow-sm">
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
                      Qty: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}
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
          <div className="bg-white rounded-3xl border border-[#EBE4DC] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gray-800 pb-2 border-b">
              Delivery Details
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Customer Name
                  </span>
                  <span className="font-medium text-gray-800">
                    {order.customerName}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Delivery Address
                  </span>
                  <span className="font-medium text-gray-800 leading-relaxed block">
                    {order.address}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">
                    WhatsApp Number
                  </span>
                  <span className="font-medium text-gray-800">
                    {order.phone}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Email Address
                  </span>
                  <span className="font-medium text-gray-800 truncate block max-w-[200px]">
                    {order.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
