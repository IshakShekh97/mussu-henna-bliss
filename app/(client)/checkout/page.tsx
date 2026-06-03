"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { useCartStore } from "@/lib/cartStore";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import TulipSeprator from "@/components/common/TulipSeprator";
import { Button } from "@/components/ui/button";
import { PageHeader, FadeIn, GoldShimmer } from "@/components/animations";

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12">
        <GoldShimmer className="h-8 w-1/4 mb-8 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <GoldShimmer className="h-12 w-full rounded-xl" />
            <GoldShimmer className="h-12 w-full rounded-xl" />
            <GoldShimmer className="h-48 w-full rounded-xl" />
            <GoldShimmer className="h-12 w-3/4 rounded-xl" />
          </div>
          <div className="space-y-4">
            <GoldShimmer className="h-32 w-full rounded-xl" />
            <GoldShimmer className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const isCartEmpty = items.length === 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 md:py-12">
      {/* Back to Shop Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </Link>
      </motion.div>

      {isCartEmpty ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="max-w-2xl mx-auto text-center py-16 px-6 bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] shadow-sm relative overflow-hidden my-6 font-sans"
        >
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

          <motion.div
            initial={{ y: 10 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBag className="h-16 w-16 text-muted-foreground/35 mx-auto mb-4 stroke-[1.2]" />
          </motion.div>
          <h1 className="text-3xl font-morlana font-light text-gray-800 mb-2">
            Your Tray is Empty
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8 font-light leading-relaxed">
            You don't have any items in your tray to checkout. Let's head over
            to the shop to find some Henna Bliss cones.
          </p>
          <div className="relative z-10">
            <Button
              asChild
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans px-8 py-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] active:scale-[0.97]"
            >
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Page Headers */}
          <PageHeader
            badge="✨ Secure Checkout"
            title="Complete Your Henna Order"
            highlightedWord="Henna"
            description="Provide details below to save your order and confirm delivery via WhatsApp."
          />

          <TulipSeprator variant="wavy" className="my-8" />

          {/* Form and summary layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-10">
            {/* Form column (Left) */}
            <FadeIn direction="left" delay={0.3} className="lg:col-span-2">
              <CheckoutForm />
            </FadeIn>

            {/* Receipt column (Right) */}
            <FadeIn direction="right" delay={0.5}>
              <div className="lg:sticky lg:top-24">
                <OrderSummary />
              </div>
            </FadeIn>
          </div>
        </>
      )}
    </div>
  );
}
