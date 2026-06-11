"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { bookingSchema, type bookingFormSchemaType } from "@/lib/zodSchemas";
import { sendEmail } from "@/lib/email";
import { checkAuth } from "@/lib/checkAuth";

/**
 * Creates a new booking from the customer storefront form.
 */
export async function createCustomerBooking(data: bookingFormSchemaType) {
  try {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return { success: false, error: errorMessage || "Invalid input data" };
    }

    const {
      occasion,
      date,
      time,
      location,
      peopleCount,
      hennaStyle,
      hennaType,
      coverage,
      vision,
      fullName,
      whatsapp,
      email,
    } = parsed.data;

    // Combine date and time
    const eventDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      eventDate.setHours(hours, minutes, 0, 0);
    }

    // Since occasion is freeform string, map it directly to eventType (matching the schema)
    const eventType = occasion;

    // Combine advanced details into designNotes
    const designNotes = `Henna Style: ${hennaStyle}
Henna Type: ${hennaType}
Coverage: ${coverage}

Vision / Detailed Requirements:
${vision}`;

    const booking = await prisma.booking.create({
      data: {
        customerName: fullName,
        email,
        phone: whatsapp,
        eventType,
        eventDate,
        location,
        guestCount: peopleCount,
        designNotes,
        status: "PENDING_QUOTE",
      },
    });

    // Revalidate paths for admin to see the request
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    // Send email notification to admin (owner)
    const smtpUser = (process.env.SMTP_USER || "").trim();
    if (smtpUser) {
      try {
        const formattedDate = eventDate.toLocaleDateString("en-IN", {
          dateStyle: "full",
        });
        const formattedTime = eventDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const adminBookingUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/admin/bookings`;

        const adminEmailHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF6F0; padding: 30px; margin: 0; min-height: 100%;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FDFBF7; border: 1px solid #EBE4DC; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(78, 62, 47, 0.05);">
              <!-- Header -->
              <tr>
                <td style="background-color: #4E3E2F; padding: 24px; text-align: center; color: #FDFBF7;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Mussu's Henna Bliss</h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #FAF6F0; font-weight: 200;">New Event Booking Request 🌟</p>
                </td>
              </tr>
              <!-- Content Body -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="margin-top: 0; font-size: 18px; color: #4E3E2F; font-weight: bold; border-bottom: 1px solid #EBE4DC; padding-bottom: 10px;">Booking Request Received!</h2>
                  <p style="font-size: 14px; color: #5C4D3E; line-height: 1.6; margin-bottom: 20px;">
                    Hi Muskan,<br/>
                    A client has submitted a new henna booking request. Here are the details:
                  </p>
                  
                  <!-- Booking Details Table -->
                  <h3 style="font-size: 14px; color: #4E3E2F; font-weight: bold; margin-bottom: 10px;">Event & Client Details</h3>
                  <table width="100%" style="margin-bottom: 25px; font-size: 13px; color: #5C4D3E; background-color: #FAF6F0; border-radius: 8px; padding: 15px; border: 1px solid #EBE4DC;">
                    <tr>
                      <td style="padding-bottom: 5px; width: 140px;"><strong>Client Name:</strong></td>
                      <td style="padding-bottom: 5px;">${booking.customerName}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Email:</strong></td>
                      <td style="padding-bottom: 5px;">${booking.email}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>WhatsApp:</strong></td>
                      <td style="padding-bottom: 5px;">${booking.phone}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Occasion:</strong></td>
                      <td style="padding-bottom: 5px;">${booking.eventType}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Date & Time:</strong></td>
                      <td style="padding-bottom: 5px;">${formattedDate} at ${formattedTime}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Location:</strong></td>
                      <td style="padding-bottom: 5px;">${booking.location}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Est. Guests:</strong></td>
                      <td style="padding-bottom: 5px;">${booking.guestCount || "N/A"}</td>
                    </tr>
                  </table>

                  ${
                    booking.designNotes
                      ? `
                    <h3 style="font-size: 14px; color: #4E3E2F; font-weight: bold; margin-bottom: 10px;">Design vision & Notes</h3>
                    <div style="background-color: #FAF6F0; padding: 15px; border-radius: 8px; border: 1px solid #EBE4DC; font-style: italic; font-size: 13px; color: #5C4D3E; line-height: 1.5; margin-bottom: 25px; white-space: pre-wrap;">
                      ${booking.designNotes}
                    </div>
                  `
                      : ""
                  }

                  <!-- Admin Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${adminBookingUrl}" style="background-color: #4E3E2F; color: #FDFBF7; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                      Manage Booking Request
                    </a>
                  </div>
                  
                  <p style="font-size: 11px; color: #8C7A6B; line-height: 1.5; text-align: center; margin-top: 30px; border-top: 1px solid #EBE4DC; padding-top: 15px;">
                    This is an automated notification from Mussu's Henna Bliss booking engine.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `;

        await sendEmail({
          to: smtpUser,
          subject: `🚨 New Booking Request: ${booking.eventType} from ${booking.customerName}`,
          html: adminEmailHtml,
        });
      } catch (emailErr) {
        console.error(
          "Failed to email admin regarding booking request:",
          emailErr,
        );
      }
    }

    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    console.error("Failed to create customer booking:", error);
    return {
      success: false,
      error: error.message || "Failed to create booking request",
    };
  }
}

/**
 * Updates a booking with the quoted price and notes from the artist,
 * transitions the status to QUOTED, and simulates sending a WhatsApp API notification.
 * Optionally adjusts the eventDate's hours/minutes if a proposed time slot is provided.
 */
export async function sendBookingQuote(
  bookingId: string,
  price: number,
  artistNotes?: string,
  newTime?: string,
) {
  try {
    await checkAuth();

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
    const message = `Hi ${booking.customerName}, Muskan here from Mussu's Henna Bliss! ✨ I have reviewed your request for ${booking.eventType} on ${new Date(booking.eventDate).toLocaleDateString()}. Here is your custom quote: ₹${price}. Review details and track your booking status here: ${process.env.NEXT_PUBLIC_API_URL}/status/booking-${booking.id}`;

    console.log("-----------------------------------------");
    console.log(
      `[WhatsApp Cloud API] Live notification fired to: ${booking.phone}`,
    );
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
  await checkAuth();

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

export async function completeBooking(bookingId: string) {
  await checkAuth();

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
    return {
      success: false,
      error: error.message || "Failed to complete booking",
    };
  }
}

export async function deleteBooking(bookingId: string) {
  await checkAuth();

  try {
    const booking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to delete booking:", error);
    return {
      success: false,
      error: error.message || "Failed to delete booking",
    };
  }
}

/**
 * Fetches all bookings from the database.
 */
export async function getBookings() {
  await checkAuth();

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
 * Manually updates a booking's status to a target BookingStatus.
 */
export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING_QUOTE" | "QUOTED" | "ACCEPTED" | "COMPLETED" | "CANCELLED",
) {
  await checkAuth();

  try {
    if (!bookingId) {
      return { success: false, error: "Booking ID is required" };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to update booking status:", error);
    return {
      success: false,
      error: error.message || "Failed to update booking status",
    };
  }
}

/**
 * Updates a booking's full profile details.
 */
export async function updateBooking(
  bookingId: string,
  data: {
    customerName: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate: string; // ISO string
    location: string;
    guestCount?: number | null;
    designNotes?: string | null;
    quotedPrice?: number | null;
    artistNotes?: string | null;
    status: "PENDING_QUOTE" | "QUOTED" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  },
) {
  await checkAuth();

  try {
    if (!bookingId) {
      return { success: false, error: "Booking ID is required" };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        location: data.location,
        guestCount: data.guestCount,
        designNotes: data.designNotes,
        quotedPrice: data.quotedPrice,
        artistNotes: data.artistNotes,
        status: data.status,
      },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to update booking:", error);
    return {
      success: false,
      error: error.message || "Failed to update booking",
    };
  }
}

/**
 * Fetches the recent booking requests pipeline (Needs Attention: latest 5 PENDING_QUOTE or QUOTED bookings).
 */
export async function getRecentBookingRequests() {
  await checkAuth();

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
    console.error("Failed to fetch recent booking requests:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch bookings",
      data: [],
    };
  }
}

/**
 * Sends a custom email update to the client regarding a booking.
 */
export async function sendBookingEmailAction(
  bookingId: string,
  subject: string,
  bodyHtml: string,
) {
  await checkAuth();

  try {
    if (!bookingId) {
      return { success: false, error: "Booking ID is required" };
    }
    if (!subject.trim()) {
      return { success: false, error: "Subject is required" };
    }
    if (!bodyHtml.trim()) {
      return { success: false, error: "Email body is required" };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    const styledEmailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF6F0; padding: 30px; margin: 0; min-height: 100%;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FDFBF7; border: 1px solid #EBE4DC; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(78, 62, 47, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #4E3E2F; padding: 24px; text-align: center; color: #FDFBF7;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Mussu's Henna Bliss</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #FAF6F0; font-weight: 200;">Booking Update</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="padding: 30px; font-size: 14px; color: #5C4D3E; line-height: 1.6;">
              ${bodyHtml}
              
              <p style="font-size: 11px; color: #8C7A6B; line-height: 1.5; text-align: center; margin-top: 30px; border-top: 1px solid #EBE4DC; padding-top: 15px;">
                This email was sent from Muskan at Mussu's Henna Bliss. If you have any questions, you can reply directly to this email or reach out via WhatsApp.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const res = await sendEmail({
      to: booking.email,
      subject,
      html: styledEmailHtml,
    });

    if (res.success) {
      return { success: true };
    } else {
      return { success: false, error: res.error || "Failed to transmit email" };
    }
  } catch (error: any) {
    console.error("Failed to send booking email:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}
