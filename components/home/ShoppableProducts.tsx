import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../shop/ProductCard";
import { getProducts } from "@/app/actions/product.action";
import { Flower } from "lucide-react";

// Elegant loading skeleton matching the ProductCard design exactly to prevent layout shifts
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

          {/* Image Placeholder */}
          <div className="relative rounded-lg overflow-hidden bg-gray-200/50 aspect-square mb-4 mt-2 mx-1 z-10 border border-[#EBE4DC]/30 animate-pulse" />

          {/* Title Placeholder */}
          <div className="h-5 bg-gray-200/60 rounded-md w-3/4 mx-auto mb-3 animate-pulse" />

          {/* Separator Line */}
          <div className="h-0.5 bg-[#EBE4DC]/40 my-2 w-full animate-pulse" />

          {/* Button Placeholder */}
          <div className="h-9 bg-gray-200/50 rounded-md w-full mt-auto animate-pulse" />
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
          No premium henna products are available at this moment. Please check back soon!
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
      {/* Section Header */}
      <div className="mb-14 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-morlana font-light mb-4">
          Premium
          <span className="text-primary"> Henna </span>
          Products
        </h2>
        <p className="text-base md:text-lg text-foreground/70 font-light max-w-3xl mx-auto">
          Bring the magic of mehendi home with our carefully curated collection
          of premium henna products. From bridal cones to practice kits, find
          everything you need.
        </p>
      </div>

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
        <div className="flex items-center justify-center gap-4">
          <Button asChild size={"lg"} className="rounded px-8 py-3">
            <Link href={"/shop"}>View Full Shop</Link>
          </Button>
          <Link href={"/book"}>
            <Button
              asChild
              variant="outline"
              className="rounded px-8 py-3 border border-primary bg-primary/5 hover:bg-primary/20"
            >
              Book Service
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShoppableProducts;
