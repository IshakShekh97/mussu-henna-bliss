"use server";
import prisma from "@/lib/prisma";
import { checkoutSchema, checkoutFormSchemaType } from "@/lib/zodSchemas";
import nodemailer from "nodemailer";

export async function checkoutCart(data: checkoutFormSchemaType) {
  try {
    // 1. Validate data
    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return { success: false, error: errorMessage || "Invalid input data" };
    }

    const { customerName, email, phone, address, items } = parsed.data;

    if (items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 2. Fetch products from DB to verify price and stock status
    const productIds = items.map((item) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedTotal = 0;
    const itemsToCreate = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return { success: false, error: `Product not found` };
      }
      if (!product.inStock) {
        return {
          success: false,
          error: `Product "${product.name}" is out of stock`,
        };
      }

      const price = product.price;
      calculatedTotal += price * item.quantity;
      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: price,
      });
    }

    // 3. Create order and nested order items in a transaction
    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        phone,
        address,
        totalAmount: calculatedTotal,
        status: "PENDING",
        items: {
          create: itemsToCreate,
        },
      },
    });

    // 4. Fetch full order details including product relationship
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 5. Send order notification email to owner (failsafe caught)
    if (fullOrder) {
      const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
      const smtpPort = Number((process.env.SMTP_PORT || "587").trim());
      const smtpUser = (process.env.SMTP_USER || "").trim();
      const smtpPass = (process.env.SMTP_PASS || "").trim();
      const smtpSecure = (process.env.SMTP_SECURE || "false").trim() === "true";

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

          const itemsRowsHtml = fullOrder.items
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
            `,
            )
            .join("");

          const adminUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/admin/orders`;

          const emailHtmlBody = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF6F0; padding: 30px; margin: 0; min-height: 100%;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FDFBF7; border: 1px solid #EBE4DC; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(78, 62, 47, 0.05);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #4E3E2F; padding: 24px; text-align: center; color: #FDFBF7;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Mussu's Henna Bliss</h1>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #FAF6F0; font-weight: 200;">New Customer Order Notification 🌟</p>
                  </td>
                </tr>
                <!-- Content Body -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin-top: 0; font-size: 18px; color: #4E3E2F; font-weight: bold; border-bottom: 1px solid #EBE4DC; padding-bottom: 10px;">Order Received!</h2>
                    <p style="font-size: 14px; color: #5C4D3E; line-height: 1.6; margin-bottom: 20px;">
                      Hi Muskan,<br/>
                      Great news! A new order has been placed on your website. Here are the order and customer details:
                    </p>
                    
                    <!-- Customer Details Table -->
                    <h3 style="font-size: 14px; color: #4E3E2F; font-weight: bold; margin-bottom: 10px;">Customer Details</h3>
                    <table width="100%" style="margin-bottom: 25px; font-size: 13px; color: #5C4D3E; background-color: #FAF6F0; border-radius: 8px; padding: 15px; border: 1px solid #EBE4DC;">
                      <tr>
                        <td style="padding-bottom: 5px; width: 120px;"><strong>Name:</strong></td>
                        <td style="padding-bottom: 5px;">${fullOrder.customerName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 5px;"><strong>Email:</strong></td>
                        <td style="padding-bottom: 5px;">${fullOrder.email}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 5px;"><strong>Phone:</strong></td>
                        <td style="padding-bottom: 5px;">${fullOrder.phone}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 5px;"><strong>Address:</strong></td>
                        <td style="padding-bottom: 5px;">${fullOrder.address}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 5px;"><strong>Payment Method:</strong></td>
                        <td style="padding-bottom: 5px;">${fullOrder.paymentMethod} (COD/WhatsApp confirmation)</td>
                      </tr>
                    </table>

                    <!-- Order Meta Table -->
                    <table width="100%" style="margin-bottom: 20px; font-size: 13px; color: #8C7A6B;">
                      <tr>
                        <td style="padding-bottom: 5px; width: 120px;"><strong>Order ID:</strong></td>
                        <td style="padding-bottom: 5px; font-family: monospace;">${fullOrder.id}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 5px;"><strong>Date Received:</strong></td>
                        <td style="padding-bottom: 5px;">${new Date(fullOrder.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</td>
                      </tr>
                    </table>

                    <!-- Items Table -->
                    <h3 style="font-size: 14px; color: #4E3E2F; font-weight: bold; margin-bottom: 10px;">Ordered Items</h3>
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
                          <td style="padding: 12px; text-align: right; font-size: 14px; color: #4E3E2F;">₹${fullOrder.totalAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding: 12px; text-align: right; font-size: 14px; color: #8C7A6B;">Shipping:</td>
                          <td style="padding: 12px; text-align: right; font-size: 14px; color: #5B8C5A; font-weight: bold;">Free</td>
                        </tr>
                        <tr style="border-top: 2px solid #EBE4DC;">
                          <td colspan="3" style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #4E3E2F;">Grand Total:</td>
                          <td style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #4E3E2F;">₹${fullOrder.totalAmount.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>

                    <!-- Admin Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${adminUrl}" style="background-color: #4E3E2F; color: #FDFBF7; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                        View Order in Admin Panel
                      </a>
                    </div>
                    
                    <p style="font-size: 11px; color: #8C7A6B; line-height: 1.5; text-align: center; margin-top: 30px; border-top: 1px solid #EBE4DC; padding-top: 15px;">
                      This is an automated notification sent by Mussu's Henna Bliss storefront.
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          `;

          await transporter.sendMail({
            from: `"Mussu's Henna Bliss" <${smtpUser}>`,
            to: smtpUser, // Send notification to owner
            subject: `🚨 New Order Received! (#${fullOrder.id.slice(0, 8).toUpperCase()})`,
            html: emailHtmlBody,
          });

          console.log(
            `[SMTP NodeMailer] Admin notification sent to ${smtpUser} for order ${fullOrder.id}`,
          );
        } catch (smtpErr) {
          console.error("Nodemailer admin notification error:", smtpErr);
        }
      } else {
        console.log(
          "[SMTP NodeMailer] Admin Notification Ignored: SMTP_USER and SMTP_PASS variables not set in .env.",
        );
      }
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Checkout action error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
