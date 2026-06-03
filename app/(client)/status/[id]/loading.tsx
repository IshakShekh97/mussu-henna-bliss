import React from "react";
import { GoldShimmer } from "@/components/animations";
import TulipSeprator from "@/components/common/TulipSeprator";
import { Calendar, ShoppingBag } from "lucide-react";

export default function StatusLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto py-6 md:py-12 font-sans animate-fade-in">
      {/* Top Back Navigation Shimmer */}
      <div className="mb-8">
        <GoldShimmer className="h-5 w-32 rounded-lg" />
      </div>

      {/* Page Header Shimmer */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
        <GoldShimmer className="h-6 w-36 rounded-full" />
        <GoldShimmer className="h-10 w-80 max-w-full rounded-lg" />
        <GoldShimmer className="h-4 w-96 max-w-xs rounded" />
      </div>

      <TulipSeprator variant="wavy" className="my-8" />

      {/* Main Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-10">
        {/* Left Column: Timeline & CTA Shimmer */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-8 md:p-10 relative overflow-hidden shadow-sm">
            <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="border-b border-[#EBE4DC] pb-4">
                <GoldShimmer className="h-7 w-48 rounded" />
              </div>

              {/* Vertical steps shimmer */}
              <div className="relative border-l border-[#EBE4DC] ml-4 pl-8 space-y-8 py-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div className="absolute -left-[41px] top-0.5 bg-white border-2 border-[#EBE4DC] rounded-full h-6 w-6 flex items-center justify-center">
                      <div className="h-2.5 h-2.5 rounded-full bg-[#EBE4DC]" />
                    </div>
                    {/* Texts */}
                    <div className="space-y-2">
                      <GoldShimmer className="h-5 w-48 rounded" />
                      <GoldShimmer className="h-4 w-3/4 rounded" />
                      <GoldShimmer className="h-3 w-24 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Handoff Help Box Shimmer */}
          <div className="bg-[#FAF6EE] rounded-3xl border border-[#E9DFD0] p-6 md:p-8 space-y-4">
            <GoldShimmer className="h-6 w-60 rounded" />
            <div className="space-y-2">
              <GoldShimmer className="h-4 w-full rounded" />
              <GoldShimmer className="h-4 w-5/6 rounded" />
            </div>
            <GoldShimmer className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Column: Logistics / Summary Cards Shimmer */}
        <div className="space-y-8">
          {/* Card 1: Info Summary */}
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 relative overflow-hidden shadow-sm">
            <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-5">
              <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-[#EBE4DC]/60 flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-primary/30" /> 
                <GoldShimmer className="h-5 w-28 rounded" />
              </h3>

              <div className="space-y-3.5">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-2 border-b border-[#EBE4DC]/20">
                    <div className="space-y-1.5 flex-1">
                      <GoldShimmer className="h-4 w-32 rounded" />
                      <GoldShimmer className="h-3 w-20 rounded" />
                    </div>
                    <GoldShimmer className="h-4 w-12 rounded" />
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-[#EBE4DC]">
                <div className="flex justify-between">
                  <GoldShimmer className="h-3 w-16 rounded" />
                  <GoldShimmer className="h-3 w-12 rounded" />
                </div>
                <div className="flex justify-between border-t border-[#EBE4DC]/40 pt-2 mt-2">
                  <GoldShimmer className="h-5 w-24 rounded" />
                  <GoldShimmer className="h-5 w-16 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Card */}
          <div className="bg-white rounded-3xl border border-[#EBE4DC] p-6 shadow-sm space-y-4">
            <div className="border-b pb-2">
              <GoldShimmer className="h-5 w-32 rounded" />
            </div>
            
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="h-4 w-4 bg-[#EBE4DC]/60 rounded-full mt-1 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <GoldShimmer className="h-3 w-20 rounded" />
                    <GoldShimmer className="h-4 w-40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
