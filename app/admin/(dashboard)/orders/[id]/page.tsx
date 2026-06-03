import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrderDetailsView } from "@/components/admin/orders/order-details-view";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: OrderPageProps) {
  const resolvedParams = await params;
  const shortId = resolvedParams.id.slice(0, 8).toUpperCase();
  return {
    title: `Order MHB-${shortId} | Admin Portal`,
    description: `Manage order details for MHB-${shortId}`,
  };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const resolvedParams = await params;
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Map createdAt to ISO string/Date correctly for client-side serialization compatibility
  const serializedOrder = {
    ...order,
    createdAt: order.createdAt.toISOString(),
  };

  return (
    <div className="w-full py-2">
      <OrderDetailsView order={serializedOrder as any} />
    </div>
  );
}
