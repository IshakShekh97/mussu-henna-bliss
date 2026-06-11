import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../shop/ProductCard";
import { getProducts } from "@/app/actions/product.action";
import { Flower } from "lucide-react";
import { SectionHeader, GoldShimmer } from "@/components/animations";

// Premium gold shimmer skeleton matching ProductCard design
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative flex flex-col bg-[#FDFBF7] rounded-xl p-3 sm:p-4 border border-[#EBE4DC] shadow-sm select-none"
        >
          {/* Decorative Inner Border */}
          <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-lg pointer-events-none z-0" />

          {/* Vintage Corner Flourishes */}
          <div className="absolute top--0.75 left--0.75 text-[#EBE4DC] z-10 bg-[#FDFBF7] rounded-full p-0.5">
            <Flower size={14} strokeWidth={1.5} />
          </div>
          <div className="absolute top--0.75 right--0.75 text-[#EBE4DC] z-10 bg-[#FDFBF7] rounded-full p-0.5">
            <Flower size={14} strokeWidth={1.5} />
          </div>

          {/* Image Placeholder — gold shimmer */}
          <GoldShimmer className="aspect-square mb-4 mt-2 mx-1 rounded-lg" />

          {/* Title Placeholder */}
          <GoldShimmer className="h-5 w-3/4 mx-auto mb-3 rounded-md" />

          {/* Separator Line */}
          <GoldShimmer className="h-0.5 w-full my-2 rounded-full" />

          {/* Button Placeholder */}
          <GoldShimmer className="h-9 w-full mt-auto rounded-md" />
        </div>
      ))}
    </div>
  );
}

// Inner async component to fetch products from the DB
async function ShoppableProductsList() {
  const result = await getProducts();
  const products = result.success ? result.data.slice(0, 3) : [];

  if (products.length === 0) {
    return (
      <div className="text-center py-10 bg-[#FDFBF7] border border-[#EBE4DC] rounded-xl relative overflow-hidden mb-12">
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-lg pointer-events-none z-0" />
        <p className="text-sm text-gray-500 font-light z-10 relative">
          No premium henna products are available at this moment. Please check
          back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
      {products.map((product) => (
        <ProductCard product={product as any} key={product.id} />
      ))}
    </div>
  );
}

const ShoppableProducts = () => {
  return (
    <section className="w-full py-16">
      {/* Animated Section Header */}
      <SectionHeader
        title="Premium Henna Products"
        highlightedWord="Henna"
        description="Bring the magic of mehendi home with our carefully curated collection of premium henna products. From bridal cones to practice kits, find everything you need."
      />

      {/* Products Grid with React Suspense */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ShoppableProductsList />
      </Suspense>

      {/* CTA Section */}
      <div className="text-center">
        <p className="text-lg text-foreground/70 font-light mb-6">
          Browse our complete collection of premium mehendi products and get
          ready to create magic!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size={"lg"}
            className="rounded-full px-8 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto"
          >
            <Link href={"/shop"}>View Full Shop</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 py-3 border border-primary bg-primary/5 hover:bg-primary/15 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto"
          >
            <Link href={"/book"}>Book Service</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShoppableProducts;
