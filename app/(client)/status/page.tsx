"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import TulipSeprator from "@/components/common/TulipSeprator";
import { Button } from "@/components/ui/button";

export default function StatusLookupPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleanId = orderId.trim();

    if (!cleanId) {
      toast.error("Please enter a valid Order ID");
      return;
    }

    setIsLoading(true);
    // Redirect to the dynamic status page
    router.push(`/status/${cleanId}`);
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 md:py-12">
      {/* Page Headers */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-lg font-light mb-2 font-serif text-primary">✨ Order Tracking</div>
        <h1 className="text-4xl md:text-5xl font-morlana font-light text-gray-800 leading-tight">
          Track Your <span className="text-primary font-black">Henna</span> Order
        </h1>
        <p className="text-sm text-muted-foreground mt-3 font-light">
          Enter your Order ID below to view your real-time preparation and delivery status.
        </p>
      </div>

      <TulipSeprator variant="wavy" className="my-8" />

      {/* Lookup Card */}
      <div className="max-w-xl mx-auto mt-10 font-[family-name:var(--font-geist-sans)]">
        <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 md:p-10 relative overflow-hidden shadow-sm">
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

          <div className="relative z-10">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative w-full">
                <input
                  type="text"
                  id="orderIdInput"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder=" "
                  className="peer block w-full rounded-xl border border-[#EBE4DC] bg-white px-4 pt-5 pb-1.5 text-sm text-gray-800 transition-all outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 placeholder:text-transparent"
                />
                <label
                  htmlFor="orderIdInput"
                  className="absolute left-4 top-1.5 z-10 origin-[0] -translate-y-1.5 scale-75 transform text-xs text-muted-foreground duration-150 pointer-events-none peer-placeholder-shown:translate-y-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:-translate-y-1.5 peer-focus:scale-75 peer-focus:text-pink-500"
                >
                  Order ID (e.g. 550e8400-e29b-41d4-a716-446655440000)
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-6 rounded-xl text-md flex items-center justify-center gap-2 shadow-md shadow-pink-500/10 transition-all duration-300 hover:scale-[1.005] active:scale-[0.995]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4.5 w-4.5 mr-1" />
                    Track Order
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#EBE4DC]/60 text-xs text-muted-foreground font-light leading-relaxed space-y-2">
              <p className="font-semibold text-gray-700">Where can I find my Order ID?</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Check the WhatsApp handoff text message template you sent to Muskan.</li>
                <li>Check the confirmation receipt sent to your email address.</li>
                <li>Reach out to support directly if you cannot locate your Order ID.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
