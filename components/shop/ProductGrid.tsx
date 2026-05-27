"use client";

import ProductCard from "./ProductCard";

const sampleProducts = [
  {
    id: "1",
    name: "Organic Bridal Cone",
    price: 12.0,
    imagePath: "/images/hero-1.jpg",
  },
  {
    id: "2",
    name: "Practice Cone - Natural",
    price: 8.0,
    imagePath: "/images/hero-2.jpg",
  },
  {
    id: "3",
    name: "Nail Henna Duo",
    price: 6.5,
    imagePath: "/images/hero-3.jpg",
  },
  {
    id: "4",
    name: "Bridal Cone - Large",
    price: 15.0,
    imagePath: "/images/hero-4.jpg",
  },
  {
    id: "5",
    name: "Practice Cone - Mini",
    price: 5.0,
    imagePath: "/images/hero-5.jpg",
  },
  {
    id: "6",
    name: "Nail Henna - Sample",
    price: 4.0,
    imagePath: "/images/hero-6.jpg",
  },
];

export default function ProductGrid() {
  const filtered = sampleProducts.filter(() => true);

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
