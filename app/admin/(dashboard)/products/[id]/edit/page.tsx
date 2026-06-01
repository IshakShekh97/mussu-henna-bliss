import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductFormStandalone } from "@/components/admin/products/product-form-standalone";

export const metadata = {
  title: "Edit Product | Admin Portal",
  description: "Modify an existing product in the catalog.",
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 w-full py-2">
      <Suspense
        fallback={
          <div className="h-[600px] w-full rounded-2xl bg-[#FAF6F0]/40 border border-[#EBE4DC] animate-pulse flex items-center justify-center text-muted-foreground text-xs font-semibold">
            Loading Product Details...
          </div>
        }
      >
        <ProductFormStandalone product={product} />
      </Suspense>
    </div>
  );
}
