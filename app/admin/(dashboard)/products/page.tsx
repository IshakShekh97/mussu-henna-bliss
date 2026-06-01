import React, { Suspense } from "react";
import { getProducts } from "@/app/actions/product.action";
import { ProductsList } from "@/components/admin/products/products-list";
import { ProductsSkeleton } from "@/components/admin/products/products-skeleton";

// Force dynamic fetch to prevent stale inventory cache
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products Inventory | Admin Portal",
  description:
    "Manage product catalogs, stock counts, and store listing availability.",
};

export default async function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsLoader />
    </Suspense>
  );
}

async function ProductsLoader() {
  const result = await getProducts();
  const products = result.success && result.data ? result.data : [];

  return <ProductsList initialProducts={products as any} />;
}
