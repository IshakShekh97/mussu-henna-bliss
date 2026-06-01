import React, { Suspense } from "react";
import { ProductFormStandalone } from "@/components/admin/products/product-form-standalone";

export const metadata = {
  title: "Add Product | Admin Portal",
  description: "Add a new product to your inventory catalog.",
};

export default function CreateProductPage() {
  return (
    <div className="space-y-6 w-full py-2">
      <Suspense
        fallback={
          <div className="h-[600px] w-full rounded-2xl bg-[#FAF6F0]/40 border border-[#EBE4DC] animate-pulse flex items-center justify-center text-muted-foreground text-xs font-semibold">
            Loading Form...
          </div>
        }
      >
        <ProductFormStandalone />
      </Suspense>
    </div>
  );
}
