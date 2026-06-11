"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Flower,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import TulipSeprator from "../common/TulipSeprator";
import AddToCardButtonWrapper from "../cart/AddToCardButtonWrapper";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const productImageUrl = product.imageUrl || "/fonts/images/placeholder.png";

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning("Cannot exceed available stock limit.", {
        style: { background: "#c60036", color: "#fff" },
      });
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCartFromDialog = () => {
    if (!product.inStock || product.stock <= 0) {
      toast.error("This product is currently out of stock.", {
        style: { background: "#c60036", color: "#fff" },
      });
      return;
    }

    const existingItem = items.find((item) => item.id === product.id);
    if (existingItem) {
      // Don't exceed stock limit in cart
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        updateQuantity(product.id, product.stock);
        toast.warning(
          `Adjusted quantity to maximum available stock (${product.stock}).`,
          {
            style: { background: "#c60036", color: "#fff" },
          },
        );
      } else {
        updateQuantity(product.id, newQty);
      }
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: productImageUrl,
      });
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    }

    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart.`,
      style: {
        background: "#c60036",
        color: "#fff",
      },
    });
    setIsOpen(false);
    setQuantity(1); // Reset
  };

  const isOutOfStock = !product.inStock || product.stock <= 0;

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex flex-col bg-[#FDFBF7] rounded-xl p-3 sm:p-4 border border-[#EBE4DC] shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
      >
        {/* Decorative Inner Border */}
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC] rounded-lg pointer-events-none z-0" />

        {/* Vintage Corner Flourishes */}
        <div className="absolute top--0.75 left--0.75 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5">
          <Flower size={14} strokeWidth={1.5} />
        </div>
        <div className="absolute top--0.75 right--0.75 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5">
          <Flower size={14} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom--0.75 left--0.75 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5">
          <Flower size={14} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom--0.75 right--0.75 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5">
          <Flower size={14} strokeWidth={1.5} />
        </div>

        {/* Product Image Area */}
        <div
          onClick={() => setIsOpen(true)}
          className="relative rounded-lg overflow-hidden bg-white aspect-square mb-4 mt-2 mx-1 z-10 border border-[#EBE4DC]/50 shadow-sm cursor-pointer"
        >
          <motion.img
            src={productImageUrl}
            alt={product.name}
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              className="bg-white/95 text-gray-900 px-5 py-2.5 rounded-full font-medium text-sm shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              Quick View
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <span className="text-xs md:text-sm font-semibold text-primary">
              ₹{product.price}
            </span>
          </div>

          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-[#c60036] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider shadow-sm">
              Sold Out
            </div>
          )}
        </div>

        <h3
          className="text-gray-800 font-medium text-[0.95rem] text-center sm:text-[1.05rem] leading-tight flex-1 cursor-pointer hover:text-primary transition-colors"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          onClick={() => setIsOpen(true)}
        >
          {product.name}
        </h3>

        <TulipSeprator variant="wavy" className="py-2" />

        {/* Product Info / Action Buttons */}
        <div className="flex items-center gap-2 mt-auto pt-2 px-1 z-10 w-full">
          {/* Add Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="flex-1 py-2 px-2.5 bg-gray-200 text-gray-400 rounded-md font-medium text-xs sm:text-sm cursor-not-allowed text-center"
            >
              Sold Out
            </button>
          ) : (
            <AddToCardButtonWrapper
              productId={product.id}
              productImageUrl={productImageUrl}
              productName={product.name}
              productPrice={product.price}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 bg-primary hover:bg-primary text-white rounded-md font-medium text-xs sm:text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#E2A6A6] focus:outline-none shadow-sm cursor-pointer"
              >
                <ShoppingCart size={13} />
                <span>Add</span>
              </motion.button>
            </AddToCardButtonWrapper>
          )}
        </div>
      </motion.div>

      {/* Elegant Quick View Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl! bg-[#FDFBF7] border border-[#EBE4DC] p-6 md:p-8 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] w-full!  ">
          {/* Decorative Inner Border */}
          <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />

          {/* Vintage Corner Flourishes */}
          <div className="absolute top-1.5 left-1.5 text-[#D4C3B3] z-10 pointer-events-none bg-[#FDFBF7] rounded-full p-0.5">
            <Flower size={14} strokeWidth={1.5} />
          </div>
          <div className="absolute top-1.5 right-1.5 text-[#D4C3B3] z-10 pointer-events-none bg-[#FDFBF7] rounded-full p-0.5">
            <Flower size={14} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-1.5 left-1.5 text-[#D4C3B3] z-10 pointer-events-none bg-[#FDFBF7] rounded-full p-0.5">
            <Flower size={14} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-1.5 right-1.5 text-[#D4C3B3] z-10 pointer-events-none bg-[#FDFBF7] rounded-full p-0.5">
            <Flower size={14} strokeWidth={1.5} />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Left side: Image */}
            <div className="relative w-full max-w-[240px] md:max-w-none aspect-square mx-auto rounded-xl overflow-hidden bg-white border border-[#EBE4DC] shadow-sm flex items-center justify-center">
              <img
                src={productImageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-[#c60036] text-white px-4 py-1.5 rounded-full text-xs uppercase font-bold tracking-widest shadow-md">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Right side: Product details */}
            <div className="flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                {/* Category & Stock Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-sans">
                    {product.category}
                  </span>

                  {isOutOfStock ? (
                    <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3 h-3" />
                      Out of Stock
                    </span>
                  ) : (
                    <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 font-sans">
                      <Check className="w-3.5 h-3.5" />
                      In Stock ({product.stock} left)
                    </span>
                  )}
                </div>

                <DialogHeader className="p-0">
                  <DialogTitle className="text-2xl md:text-3xl font-light text-gray-800 text-left font-morlana leading-tight">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>

                <p className="text-xl md:text-2xl font-bold text-primary font-sans">
                  ₹{product.price}
                </p>

                {/* Decorative wavy separator matching the site design inside the dialog */}
                <TulipSeprator variant="wavy" className="py-1 my-1" />

                <DialogDescription className="text-sm text-gray-600 font-light leading-relaxed text-left max-h-[140px] overflow-y-auto pr-1">
                  {product.description ||
                    "Indulge in our exquisite handcrafted organic henna products, designed to bring long-lasting stains and beautiful memories."}
                </DialogDescription>
              </div>

              {/* Action area: Quantity Selector & Add to Cart */}
              <div className="space-y-4 pt-2">
                {!isOutOfStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 font-sans">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-[#EBE4DC] rounded-xl bg-white shadow-sm">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="p-2.5 hover:bg-primary/5 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className="px-4 text-sm font-semibold text-gray-800 w-8 text-center select-none"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock}
                        className="p-2.5 hover:bg-primary/5 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  {isOutOfStock ? (
                    <button
                      disabled
                      className="w-full py-3.5 bg-gray-200 text-gray-400 rounded-xl font-semibold text-sm cursor-not-allowed transition-all"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={handleAddToCartFromDialog}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-xl font-semibold text-sm shadow-md shadow-primary/10 transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart - ₹{product.price * quantity}</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
