"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { GoldShimmer } from "@/components/animations";

export default function OrderSummary() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, getTotalPrice } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 relative overflow-hidden shadow-sm h-64 space-y-4">
        <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />
        <div className="border-b border-[#EBE4DC]/60 pb-3 flex items-center gap-2">
          <div className="h-4.5 w-4.5 bg-[#EBE4DC]/60 rounded-full shrink-0" />
          <GoldShimmer className="h-5 w-1/3 rounded" />
        </div>
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <GoldShimmer className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <GoldShimmer className="h-4 w-3/4 rounded" />
              <GoldShimmer className="h-3 w-1/4 rounded" />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <GoldShimmer className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <GoldShimmer className="h-4 w-1/2 rounded" />
              <GoldShimmer className="h-3 w-1/4 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();

  return (
    <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 relative overflow-hidden shadow-sm font-[family-name:var(--font-geist-sans)]">
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

      <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-[#EBE4DC]/60 flex items-center gap-2 relative z-10">
        <ShoppingBag className="h-4.5 w-4.5 text-primary" /> Order Summary
      </h3>

      <div className="divide-y divide-[#EBE4DC]/40 space-y-3 relative z-10 max-h-[320px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center gap-4 pt-3 first:pt-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-12 w-12 min-w-12 overflow-hidden rounded-lg bg-secondary border border-border/40">
                <Image
                  src={item.imageUrl || "/images/hero-1.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <span className="font-medium text-sm text-gray-700 shrink-0">
              ₹{(item.quantity * item.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#EBE4DC] mt-6 pt-4 space-y-2 relative z-10">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-[#EBE4DC]/40 pt-2 mt-2">
          <span>Total Amount</span>
          <span className="text-primary">₹{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
