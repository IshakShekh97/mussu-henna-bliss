"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { productSchema, ProductFormSchemaType } from "@/lib/zodSchemas";

/**
 * Fetch all products from database sorted by creation date descending.
 */
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return {
      success: false,
      error: error.message || "Failed to query products",
      data: [],
    };
  }
}

/**
 * Creates a new product in the database.
 */
export async function createProduct(data: ProductFormSchemaType) {
  try {
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return { success: false, error: errorMessage || "Invalid input data" };
    }

    const { name, description, price, stock, category, imageUrl, inStock } =
      parsed.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
        inStock,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop"); // Clear storefront cache if dynamic caching is applied
    revalidatePath("/");

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return {
      success: false,
      error: error.message || "Failed to create product",
    };
  }
}

/**
 * Updates an existing product's details.
 */
export async function updateProduct(id: string, data: ProductFormSchemaType) {
  try {
    if (!id) {
      return { success: false, error: "Product ID is required" };
    }

    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return { success: false, error: errorMessage || "Invalid input data" };
    }

    const { name, description, price, stock, category, imageUrl, inStock } =
      parsed.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
        inStock,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return {
      success: false,
      error: error.message || "Failed to update product",
    };
  }
}

/**
 * Quickly toggles the product's active availability inStock status.
 */
export async function toggleProductStock(id: string, inStock: boolean) {
  try {
    if (!id) {
      return { success: false, error: "Product ID is required" };
    }

    const product = await prisma.product.update({
      where: { id },
      data: { inStock },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to toggle product status:", error);
    return {
      success: false,
      error: error.message || "Failed to update status",
    };
  }
}

/**
 * Deletes a product from the database.
 */
export async function deleteProduct(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Product ID is required" };
    }

    const product = await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to delete product:", error);

    const errorMessage = error?.message || "";
    const causeMessage = error?.cause?.message || "";
    const originalMessage = error?.cause?.originalMessage || "";
    const detailMessage = error?.detail || error?.cause?.detail || "";

    const isForeignKeyViolation =
      error?.code === "P2003" ||
      errorMessage.includes("foreign key constraint") ||
      errorMessage.includes("violates RESTRICT setting") ||
      causeMessage.includes("foreign key constraint") ||
      causeMessage.includes("violates RESTRICT setting") ||
      originalMessage.includes("foreign key constraint") ||
      originalMessage.includes("violates RESTRICT setting") ||
      detailMessage.includes("referenced from table");

    if (isForeignKeyViolation) {
      return {
        success: false,
        error: "Cannot delete this product because it has been purchased in past orders. You can set its stock to 0 or hide it from the storefront instead.",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to delete product",
    };
  }
}
