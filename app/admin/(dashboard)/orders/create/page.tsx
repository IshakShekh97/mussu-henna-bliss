import React, { Suspense } from "react";
import { getProducts } from "@/app/actions/product.action";
import { ManualOrderFormStandalone } from "@/components/admin/orders/manual-order-form-standalone";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Log Order | Admin Portal",
  description: "Create a manual product order.",
};

async function ManualOrderLoader() {
  const result = await getProducts();

  if (!result.success) {
    return (
      <div className="w-full text-center py-12 text-rose-500 text-xs font-semibold">
        Failed to load product catalog: {result.error}
      </div>
    );
  }

  const products = result.data || [];

  return <ManualOrderFormStandalone products={products as any[]} />;
}

export default function CreateOrderPage() {
  return (
    <div className="space-y-6 w-full py-2">
      <Suspense
        fallback={
          <div className="h-[400px] w-full rounded-2xl bg-[#FAF6F0]/40 border border-[#EBE4DC] animate-pulse flex flex-col items-center justify-center text-muted-foreground text-xs gap-2 font-semibold">
            <Loader2 className="h-6 w-6 animate-spin text-[#8C7A6B]/50" />
            <span>Loading Product Catalog...</span>
          </div>
        }
      >
        <ManualOrderLoader />
      </Suspense>
    </div>
  );
}
