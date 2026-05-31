"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { productSchema, ProductFormSchemaType } from "@/lib/zodSchemas";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    const { name, description, price, stock, category, imageUrl, inStock } = parsed.data;

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

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message || "Failed to create product" };
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

    const { name, description, price, stock, category, imageUrl, inStock } = parsed.data;

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

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message || "Failed to update product" };
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

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to toggle product status:", error);
    return { success: false, error: error.message || "Failed to update status" };
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

    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
}

/**
 * Server action to handle uploading high quality images locally to `public/uploads/`.
 */
export async function uploadProductImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save folder path relative to workspace root
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique safe name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.name) || ".jpg";
    const filename = `product-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch (error: any) {
    console.error("Error writing uploaded file:", error);
    return { success: false, error: error.message || "Failed to save file on server" };
  }
}
