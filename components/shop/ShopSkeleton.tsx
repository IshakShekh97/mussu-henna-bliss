import React from "react";
import { GoldShimmer } from "@/components/animations";
import { Flower } from "lucide-react";

export default function ShopSkeleton() {
  return (
    <div className="space-y-8 font-sans">
      {/* Shimmering Filter Controls Bar */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col gap-5">
          {/* Top Row: Search & Sort placeholders */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input Placeholder */}
            <div className="relative flex-1 max-w-md h-10">
              <GoldShimmer className="w-full h-full rounded-xl" />
            </div>
            
            {/* Sort & Toggle Placeholders */}
            <div className="flex flex-wrap items-center gap-4">
              <GoldShimmer className="h-9 w-28 rounded-lg" />
              <GoldShimmer className="h-9 w-36 rounded-xl" />
            </div>
          </div>

          {/* Bottom Row: Category Pills Placeholder */}
          <div className="flex flex-col gap-2">
            <GoldShimmer className="h-3 w-20 rounded" />
            <div className="flex flex-wrap gap-2 pt-1">
              {["All", "Cones", "Kits", "Aftercare"].map((_, idx) => (
                <GoldShimmer key={idx} className="h-8 w-16 sm:w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shimmering Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="relative flex flex-col bg-[#FDFBF7] rounded-xl p-3 sm:p-4 border border-[#EBE4DC] shadow-sm overflow-hidden"
          >
            {/* Decorative Inner Border */}
            <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC] rounded-lg pointer-events-none z-0" />

            {/* Vintage Corner Flourishes */}
            <div className="absolute top--0.75 left--0.75 text-[#D4C3B3]/40 z-10 bg-[#FDFBF7] rounded-full p-0.5">
              <Flower size={14} strokeWidth={1.5} />
            </div>
            <div className="absolute top--0.75 right--0.75 text-[#D4C3B3]/40 z-10 bg-[#FDFBF7] rounded-full p-0.5">
              <Flower size={14} strokeWidth={1.5} />
            </div>
            <div className="absolute bottom--0.75 left--0.75 text-[#D4C3B3]/40 z-10 bg-[#FDFBF7] rounded-full p-0.5">
              <Flower size={14} strokeWidth={1.5} />
            </div>
            <div className="absolute bottom--0.75 right--0.75 text-[#D4C3B3]/40 z-10 bg-[#FDFBF7] rounded-full p-0.5">
              <Flower size={14} strokeWidth={1.5} />
            </div>

            {/* Product Image Area */}
            <div className="relative rounded-lg overflow-hidden bg-white aspect-square mb-4 mt-2 mx-1 z-10 border border-[#EBE4DC]/50 shadow-sm">
              <GoldShimmer className="w-full h-full" />
            </div>

            {/* Product Title Shimmer */}
            <div className="flex justify-center mb-2 z-10">
              <GoldShimmer className="h-4.5 w-3/4 rounded" />
            </div>

            {/* Separator Shimmer */}
            <div className="py-2 flex justify-center z-10">
              <div className="w-1/2 h-0.5 border-t border-dashed border-[#EBE4DC]" />
            </div>

            {/* Action Buttons Shimmer */}
            <div className="flex items-center gap-2 mt-auto pt-2 px-1 z-10 w-full">
              <GoldShimmer className="h-8.5 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
