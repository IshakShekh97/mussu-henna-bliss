"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cartStore";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface CartProps {
  children: React.ReactNode;
}

const Cart = ({ children }: CartProps) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { items, addItem, removeItem, updateQuantity, clearCart } =
    useCartStore();

  // Calculate cart subtotal safely
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        aria-describedby="cart content"
        side="right"
        className="w-full sm:max-w-md flex flex-col justify-between p-6"
      >
        <div className="flex flex-col grow overflow-hidden">
          <SheetHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
              </SheetTitle>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
          </SheetHeader>

          {/* Cart Items List */}
          <div className="grow overflow-y-auto py-4 space-y-4 pr-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/40 stroke-[1.5]" />
                <p className="text-muted-foreground font-medium">
                  Your cart is empty
                </p>
                <p className="text-xs text-muted-foreground/70 max-w-50">
                  Looks like you {"haven't"} added any Henna bliss to your tray
                  yet!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-2 rounded-xl border border-border/40 bg-card/50"
                >
                  <div className="relative h-16 w-16 min-w-16 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      // src={item.imageUrl}
                      src={item.imageUrl || "/images/hero-1.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-primary font-medium mt-0.5">
                      ₹{item.price.toFixed(2)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 rounded-md"
                        onClick={() => removeItem(item.id)} // Assuming store removes 1 or drops item if qty < 1
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-semibold w-4 text-center">
                        {item.quantity || 1}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 rounded-md"
                        onClick={() => addItem(item)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Immediate Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => {
                      // Remove the item entirely
                      updateQuantity(item.id, 0);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Checkout Summary Footer */}
        {items.length > 0 && (
          <div className="border-t pt-4 bg-background space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <hr className="border-border/60" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Button
              asChild
              className="w-full py-6 rounded-xl text-md font-semibold tracking-wide shadow-md"
              onClick={() => setOpen(false)}
            >
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
