import React from "react";
import { motion } from "framer-motion";
import { Flower, ShoppingCart } from "lucide-react";
import TulipSeprator from "../common/TulipSeprator";

type Product = {
  id: string;
  name: string;
  price: number;
  imagePath?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
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
      <div className="relative rounded-lg overflow-hidden bg-white aspect-square mb-4 mt-2 mx-1 z-10 border border-[#EBE4DC]/50 shadow-sm">
        <motion.img
          src={product.imagePath || "/fonts/images/placeholder.png"}
          alt={product.name}
          className="object-cover w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white/95 text-gray-900 px-5 py-2.5 rounded-full font-medium text-sm shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95">
            Quick View
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs md:text-sm font-semibold text-primary">
            ₹{product.price}
          </span>
        </div>
      </div>

      <h3
        className="text-gray-800 font-medium text-[1rem] text-center sm:text-[1.05rem] leading-tight flex-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {product.name}
      </h3>

      <TulipSeprator variant="wavy" />
      {/* Product Info */}
      <div className="flex flex-col mt-auto pt-2 px-1 z-10 w-full">
        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 bg-primary/80 hover:bg-primary text-white rounded-md font-medium text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#E2A6A6] focus:outline-none shadow-sm shrink-0 w-full sm:w-auto"
        >
          <ShoppingCart size={15} />
          <span>Add</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
