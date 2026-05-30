"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";
import { checkoutSchema, checkoutFormSchemaType } from "@/lib/zodSchemas";
import { checkoutCart } from "@/app/actions/checkout";
import { cn } from "@/lib/utils";

// Reusable Floating Label Input using Geist Font
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, type = "text", id, ...props }, ref) => {
    return (
      <div className="relative font-[family-name:var(--font-geist-sans)] w-full">
        <input
          type={type}
          id={id}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer block w-full rounded-xl border border-[#EBE4DC] bg-white px-3.5 pt-5 pb-1.5 text-sm text-gray-800 transition-all outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 placeholder:text-transparent",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3.5 top-1.5 z-10 origin-[0] -translate-y-1.5 scale-75 transform text-xs text-muted-foreground duration-150 pointer-events-none",
            "peer-placeholder-shown:translate-y-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm",
            "peer-focus:-translate-y-1.5 peer-focus:scale-75 peer-focus:text-pink-500",
            error && "peer-focus:text-destructive text-destructive/80"
          )}
        >
          {label}
        </label>
        {error && (
          <p className="text-[11px] text-destructive mt-1 font-sans font-medium pl-1">{error}</p>
        )}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

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
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = form;

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

        const ownerWhatsAppNumber = process.env.NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER || "916290665156";
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
    <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 md:p-8 relative overflow-hidden shadow-sm font-[family-name:var(--font-geist-sans)]">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3.5">
            <FloatingInput
              id="customerName"
              label="Full Name"
              error={errors.customerName?.message}
              {...register("customerName")}
            />
            <FloatingInput
              id="phone"
              label="WhatsApp Number (10-digit Indian Number)"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <FloatingInput
              id="email"
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <FloatingInput
              id="address"
              label="Delivery Address"
              error={errors.address?.message}
              {...register("address")}
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
              Upon clicking, your order is saved, and WhatsApp will open to finalise payment and courier dispatch with Muskan.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
