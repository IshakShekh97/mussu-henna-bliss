"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateOrderSchema, type updateOrderSchemaType, manualOrderCreateSchema, type manualOrderCreateSchemaType } from "@/lib/zodSchemas";
import nodemailer from "nodemailer";

/**
 * Fetches all orders, including items and product details.
 */
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, orders };
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch orders",
      orders: [],
    };
  }
}

/**
 * Updates an order's status and payment method.
 */
export async function updateOrder(orderId: string, data: updateOrderSchemaType) {
  try {
    const parsed = updateOrderSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return { success: false, error: errorMessage || "Invalid input data" };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: parsed.data.status,
        paymentMethod: parsed.data.paymentMethod,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { success: true, order };
  } catch (error: any) {
    console.error("Failed to update order:", error);
    return {
      success: false,
      error: error.message || "Failed to update order details",
    };
  }
}

/**
 * Marks an order as PAID & FULFILLED, dispatches Nodemailer HTML receipt, 
 * and returns prefilled WhatsApp tracking deep-link text.
 */
export async function markAsPaidAndShip(orderId: string) {
  try {
    // 1. Fetch order details with products
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // 2. Update database order status to FULFILLED and paymentMethod to PREPAID
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "FULFILLED",
        paymentMethod: "PREPAID",
      },
    });

    // 3. Revalidate paths
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    // 4. Dispatch Email Receipt using Nodemailer (Failsafe caught)
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    const smtpSecure = process.env.SMTP_SECURE === "true";

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const itemsRowsHtml = order.items
          .map(
            (item) => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #EBE4DC; font-size: 14px; color: #4E3E2F;">
                <strong>${item.product.name}</strong>
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #EBE4DC; font-size: 14px; color: #4E3E2F; text-align: center;">
                ${item.quantity}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #EBE4DC; font-size: 14px; color: #4E3E2F; text-align: right;">
                ₹${item.priceAtPurchase.toFixed(2)}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #EBE4DC; font-size: 14px; color: #4E3E2F; text-align: right; font-weight: bold;">
                ₹${(item.quantity * item.priceAtPurchase).toFixed(2)}
              </td>
            </tr>
          `
          )
          .join("");

        const trackingUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/status/${order.id}`;

        const htmlReceipt = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF6F0; padding: 30px; margin: 0; min-height: 100%;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FDFBF7; border: 1px solid #EBE4DC; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(78, 62, 47, 0.05);">
              <!-- Header -->
              <tr>
                <td style="background-color: #4E3E2F; padding: 24px; text-align: center; color: #FDFBF7;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Mussu's Henna Bliss</h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #FAF6F0; font-weight: 200;">Your natural henna order has shipped!</p>
                </td>
              </tr>
              <!-- Content Body -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="margin-top: 0; font-size: 18px; color: #4E3E2F; font-weight: bold; border-bottom: 1px solid #EBE4DC; padding-bottom: 10px;">Order Shipment Confirmation</h2>
                  <p style="font-size: 14px; color: #5C4D3E; line-height: 1.6; margin-bottom: 20px;">
                    Hi <strong>${order.customerName}</strong>,<br/>
                    Exciting news! Your natural, fresh henna cones have been packaged with care and shipped to your address. Here are your order details:
                  </p>
                  
                  <!-- Meta Details Table -->
                  <table width="100%" style="margin-bottom: 25px; font-size: 13px; color: #8C7A6B;">
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Order ID:</strong></td>
                      <td style="padding-bottom: 5px; font-family: monospace;">${order.id}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Date Placed:</strong></td>
                      <td style="padding-bottom: 5px;">${new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 5px;"><strong>Shipping Address:</strong></td>
                      <td style="padding-bottom: 5px;">${order.address}</td>
                    </tr>
                  </table>

                  <!-- Items Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 25px;">
                    <thead>
                      <tr style="background-color: #FAF6F0;">
                        <th style="padding: 10px 12px; border-bottom: 2px solid #EBE4DC; text-align: left; font-size: 12px; text-transform: uppercase; color: #8C7A6B;">Product</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #EBE4DC; text-align: center; font-size: 12px; text-transform: uppercase; color: #8C7A6B;">Qty</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #EBE4DC; text-align: right; font-size: 12px; text-transform: uppercase; color: #8C7A6B;">Price</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #EBE4DC; text-align: right; font-size: 12px; text-transform: uppercase; color: #8C7A6B;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsRowsHtml}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" style="padding: 12px; text-align: right; font-size: 14px; color: #8C7A6B;">Subtotal:</td>
                        <td style="padding: 12px; text-align: right; font-size: 14px; color: #4E3E2F;">₹${order.totalAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colspan="3" style="padding: 12px; text-align: right; font-size: 14px; color: #8C7A6B;">Shipping:</td>
                        <td style="padding: 12px; text-align: right; font-size: 14px; color: #5B8C5A; font-weight: bold;">Free</td>
                      </tr>
                      <tr style="border-top: 2px solid #EBE4DC;">
                        <td colspan="3" style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #4E3E2F;">Total Amount Paid:</td>
                        <td style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #4E3E2F;">₹${order.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <!-- Track Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${trackingUrl}" style="background-color: #4E3E2F; color: #FDFBF7; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                      Track Your Order Live
                    </a>
                  </div>
                  
                  <p style="font-size: 13px; color: #8C7A6B; line-height: 1.5; text-align: center; margin-top: 30px; border-top: 1px solid #EBE4DC; padding-top: 15px;">
                    Thank you for choosing Mussu's Henna Bliss! We hope our natural henna brings you joy. If you have any questions, feel free to reply to this email or reach out to Muskan directly on WhatsApp.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `;

        await transporter.sendMail({
          from: `"Mussu's Henna Bliss" <${smtpUser}>`,
          to: order.email,
          subject: `Your Henna Bliss Order has Shipped! (#${order.id.slice(0, 8)})`,
          html: htmlReceipt,
        });

        console.log(`[SMTP NodeMailer] Receipt sent to ${order.email}`);
      } catch (smtpErr) {
        console.error("Nodemailer transmission warning (SMTP auth/connection issue):", smtpErr);
      }
    } else {
      console.log("[SMTP NodeMailer] Ignored: SMTP_USER and SMTP_PASS variables not set in .env.");
    }

    // 5. Generate WhatsApp tracking text and construct response
    const formattedId = order.id.slice(0, 8).toUpperCase();
    const cleanPhone = order.phone.replace(/\D/g, "");
    // Ensure country code is present (Indian code 91 if phone is 10 digits)
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    const trackingLink = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/status/${order.id}`;
    const whatsappMessage = `Hi ${order.customerName}! Your order #${formattedId} has been packaged and is on its way. Track its progress here: ${trackingLink}`;
    
    return {
      success: true,
      order: updatedOrder,
      phone: phoneWithCode,
      message: whatsappMessage,
    };
  } catch (error: any) {
    console.error("Failed to mark order as paid & ship:", error);
    return {
      success: false,
      error: error.message || "Failed to finalize order shipment",
    };
  }
}

/**
 * Creates a manual order in the database and updates product stock levels.
 */
export async function createManualOrder(data: manualOrderCreateSchemaType) {
  try {
    const parsed = manualOrderCreateSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return { success: false, error: errorMessage || "Invalid input data" };
    }

    const { customerName, email, phone, address, status, paymentMethod, items } = parsed.data;

    // Fetch products from database to calculate pricing and check availability
    const productIds = items.map((item) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedTotal = 0;
    const itemsToCreate: { productId: string; quantity: number; priceAtPurchase: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return { success: false, error: "Product not found" };
      }
      calculatedTotal += product.price * item.quantity;
      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      // Deduct stock
      if (product.stock < item.quantity) {
        return { success: false, error: `Insufficient stock for product: ${product.name}` };
      }
    }

    // Run transaction: create order and decrement stock
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          customerName,
          email,
          phone,
          address,
          totalAmount: calculatedTotal,
          status,
          paymentMethod,
          items: {
            create: itemsToCreate,
          },
        },
      });

      // 2. Decrement product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Failed to create manual order:", error);
    return {
      success: false,
      error: error.message || "Failed to log manual order",
    };
  }
}

