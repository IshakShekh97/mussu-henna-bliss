"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ArrowLeft,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrder, markAsPaidAndShip, cancelOrderAction, sendOrderEmailAction } from "@/app/actions/order.action";

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

interface OrderDetailsViewProps {
  order: OrderType;
}

export function OrderDetailsView({ order: initialOrder }: OrderDetailsViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderType>(initialOrder);
  const [isPending, startTransition] = useTransition();
  const [copiedLabel, setCopiedLabel] = useState(false);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [whatsappInfo, setWhatsappInfo] = useState<{
    phone: string;
    message: string;
  } | null>(null);

  // Cancellation states
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [cancellationCause, setCancellationCause] = useState("");

  // Custom status email states
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

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

  const handleOpenEmailDialog = () => {
    let subject = `Mussu's Henna Bliss: Order Update (#${formattedId})`;
    let body = `Hi ${order.customerName},\n\nHere is an update regarding your order #${formattedId}.\n\nOrder ID: ${order.id}\nStatus: ${order.status}\n\nTrack your order live here: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/${order.id}\n\nBest regards,\nMuskan`;

    if (order.status === "PENDING") {
      subject = `Mussu's Henna Bliss: Order Received! (#${formattedId})`;
      body = `Hi ${order.customerName},\n\nThank you for your order! We have received your order details and are preparing to process it.\n\nOrder ID: ${order.id}\nTotal Amount: ₹${order.totalAmount.toFixed(2)}\n\nTrack your order live here: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/${order.id}\n\nBest regards,\nMuskan`;
    } else if (order.status === "PAID") {
      subject = `Mussu's Henna Bliss: Payment Confirmed! (#${formattedId})`;
      body = `Hi ${order.customerName},\n\nWe have received your payment of ₹${order.totalAmount.toFixed(2)} for order #${formattedId}. We are now preparing your organic henna cones.\n\nOrder ID: ${order.id}\n\nTrack your order live here: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/${order.id}\n\nBest regards,\nMuskan`;
    } else if (order.status === "FULFILLED") {
      subject = `Mussu's Henna Bliss: Your Order has Shipped! (#${formattedId})`;
      body = `Hi ${order.customerName},\n\nExciting news! Your natural, fresh henna cones have been packaged and shipped to your address.\n\nOrder ID: ${order.id}\nDelivery Address: ${order.address}\n\nTrack your order live here: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/status/${order.id}\n\nBest regards,\nMuskan`;
    } else if (order.status === "CANCELLED") {
      subject = `Mussu's Henna Bliss: Order Cancelled Notice (#${formattedId})`;
      body = `Hi ${order.customerName},\n\nWe are writing to let you know that your order #${formattedId} has been cancelled.\n\nOrder ID: ${order.id}\n\nIf you have any questions, feel free to reply to this email or contact us on WhatsApp.\n\nBest regards,\nMuskan`;
    }

    setEmailSubject(subject);
    setEmailBody(body);
    setEmailDialogOpen(true);
  };

  const handleCancelOrderSubmit = () => {
    if (!cancellationCause.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }

    startTransition(async () => {
      const res = await cancelOrderAction(order.id, cancellationCause);
      if (res.success) {
        toast.success("Order cancelled and email notification sent!");
        setCancellationDialogOpen(false);
        setCancellationCause("");
        // Reload order state
        setOrder(prev => ({ ...prev, status: "CANCELLED" }));
        router.refresh();
      } else {
        toast.error(res.error || "Failed to cancel order");
      }
    });
  };

  const handleSendEmailSubmit = () => {
    if (!emailSubject.trim()) {
      toast.error("Subject is required.");
      return;
    }
    if (!emailBody.trim()) {
      toast.error("Email body is required.");
      return;
    }

    startTransition(async () => {
      const formattedBody = emailBody.replace(/\n/g, "<br/>");
      const res = await sendOrderEmailAction(order.id, emailSubject, formattedBody);
      if (res.success) {
        toast.success("Email sent successfully!");
        setEmailDialogOpen(false);
      } else {
        toast.error(res.error || "Failed to send email");
      }
    });
  };

  const handleStatusChange = (newStatus: any) => {
    startTransition(async () => {
      const res = await updateOrder(order.id, {
        status: newStatus,
        paymentMethod: order.paymentMethod as any,
      });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrder(prev => ({ ...prev, status: newStatus }));
        router.refresh();
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
        setOrder(prev => ({ ...prev, paymentMethod: newMethod }));
        router.refresh();
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
        setOrder(prev => ({ ...prev, status: "FULFILLED", paymentMethod: "PREPAID" }));
        router.refresh();
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
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "PAID":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "FULFILLED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentMethodBadgeStyles = (method: string) => {
    return method === "PREPAID" 
      ? "bg-sky-50 text-sky-700 border-sky-100" 
      : "bg-purple-50 text-purple-700 border-purple-100";
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans">
      {/* Back Button and Title */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-1 text-xs text-[#8C7A6B] hover:text-primary font-semibold w-fit transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders Ledger
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EBE4DC] gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#4E3E2F]">
                Order Details
              </h1>
              <span className="text-[10px] bg-[#EBE4DC] text-[#4E3E2F] px-2 py-0.5 rounded-md font-mono font-bold tracking-wide">
                #{formattedId}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(order.id);
                  toast.success("Full Order ID copied!");
                }}
                className="p-1 hover:bg-[#FAF6F0] rounded border border-[#EBE4DC]/60 text-[#4E3E2F] transition-colors"
                title="Copy full Order ID"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verify client address, modify payment method, send custom statuses, and fulfill cones shipments.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold border px-3 py-1 rounded-full ${getStatusBadgeStyles(order.status)}`}>
              Status: {order.status}
            </span>
            <span className="text-xs text-muted-foreground">{orderDate}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Info & Items (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 space-y-4 shadow-2xs relative">
            <div className="flex justify-between items-center border-b border-[#EBE4DC]/60 pb-3 mb-2">
              <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">
                Customer Information
              </h3>
              <Button
                variant="outline"
                size="xs"
                onClick={handleCopyShippingLabel}
                className="h-7 text-[10px] text-[#4E3E2F] hover:bg-[#FAF6F0] border border-[#EBE4DC] rounded-md gap-1 px-2.5"
              >
                {copiedLabel ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                Copy Shipping Label
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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

              <div className="flex items-start gap-2.5 md:col-span-2">
                <Mail className="h-4 w-4 text-[#8C7A6B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">
                    Email Address
                  </span>
                  <span className="font-semibold text-[#4E3E2F]">
                    {order.email}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 md:col-span-2">
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

          {/* Items Card */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider border-b border-[#EBE4DC]/60 pb-3">
              Items Ordered
            </h3>

            <div className="divide-y divide-[#EBE4DC]/40 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start pt-3 first:pt-0"
                >
                  <div className="min-w-0 flex gap-3">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-10 w-10 rounded-lg object-cover border border-[#EBE4DC]"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-xs text-[#4E3E2F] truncate max-w-[260px]">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.quantity}x @ ₹{item.priceAtPurchase.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#4E3E2F]">
                    ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EBE4DC] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#4E3E2F] pt-2">
                <span>Total Paid</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Admin Controls & Actions (1 Col) */}
        <div className="space-y-6">
          {/* Order Control Panel */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider border-b border-[#EBE4DC]/60 pb-3">
              Order Control Panel
            </h3>

            <div className="space-y-4">
              <Field className="space-y-1.5">
                <FieldLabel className="text-xs text-[#5C4D3E] font-semibold">
                  Fulfillment Status
                </FieldLabel>
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white border-[#EBE4DC] h-10 text-xs rounded-xl focus:ring-primary/20">
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

              <Field className="space-y-1.5">
                <FieldLabel className="text-xs text-[#5C4D3E] font-semibold">
                  Payment Mode
                </FieldLabel>
                <Select
                  value={order.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white border-[#EBE4DC] h-10 text-xs rounded-xl focus:ring-primary/20">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#EBE4DC]">
                    <SelectItem value="COD">COD</SelectItem>
                    <SelectItem value="PREPAID">Prepaid</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {order.status !== "FULFILLED" && order.status !== "CANCELLED" && (
                <Button
                  onClick={handlePaidAndShip}
                  disabled={isPending}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-6 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 transition-transform active:scale-[0.99]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Fulfillment...
                    </>
                  ) : (
                    <>Mark as Paid & Ship</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Custom Communications & Operations */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider border-b border-[#EBE4DC]/60 pb-3">
              Communications
            </h3>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleOpenEmailDialog}
                disabled={isPending}
                className="w-full bg-[#4E3E2F] hover:bg-[#3d3125] text-white font-semibold rounded-xl text-xs h-11 flex items-center justify-center gap-1 cursor-pointer"
              >
                Send Custom Status Email
              </Button>

              {order.status !== "CANCELLED" && order.status !== "FULFILLED" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCancellationDialogOpen(true)}
                  disabled={isPending}
                  className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs h-11 cursor-pointer"
                >
                  Cancel Order Record
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Handoff Dialog Modal */}
      {whatsappDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
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
                }}
                className="flex-1 border-[#EBE4DC] text-[#4E3E2F] rounded-lg text-xs cursor-pointer"
              >
                Skip
              </Button>
              <Button
                onClick={handleOpenWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs gap-1 cursor-pointer"
              >
                Send WhatsApp
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Cause Dialog Modal */}
      {cancellationDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl space-y-4 relative overflow-hidden animate-in fade-in-50 zoom-in-95 text-left">
            <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

            <h3 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-2">
              Cancel Order
            </h3>

            <div className="space-y-1.5">
              <label htmlFor="cancellationReason" className="text-xs font-semibold text-[#5C4D3E] block">
                Reason for Cancellation
              </label>
              <textarea
                id="cancellationReason"
                rows={3}
                placeholder="E.g., Out of stock / Delivery location unserviceable"
                value={cancellationCause}
                onChange={(e) => setCancellationCause(e.target.value)}
                disabled={isPending}
                className="w-full text-xs p-2 rounded-lg border border-[#EBE4DC] bg-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-[#4E3E2F] leading-relaxed resize-none font-medium"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCancellationDialogOpen(false);
                  setCancellationCause("");
                }}
                disabled={isPending}
                className="flex-1 border-[#EBE4DC] text-[#4E3E2F] rounded-lg text-xs cursor-pointer"
              >
                Back
              </Button>
              <Button
                onClick={handleCancelOrderSubmit}
                disabled={isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs cursor-pointer"
              >
                {isPending ? "Cancelling..." : "Confirm Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Send Email Dialog Modal */}
      {emailDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-3xl p-6 max-w-md w-full mx-4 shadow-xl space-y-4 relative overflow-hidden animate-in fade-in-50 zoom-in-95 text-left">
            <div className="absolute inset-1 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

            <h3 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-2">
              Send Status Email
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block font-semibold">
                  Current Order Status
                </span>
                <span className="font-bold text-[#4E3E2F] uppercase text-3xs bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EBE4DC] inline-block mt-0.5">
                  {order.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground block font-semibold">
                  Recipient
                </span>
                <span className="font-semibold text-[#4E3E2F]">
                  {order.email}
                </span>
              </div>

              <div className="space-y-1">
                <label htmlFor="emailSubject" className="text-[10px] font-semibold text-muted-foreground block">
                  Email Subject
                </label>
                <input
                  id="emailSubject"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  disabled={isPending}
                  className="w-full p-2 text-xs rounded-lg border border-[#EBE4DC] bg-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-[#4E3E2F] font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="emailBody" className="text-[10px] font-semibold text-muted-foreground block">
                  Email Content
                </label>
                <textarea
                  id="emailBody"
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  disabled={isPending}
                  className="w-full p-3 text-xs rounded-lg border border-[#EBE4DC] bg-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-[#4E3E2F] leading-relaxed resize-y font-mono font-medium"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEmailDialogOpen(false);
                  setEmailSubject("");
                  setEmailBody("");
                }}
                disabled={isPending}
                className="flex-1 border-[#EBE4DC] text-[#4E3E2F] rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmailSubmit}
                disabled={isPending}
                className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs cursor-pointer"
              >
                {isPending ? "Sending..." : "Confirm & Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
