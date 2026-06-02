"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrder, markAsPaidAndShip } from "@/app/actions/order.action";

interface OrderItemType {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
}

interface OrderType {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED";
  paymentMethod: string;
  createdAt: Date | string;
  items: OrderItemType[];
}

interface OrderDetailsSheetProps {
  order: OrderType | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

export function OrderDetailsSheet({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}: OrderDetailsSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [copiedLabel, setCopiedLabel] = useState(false);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [whatsappInfo, setWhatsappInfo] = useState<{
    phone: string;
    message: string;
  } | null>(null);

  if (!order) return null;

  const formattedId = order.id.slice(0, 8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleCopyShippingLabel = async () => {
    const labelText = `Customer: ${order.customerName}\nPhone: ${order.phone}\nAddress: ${order.address}`;
    try {
      await navigator.clipboard.writeText(labelText);
      setCopiedLabel(true);
      toast.success("Shipping label copied to clipboard!");
      setTimeout(() => setCopiedLabel(false), 2000);
    } catch (err) {
      toast.error("Failed to copy shipping label");
    }
  };

  const handleStatusChange = (newStatus: any) => {
    startTransition(async () => {
      const res = await updateOrder(order.id, {
        status: newStatus,
        paymentMethod: order.paymentMethod as any,
      });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        onOrderUpdated?.();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  const handlePaymentMethodChange = (newMethod: any) => {
    startTransition(async () => {
      const res = await updateOrder(order.id, {
        status: order.status,
        paymentMethod: newMethod,
      });
      if (res.success) {
        toast.success(`Order payment method updated to ${newMethod}`);
        onOrderUpdated?.();
      } else {
        toast.error(res.error || "Failed to update payment method");
      }
    });
  };

  const handlePaidAndShip = () => {
    startTransition(async () => {
      const res = await markAsPaidAndShip(order.id);
      if (res.success && res.phone && res.message) {
        toast.success("Order marked as PAID & FULFILLED!");
        setWhatsappInfo({ phone: res.phone, message: res.message });
        setWhatsappDialogOpen(true);
        onOrderUpdated?.();
      } else {
        toast.error(res.error || "Failed to ship order");
      }
    });
  };

  const handleOpenWhatsApp = () => {
    if (whatsappInfo) {
      const url = `https://wa.me/${whatsappInfo.phone}?text=${encodeURIComponent(whatsappInfo.message)}`;
      window.open(url, "_blank");
      setWhatsappDialogOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="bg-[#FDFBF7] border-l border-[#EBE4DC] p-0 sm:max-w-md md:max-w-lg w-full flex flex-col font-sans overflow-hidden">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-[#EBE4DC]/60 space-y-1 bg-[#FAF6F0]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-[#EBE4DC] text-[#4E3E2F] px-2 py-0.5 rounded-md font-mono font-bold tracking-wide">
                #{formattedId}
              </span>
              <span className="text-xs text-muted-foreground">{orderDate}</span>
            </div>
            <SheetTitle className="font-serif text-xl font-bold text-[#4E3E2F] mt-2">
              Order Details
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Verify customer details, manage order status, and complete
              fulfillment.
            </SheetDescription>
          </SheetHeader>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Order Status Toggles */}
            <div className="bg-white border border-[#EBE4DC] rounded-xl p-4 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider mb-2">
                Order Control Panel
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Field className="space-y-1">
                  <FieldLabel className="text-xs text-[#5C4D3E] font-semibold">
                    Fulfillment Status
                  </FieldLabel>
                  <Select
                    value={order.status}
                    onValueChange={handleStatusChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="bg-white border-[#EBE4DC] h-9 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#EBE4DC]">
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field className="space-y-1">
                  <FieldLabel className="text-xs text-[#5C4D3E] font-semibold">
                    Payment Mode
                  </FieldLabel>
                  <Select
                    value={order.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="bg-white border-[#EBE4DC] h-9 text-xs">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#EBE4DC]">
                      <SelectItem value="COD">COD</SelectItem>
                      <SelectItem value="PREPAID">Prepaid</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white border border-[#EBE4DC] rounded-xl p-4 space-y-4 shadow-2xs relative">
              <div className="flex justify-between items-center border-b border-[#EBE4DC]/60 pb-2 mb-2">
                <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">
                  Customer Information
                </h3>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleCopyShippingLabel}
                  className="h-7 text-[10px] text-[#4E3E2F] hover:bg-[#FAF6F0] border border-[#EBE4DC] rounded-md gap-1 px-2"
                >
                  {copiedLabel ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  Copy Label
                </Button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Customer Name
                    </span>
                    <span className="font-semibold text-[#4E3E2F]">
                      {order.customerName}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      WhatsApp Number
                    </span>
                    <span className="font-semibold text-[#4E3E2F]">
                      {order.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Email Address
                    </span>
                    <span className="font-semibold text-[#4E3E2F] truncate max-w-[240px] block">
                      {order.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Fulfillment Address
                    </span>
                    <span className="font-medium text-[#4E3E2F] leading-relaxed block">
                      {order.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items Summary */}
            <div className="bg-white border border-[#EBE4DC] rounded-xl p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider border-b border-[#EBE4DC]/60 pb-2">
                Items Ordered
              </h3>

              <div className="divide-y divide-[#EBE4DC]/40 space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start pt-2 first:pt-0"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-[#4E3E2F] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.quantity}x @ ₹{item.priceAtPurchase.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#4E3E2F]">
                      ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#EBE4DC] pt-3 mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#4E3E2F] pt-1">
                  <span>Total Paid</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <SheetFooter className="p-6 border-t border-[#EBE4DC]/60 bg-[#FAF6F0]/40 flex flex-col gap-2 mt-auto">
            {order.status !== "FULFILLED" && (
              <Button
                onClick={handlePaidAndShip}
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 transition-transform active:scale-[0.99]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Mark as Paid & Ship</>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="w-full border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] rounded-xl h-10 text-xs"
            >
              Close Details
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* WhatsApp Handoff Dialog Modal */}
      {whatsappDialogOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl space-y-4 animate-in fade-in-50 zoom-in-95 relative overflow-hidden">
            <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

            <h3 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-2">
              WhatsApp Notification
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Order status is updated in the database. Dispatched Nodemailer
              email receipt to <strong>{order.email}</strong>.
            </p>
            <p className="text-xs text-[#5C4D3E] font-medium bg-[#FAF6F0] p-3 rounded-lg border border-[#EBE4DC] leading-relaxed">
              {whatsappInfo?.message}
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setWhatsappDialogOpen(false);
                  onClose();
                }}
                className="flex-1 border-[#EBE4DC] text-[#4E3E2F] rounded-lg text-xs"
              >
                Skip
              </Button>
              <Button
                onClick={handleOpenWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs gap-1"
              >
                Send WhatsApp
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
