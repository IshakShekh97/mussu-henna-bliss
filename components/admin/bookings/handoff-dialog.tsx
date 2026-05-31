"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Copy, Check, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/zodSchemas";
import { getWhatsAppLink } from "@/lib/utils";

interface HandoffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedLink: string;
  booking: Booking | null;
}

export function HandoffDialog({
  open,
  onOpenChange,
  generatedLink,
  booking,
}: HandoffDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-6 shadow-lg text-center gap-5">
        <DialogHeader className="items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-2">
            <Sparkles className="h-6 w-6 text-emerald-600 animate-pulse" />
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-[#4E3E2F]">
            🎉 Quote Generated Successfully
          </DialogTitle>
          <DialogDescription className="text-xs">
            Live tracking link generated for custom price quotes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-[#FAF6F0] border border-[#EBE4DC] p-3.5 rounded-xl font-mono text-2xs text-[#4E3E2F] select-all break-all flex justify-between items-center gap-2">
            <span>{generatedLink}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-[#EBE4DC] rounded text-[#8C7A6B] transition-colors shrink-0 cursor-pointer"
              title="Copy tracking link"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-neutral-100 flex items-center justify-center gap-1.5 rounded-xl text-xs py-5 cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              Copy Link
            </Button>
            {booking && (
              <a
                href={getWhatsAppLink(booking)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-xs items-center justify-center gap-1.5 select-none active:scale-[0.99] transition-transform text-center"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Open WhatsApp Dispatch Tool
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
