"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { clsx } from "clsx";

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
  const handleAddToCart = (productId: string, productName: string) => {
    // Toast or cart action can be added here
    console.log(`Added ${productName} to cart`);
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16">
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
          <div
            key={product.id}
            className={clsx(
              "group flex flex-col bg-white/50 border border-border/40 rounded-lg overflow-hidden shadow-sm transition duration-300 hover:shadow-lg hover:border-primary/60",
              index === products.length - 1 && "max-sm:col-span-full",
            )}
          >
            {/* Product Image Container */}
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <Image
                src={product.imagePath}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs md:text-sm font-semibold text-primary">
                  ₹{product.price}
                </span>
              </div>

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-medium">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-1 p-4 md:p-5">
              {/* Product Name */}
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 line-clamp-2">
                {product.name}
              </h3>

              {/* Buttons */}
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 px-3 py-2 border border-primary text-primary hover:bg-primary/10 rounded-md text-xs md:text-sm font-medium transition-colors duration-300">
                  View
                </button>
                <button
                  onClick={() => handleAddToCart(product.id, product.name)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors duration-300"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
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
