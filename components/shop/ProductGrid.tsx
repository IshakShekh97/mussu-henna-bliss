"use client";

import ProductCard from "./ProductCard";

const sampleProducts = [
  {
    id: "1",
    name: "Organic Bridal Cone",
    price: "$12.00",
    image: "/images/product1.jpg",
  },
  {
    id: "2",
    name: "Practice Cone - Natural",
    price: "$8.00",
    image: "/images/product2.jpg",
  },
  {
    id: "3",
    name: "Nail Henna Duo",
    price: "$6.50",
    image: "/images/product3.jpg",
  },
  {
    id: "4",
    name: "Bridal Cone - Large",
    price: "$15.00",
    image: "/images/product4.jpg",
  },
  {
    id: "5",
    name: "Practice Cone - Mini",
    price: "$5.00",
    image: "/images/product5.jpg",
  },
  {
    id: "6",
    name: "Nail Henna - Sample",
    price: "$4.00",
    image: "/images/product6.jpg",
  },
];

export default function ProductGrid() {
  const filtered = sampleProducts.filter(() => true);

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
