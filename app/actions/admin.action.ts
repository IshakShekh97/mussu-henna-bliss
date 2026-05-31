"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Updates a booking with the quoted price and notes from the artist,
 * transitions the status to QUOTED, and simulates sending a WhatsApp API notification.
 * Optionally adjusts the eventDate's hours/minutes if a proposed time slot is provided.
 */
export async function sendBookingQuote(
  bookingId: string,
  price: number,
  artistNotes?: string,
  newTime?: string
) {
  try {
    if (!bookingId) {
      return { success: false, error: "Booking ID is required" };
    }
    if (price <= 0) {
      return { success: false, error: "Quoted price must be greater than 0" };
    }

    // Handle optional proposed event time update
    let eventDateUpdate: Date | undefined;
    if (newTime) {
      const currentBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
      if (currentBooking) {
        const [hours, minutes] = newTime.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          const newDate = new Date(currentBooking.eventDate);
          newDate.setHours(hours, minutes, 0, 0);
          eventDateUpdate = newDate;
        }
      }
    }

    // Update the booking in the database
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        quotedPrice: price,
        artistNotes: artistNotes || null,
        status: "QUOTED",
        ...(eventDateUpdate ? { eventDate: eventDateUpdate } : {}),
      },
    });

    // Simulate WhatsApp Cloud API request
    const message = `Hi ${booking.customerName}, Muskan here from Mussu's Henna Bliss! ✨ I have reviewed your request for ${booking.eventType} on ${new Date(booking.eventDate).toLocaleDateString()}. Here is your custom quote: ₹${price}. Review details and track your booking status here: http://localhost:3000/status/booking-${booking.id}`;
    
    console.log("-----------------------------------------");
    console.log(`[WhatsApp Cloud API] Live notification fired to: ${booking.phone}`);
    console.log(`[Message]: "${message}"`);
    console.log("-----------------------------------------");

    // Revalidate relevant pages so metrics and lists update instantly
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to send booking quote:", error);
    return { success: false, error: error.message || "Failed to submit quote" };
  }
}

/**
 * Creates a new booking in the database (used for manual event logs).
 */
export async function createBooking(data: {
  customerName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string; // Date string or ISO string
  location: string;
  guestCount?: number;
  designNotes?: string;
  status?: "PENDING_QUOTE" | "QUOTED" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  quotedPrice?: number;
  artistNotes?: string;
}) {
  try {
    const booking = await prisma.booking.create({
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        location: data.location,
        guestCount: data.guestCount || null,
        designNotes: data.designNotes || null,
        status: data.status || "PENDING_QUOTE",
        quotedPrice: data.quotedPrice || null,
        artistNotes: data.artistNotes || null,
      },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to create booking:", error);
    return { success: false, error: error.message || "Failed to log event" };
  }
}

/**
 * Transitions a booking's status to COMPLETED.
 */
export async function completeBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to complete booking:", error);
    return { success: false, error: error.message || "Failed to complete booking" };
  }
}

/**
 * Deletes a booking from the database.
 */
export async function deleteBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to delete booking:", error);
    return { success: false, error: error.message || "Failed to delete booking" };
  }
}

/**
 * Fetches all bookings from the database.
 */
export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: bookings };
  } catch (error: any) {
    console.error("Failed to fetch bookings:", error);
    return {
      success: false,
      error: error.message || "Failed to query bookings",
      data: [],
    };
  }
}

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
      .filter((b) => (b.status === "ACCEPTED" || b.status === "COMPLETED") && b.quotedPrice)
      .reduce((sum, b) => sum + (b.quotedPrice || 0) * 0.5, 0);

    const grossRevenue = completedOrdersSum + bookingDepositsSum;

    // 2. Pending retail orders count
    const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;

    // 3. Awaiting quotes bookings count
    const awaitingQuotesCount = bookings.filter((b) => b.status === "PENDING_QUOTE").length;

    // 4. Booking success rate
    const sentQuotesCount = bookings.filter(
      (b) => b.status === "QUOTED" || b.status === "ACCEPTED" || b.status === "COMPLETED"
    ).length;
    const acceptedQuotesCount = bookings.filter(
      (b) => b.status === "ACCEPTED" || b.status === "COMPLETED"
    ).length;
    const successRate = sentQuotesCount > 0 ? (acceptedQuotesCount / sentQuotesCount) * 100 : 0;

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
      data: { grossRevenue: 0, pendingOrdersCount: 0, awaitingQuotesCount: 0, successRate: 0 },
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

    // Map each product to a deterministic stock count based on its ID hash to avoid schema migration
    const productsWithStock = dbProducts.map((p) => {
      const hash = p.id.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const simulatedStock = p.inStock ? (hash % 18) + 1 : 0; // returns 0 to 18
      return {
        ...p,
        stock: simulatedStock,
      };
    });

    const lowStockProducts = productsWithStock
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
