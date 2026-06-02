import React, { Suspense } from "react";
import { getOrders } from "@/app/actions/order.action";
import { OrdersLedger } from "@/components/admin/orders/orders-ledger";
import { OrdersSkeleton } from "@/components/admin/orders/orders-skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders | Admin Portal",
  description: "Manage henna orders",
};

async function OrdersLoader() {
  const result = await getOrders();

  if (!result.success) {
    return (
      <div className="w-full text-center py-12 text-rose-500 text-xs font-semibold">
        Failed to load orders: {result.error}
      </div>
    );
  }

  const orders = result.orders || [];

  return <OrdersLedger initialOrders={orders as any[]} />;
}

export default function OrdersPage() {
  return (
    <div className="space-y-6 w-full py-2">
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersLoader />
      </Suspense>
    </div>
  );
}


