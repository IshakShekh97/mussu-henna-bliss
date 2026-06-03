"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Download, 
  Filter, 
  CreditCard, 
  ShoppingBag, 
  ChevronRight, 
  RefreshCw,
  Plus,
  Info
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrders } from "@/app/actions/order.action";

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

interface OrdersLedgerProps {
  initialOrders: OrderType[];
}

export function OrdersLedger({ initialOrders }: OrdersLedgerProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  // Refresh data from database
  const handleRefresh = () => {
    startTransition(async () => {
      const res = await getOrders();
      if (res.success && res.orders) {
        setOrders(res.orders as any[]);
        toast.success("Orders list updated successfully!");
      } else {
        toast.error(res.error || "Failed to refresh orders");
      }
    });
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const formattedId = order.id.slice(0, 8).toUpperCase();
    const matchesSearch = 
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      formattedId.includes(search.toUpperCase());

    const matchesStatus = 
      statusFilter === "ALL" || 
      order.status === statusFilter;

    const matchesPayment = 
      paymentFilter === "ALL" || 
      order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Order Reference ID",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Fulfillment Address",
      "Items Ordered Summary",
      "Total Paid (INR)",
      "Payment Mode",
      "Status"
    ];

    const rows = filteredOrders.map((order) => {
      const itemsSummary = order.items
        .map((item) => `${item.quantity}x ${item.product.name}`)
        .join("; ");
      const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN");
      const refId = `#MHB-${order.id.slice(0, 8).toUpperCase()}`;

      return [
        refId,
        formattedDate,
        order.customerName,
        order.email,
        order.phone,
        order.address,
        itemsSummary,
        order.totalAmount,
        order.paymentMethod === "PREPAID" ? "Prepaid" : "COD",
        order.status
      ];
    });

    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mhb_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EBE4DC] gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#4E3E2F]">
            Product Orders Ledger
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review buyer requests, copy delivery addresses, and coordinate shipments.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => router.push("/admin/orders/create")}
            className="bg-primary text-primary-foreground hover:bg-primary/95 h-9 gap-1.5 text-xs font-semibold px-4 rounded-lg shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] h-9 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] h-9 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Static Callout Box with Instructions */}
      <div className="bg-[#FAF6EE] border border-[#E9DFD0] rounded-2xl p-4 flex gap-3 text-xs text-[#5C4D3E] leading-relaxed shadow-2xs">
        <Info className="h-5 w-5 text-[#8C7A6B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block text-gray-800">Henna Cones Orders Management Console</span>
          <p>
            Use this panel to track online orders, mark shipments as fulfilled, and log walk-in sales. 
            Clicking on any row opens the detailed slide-out details panel to update client details, export labels, or send shipping emails.
          </p>
        </div>
      </div>

      {/* Section A: The Operational Filter Matrix */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A6B]/60" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, email, ID..."
            className="pl-9 bg-white border-[#EBE4DC] h-10 text-xs placeholder:text-[#8C7A6B]/40 focus-visible:ring-primary/30"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          {/* Fulfillment Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8C7A6B] shrink-0">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white border-[#EBE4DC] h-10 text-xs min-w-[130px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#EBE4DC]">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8C7A6B] shrink-0">Payment:</span>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="bg-white border-[#EBE4DC] h-10 text-xs min-w-[130px]">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#EBE4DC]">
                <SelectItem value="ALL">All Modes</SelectItem>
                <SelectItem value="COD">COD</SelectItem>
                <SelectItem value="PREPAID">Prepaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section B: Core Ledger List Table */}
      <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAF6F0]/60 border-b border-[#EBE4DC]/60">
            <TableRow className="hover:bg-transparent border-[#EBE4DC]/60">
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4 pl-6">Order ID</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Date</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Customer</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Items Ordered</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Total & Mode</TableHead>
              <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4 pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-12 text-[#8C7A6B]/70 pl-6 pr-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ShoppingBag className="h-8 w-8 text-[#8C7A6B]/30" />
                    <span className="text-xs font-semibold">No orders logged matching the criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const formattedId = order.id.slice(0, 8).toUpperCase();
                const itemsSummary = order.items
                  .map((item) => `${item.quantity}x ${item.product.name.split(" ")[0]}`)
                  .join(", ");
                const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit"
                });

                return (
                  <TableRow
                    key={order.id}
                    onClick={() => {
                      router.push(`/admin/orders/${order.id}`);
                    }}
                    className="group border-[#EBE4DC]/40 hover:bg-[#FAF6F0]/30 cursor-pointer transition-colors"
                  >
                    {/* Order Reference ID */}
                    <TableCell className="py-4 pl-6 font-semibold font-mono text-xs text-[#4E3E2F]">
                      <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EBE4DC]/80 font-bold">
                        #MHB-{formattedId}
                      </span>
                    </TableCell>

                    {/* Order Date */}
                    <TableCell className="py-4 text-xs text-[#5C4D3E]">
                      {orderDate}
                    </TableCell>

                    {/* Customer Brief */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-xs text-[#4E3E2F] truncate max-w-[150px]">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {order.phone}
                        </span>
                      </div>
                    </TableCell>

                    {/* Items Ordered */}
                    <TableCell className="py-4">
                      <span className="text-xs text-[#5C4D3E] font-medium truncate max-w-[200px] block" title={order.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}>
                        {itemsSummary}
                      </span>
                    </TableCell>

                    {/* Total Amount + Mode */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#4E3E2F]">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span className={`text-[9px] font-bold border rounded px-1 py-0.5 ${getPaymentMethodBadgeStyles(order.paymentMethod)}`}>
                          {order.paymentMethod === "PREPAID" ? "PREPAID" : "COD"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Dynamic Status Badging */}
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${getStatusBadgeStyles(order.status)}`}>
                          {order.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#8C7A6B]/40 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
