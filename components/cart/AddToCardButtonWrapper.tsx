"use client";

import { useCartStore } from "@/lib/cartStore";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface AddToCardButtonWrapperProps {
  children: React.ReactNode;
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl: string;
}

export default function AddToCardButtonWrapper({
  children,
  productId,
  productImageUrl,
  productName,
  productPrice,
}: AddToCardButtonWrapperProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      imageUrl: productImageUrl,
    });

    toast.success(`${productName} added to cart!`, {
      description: "You can view your cart to see the added item.",
      style: {
        background: "#c60036",
        color: "#fff",
      },
    });
  };

  return (
    <Button asChild onClick={handleAddToCart}>
      {children}
    </Button>
  );
}
