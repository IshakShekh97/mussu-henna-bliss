"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { ShoppingCart } from "lucide-react";
import Cart from "./Cart";
import { Button } from "../ui/button";

const CartButton = () => {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <Cart>
      <Button
        type="button"
        variant={"outline"}
        size={"icon-lg"}
        className="relative cursor-pointer"
      >
        <ShoppingCart size={24} className="text-foreground" />
        {isMounted && (
          <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in scale-in duration-200">
            {totalItems}
          </span>
        )}
      </Button>
    </Cart>
  );
};

export default CartButton;
