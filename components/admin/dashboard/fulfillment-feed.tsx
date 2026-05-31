import React from "react";
import { ShoppingBag } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFulfillmentFeed } from "@/app/actions/admin.action";

export async function FulfillmentFeed() {
  const result = await getFulfillmentFeed();
  const recentOrders = result.success && result.data ? result.data : [];

  return (
    <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs">
      <CardHeader className="border-b border-[#EBE4DC]/60 pb-4">
        <CardTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
          Live Order Fulfillment Feed
        </CardTitle>
        <CardDescription className="text-xs">
          Review and manage recent retail purchases for henna cones and related products.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-[#8C7A6B]">
            <ShoppingBag className="h-8 w-8 text-[#8C7A6B]/50 mb-2" />
            <span className="font-semibold text-sm">No orders yet</span>
            <span className="text-xs text-muted-foreground mt-0.5">Sales will appear here as customers place checkouts.</span>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-[#FAF6F0]">
                <TableRow className="border-[#EBE4DC]">
                  <TableHead className="w-[120px] text-xs font-bold text-[#4E3E2F]">Order ID</TableHead>
                  <TableHead className="text-xs font-bold text-[#4E3E2F]">Customer</TableHead>
                  <TableHead className="text-xs font-bold text-[#4E3E2F]">Date</TableHead>
                  <TableHead className="text-xs font-bold text-[#4E3E2F]">Total Amount</TableHead>
                  <TableHead className="text-xs font-bold text-[#4E3E2F]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  // Define badge colors for each order status state
                  let statusClass = "bg-neutral-50 text-neutral-700 border-neutral-200";
                  if (order.status === "PENDING") {
                    statusClass = "bg-amber-50 text-amber-700 border-amber-200";
                  } else if (order.status === "PAID") {
                    statusClass = "bg-green-50 text-green-700 border-green-200";
                  } else if (order.status === "FULFILLED") {
                    statusClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  } else if (order.status === "CANCELLED") {
                    statusClass = "bg-rose-50 text-rose-700 border-rose-200";
                  }

                  return (
                    <TableRow
                      key={order.id}
                      className="border-[#EBE4DC] hover:bg-[#FAF6F0]/20 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-[#4E3E2F]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-[#4E3E2F]">
                        <div>{order.customerName}</div>
                        <div className="text-[10px] text-muted-foreground">{order.phone}</div>
                      </TableCell>
                      <TableCell className="text-xs text-[#5C4D3E]">
                        {orderDate}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-[#4E3E2F]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusClass} text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
