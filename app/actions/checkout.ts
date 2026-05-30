"use server";
import prisma from "@/lib/prisma";
import { checkoutSchema, checkoutFormSchemaType } from "@/lib/zodSchemas";

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

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Checkout action error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
