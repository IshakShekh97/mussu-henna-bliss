"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../shop/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  imagePath: string;
  badge?: string;
  slug?: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Bridal Cone",
    price: 599,
    imagePath: "/images/hero-1.jpg",
    badge: "Best Seller",
  },

  {
    id: "2",
    name: "Nail Henna",
    price: 199,
    imagePath: "/images/hero-3.jpg",
  },
  {
    id: "3",
    name: "Normal Cone",
    price: 1299,
    imagePath: "/images/hero-4.jpg",
    badge: "Popular",
  },
];

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

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3  gap-4 md:gap-6 mb-12">
        {products.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <p className="text-lg text-foreground/70 font-light mb-6">
          Browse our complete collection of premium mehendi products and get
          ready to create magic!
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size={"lg"} className="rounded px-8 py-3">
            View Full Shop
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
