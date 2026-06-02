"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";
import { checkoutSchema, checkoutFormSchemaType } from "@/lib/zodSchemas";
import { checkoutCart } from "@/app/actions/checkout.action";

export default function CheckoutForm() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, clearCart, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();

  const form = useForm<checkoutFormSchemaType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      address: "",
      items: [],
      totalAmount: 0,
    },
    mode: "onBlur",
  });

  const { control, handleSubmit, setValue, reset } = form;

  // Mount safety check for Zustand hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update items and totalAmount in react-hook-form whenever store items change
  useEffect(() => {
    if (isMounted) {
      const formattedItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      setValue("items", formattedItems);
      setValue("totalAmount", subtotal);
    }
  }, [items, subtotal, setValue, isMounted]);

  async function onSubmit(data: checkoutFormSchemaType) {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await checkoutCart(data);

      if (result.success && result.orderId) {
        toast.success("Order placed successfully!", {
          description: "Redirecting you to WhatsApp to confirm your order...",
        });

        const orderId = result.orderId;
        const total = subtotal.toFixed(2);

        // 1. Clear cart
        clearCart();
        reset();

        // 2. Format WhatsApp Message
        const trackingLink = `${window.location.origin}/status/${orderId}`;
        const messageText = `Hi Muskan! I just placed an order. My Order ID is ${orderId}. My total is ₹${total}. Here is my tracking link: ${trackingLink}`;
        const encodedMessage = encodeURIComponent(messageText);

        const ownerWhatsAppNumber =
          process.env.NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER;
        const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodedMessage}`;

        // 3. Open WhatsApp link and redirect status page in local client
        window.open(whatsappUrl, "_blank");
        router.push(`/status/${orderId}`);
      } else {
        toast.error(result.error || "Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) {
    return (
      <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 relative overflow-hidden shadow-sm animate-pulse h-[340px]">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 md:p-8 relative overflow-hidden shadow-sm font-sans">
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

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBE4DC]/60">
          <h3 className="font-serif text-xl font-semibold text-gray-800">
            Billing & Delivery Details
          </h3>
          <span className="text-[10px] text-pink-600 font-medium px-2 py-0.5 bg-pink-50 rounded-full border border-pink-100">
            Secure Check
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Controller
              name="customerName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="checkout-name"
                    className="text-sm font-medium text-foreground"
                  >
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="checkout-name"
                    placeholder="Enter your full name"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="checkout-phone"
                    className="text-sm font-medium text-foreground"
                  >
                    WhatsApp Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="checkout-phone"
                    type="tel"
                    placeholder="E.g., 9876543210"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                  />
                  <FieldDescription className="text-xs text-muted-foreground">
                    10-digit Indian Number.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="checkout-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="checkout-email"
                    type="email"
                    placeholder="Enter your email address"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="checkout-address"
                    className="text-sm font-medium text-foreground"
                  >
                    Delivery Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="checkout-address"
                    placeholder="E.g., Flat 402, Building A, Main Street"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="pt-4 border-t border-[#EBE4DC]/40 mt-6">
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-6 rounded-xl text-md flex items-center justify-center gap-2 shadow-md shadow-pink-500/10 transition-all duration-300 hover:scale-[1.005] active:scale-[0.995]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing Order...
                </>
              ) : (
                <>
                  Confirm Order via WhatsApp
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3 font-sans font-light leading-relaxed">
              Upon clicking, your order is saved, and WhatsApp will open to
              finalise payment and courier dispatch with Muskan.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
