"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/lib/cartStore";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import TulipSeprator from "@/components/common/TulipSeprator";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-100 rounded-3xl"></div>
          <div className="h-64 bg-gray-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const isCartEmpty = items.length === 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 md:py-12">
      {/* Back to Shop Navigation */}
      <div className="mb-8">
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </Link>
      </div>

      {isCartEmpty ? (
        <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] shadow-sm relative overflow-hidden my-6 font-[family-name:var(--font-geist-sans)]">
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

          <ShoppingBag className="h-16 w-16 text-muted-foreground/35 mx-auto mb-4 stroke-[1.2] animate-bounce-slow" />
          <h1 className="text-3xl font-morlana font-light text-gray-800 mb-2">Your Tray is Empty</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8 font-light leading-relaxed">
            You don't have any items in your tray to checkout. Let's head over to the shop to find some Henna Bliss cones.
          </p>
          <div className="relative z-10">
            <Button asChild className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-sans px-8 py-5">
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Page Headers */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-lg font-light mb-2 font-serif text-primary">✨ Secure Checkout</div>
            <h1 className="text-4xl md:text-5xl font-morlana font-light text-gray-800 leading-tight">
              Complete Your <span className="text-primary font-black">Henna</span> Order
            </h1>
            <p className="text-sm text-muted-foreground mt-3 font-light">
              Provide details below to save your order and confirm delivery via WhatsApp.
            </p>
          </div>

          <TulipSeprator variant="wavy" className="my-8" />

          {/* Form and summary layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-10">
            {/* Form column (Left) */}
            <div className="lg:col-span-2">
              <CheckoutForm />
            </div>

            {/* Receipt column (Right) */}
            <div className="lg:sticky lg:top-24">
              <OrderSummary />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
