import { getProducts } from "@/app/actions/product.action";
import ProductGridClient from "./ProductGridClient";
export const dynamic = "force-dynamic";

export default async function ProductGrid() {
  const result = await getProducts();
  const products = result.success ? result.data : [];

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl relative overflow-hidden">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-xl pointer-events-none z-0" />
        <div className="relative z-10 max-w-md mx-auto space-y-3 px-6">
          <p className="text-lg text-gray-700 font-light font-serif">
            ✨ No Products Available
          </p>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Our products are currently being updated. Check back soon for fresh
            batches of organic henna cones and kits!
          </p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <ProductGridClient initialProducts={products as any} />
    </section>
  );
}
