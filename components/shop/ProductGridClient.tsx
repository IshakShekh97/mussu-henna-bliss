"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, Inbox, Check } from "lucide-react";
import ProductCard from "./ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  stock: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ProductGridClientProps {
  initialProducts: Product[];
}

export default function ProductGridClient({ initialProducts }: ProductGridClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Dynamically extract categories present in the products list
  const categories = useMemo(() => {
    const list = new Set(initialProducts.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, [initialProducts]);

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Availability filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock && p.stock > 0);
    }

    // Sorting logic
    result.sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      }
      if (sortBy === "price-high") {
        return b.price - a.price;
      }
      // default: newest
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [initialProducts, searchQuery, selectedCategory, sortBy, inStockOnly]);

  return (
    <div className="space-y-8">
      {/* Premium Filter Controls Bar */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Inner Border */}
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col gap-5">
          {/* Top Row: Search & Sort/Toggle */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBE4DC] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort & Stock Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Stock Filter Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none group py-1.5 px-3 rounded-lg hover:bg-primary/5 transition-colors border border-transparent active:scale-98">
                <div className="relative flex items-center justify-center w-4.5 h-4.5 border border-[#C69C7B] rounded bg-white group-hover:border-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="absolute opacity-0 cursor-pointer w-full h-full"
                  />
                  {inStockOnly && <Check className="w-3.5 h-3.5 text-primary stroke-[3px]" />}
                </div>
                <span className="text-xs font-medium text-gray-700 font-sans">
                  In Stock Only
                </span>
              </label>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="text-gray-400 w-4 h-4" />
                <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                  <SelectTrigger className="w-[140px] text-xs h-9 bg-white border border-[#EBE4DC] rounded-xl font-medium text-gray-700 font-sans">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Dynamic Category Pills */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-sans flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-[#C69C7B]" />
              Categories
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((category) => {
                const isActive =
                  selectedCategory.toLowerCase() === category.toLowerCase();
                return (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-sm shadow-primary/25"
                        : "bg-white border-[#EBE4DC] text-gray-600 hover:border-primary/50 hover:text-primary"
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid with AnimatePresence */}
      {filteredAndSortedProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Styled Empty State matching site aesthetics */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center py-16 px-6 bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 rounded-full bg-primary/5 text-[#C69C7B] border border-[#EBE4DC]/80 animate-pulse">
              <Inbox className="w-8 h-8 stroke-[1.2]" />
            </div>
            <h3
              className="text-xl font-light text-gray-800 font-morlana"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              No Products Found
            </h3>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              We couldn't find any products matching your current search or filter options. Try adjusting the search query or category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setInStockOnly(false);
                setSortBy("newest");
              }}
              className="inline-flex items-center justify-center px-5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-semibold tracking-wide transition-all border border-primary/20 active:scale-98 cursor-pointer"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
