"use server";

import prisma from "@/lib/prisma";

/**
 * Fetches dashboard performance metrics (Gross Revenue, Pending Orders, Awaiting Quotes, Success Rate) from live data.
 */
export async function getDashboardMetrics() {
  try {
    const orders = await prisma.order.findMany();
    const bookings = await prisma.booking.findMany();

    // 1. Gross Revenue (Combined PAID/FULFILLED retail orders + 50% deposit of ACCEPTED/COMPLETED bookings)
    const completedOrdersSum = orders
      .filter((o) => o.status === "PAID" || o.status === "FULFILLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const bookingDepositsSum = bookings
      .filter(
        (b) =>
          (b.status === "ACCEPTED" || b.status === "COMPLETED") &&
          b.quotedPrice,
      )
      .reduce((sum, b) => sum + (b.quotedPrice || 0) * 0.5, 0);

    const grossRevenue = completedOrdersSum + bookingDepositsSum;

    // 2. Pending retail orders count
    const pendingOrdersCount = orders.filter(
      (o) => o.status === "PENDING",
    ).length;

    // 3. Awaiting quotes bookings count
    const awaitingQuotesCount = bookings.filter(
      (b) => b.status === "PENDING_QUOTE",
    ).length;

    // 4. Booking success rate
    const sentQuotesCount = bookings.filter(
      (b) =>
        b.status === "QUOTED" ||
        b.status === "ACCEPTED" ||
        b.status === "COMPLETED",
    ).length;
    const acceptedQuotesCount = bookings.filter(
      (b) => b.status === "ACCEPTED" || b.status === "COMPLETED",
    ).length;
    const successRate =
      sentQuotesCount > 0 ? (acceptedQuotesCount / sentQuotesCount) * 100 : 0;

    return {
      success: true,
      data: {
        grossRevenue,
        pendingOrdersCount,
        awaitingQuotesCount,
        successRate,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard metrics:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch metrics",
      data: {
        grossRevenue: 0,
        pendingOrdersCount: 0,
        awaitingQuotesCount: 0,
        successRate: 0,
      },
    };
  }
}

/**
 * Fetches the booking requests pipeline (Needs Attention: latest 5 PENDING_QUOTE or QUOTED bookings).
 */
export async function getBookingPipeline() {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDING_QUOTE", "QUOTED"],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return { success: true, data: bookings };
  } catch (error: any) {
    console.error("Failed to fetch booking pipeline:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch bookings",
      data: [],
    };
  }
}

/**
 * Fetches products from database, applies the low stock calculation, and returns items under 15 stock count.
 */
export async function getInventoryWatch() {
  try {
    const dbProducts = await prisma.product.findMany();

    // Now uses the actual database stock count
    const lowStockProducts = dbProducts
      .filter((p) => p.stock < 15)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    return { success: true, data: lowStockProducts };
  } catch (error: any) {
    console.error("Failed to fetch inventory watch:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch products",
      data: [],
    };
  }
}

/**
 * Fetches the recent retail orders (latest 5 orders).
 */
export async function getFulfillmentFeed() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return { success: true, data: orders };
  } catch (error: any) {
    console.error("Failed to fetch fulfillment feed:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch orders",
      data: [],
    };
  }
}
