import React from "react";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  price: string;
  image?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col">
      <div className="relative bg-[#fbf7f3] rounded-lg overflow-hidden shadow-sm">
        <motion.div
          className="aspect-square w-full flex items-center justify-center"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <img
            src={product.image || "/fonts/images/placeholder.png"}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </motion.div>

        <button
          aria-label="Add to cart"
          className="absolute right-3 top-3 bg-white/90 text-gray-800 rounded-full p-2 shadow hover:bg-pink-50"
        >
          +
        </button>
      </div>

      <div className="mt-3 text-sm">
        <div
          className="font-semibold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {product.name}
        </div>
        <div
          className="text-gray-600"
          style={{ fontFamily: "'Geist Sans', system-ui, -apple-system" }}
        >
          {product.price}
        </div>
        <button className="mt-3 w-full py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
