"use client";
import Image from "next/image";
import Link from "next/link";

interface GalleryItem {
  id: string;
  customerName: string;
  imagePath: string;
  subtitle: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    customerName: "Priya Sharma",
    subtitle: "Bridal Mehendi",
    imagePath: "/images/hero-1.jpg",
  },
  {
    id: "2",
    customerName: "Anjali Verma",
    subtitle: "Floral Motif",
    imagePath: "/images/hero-2.jpg",
  },
  {
    id: "3",
    customerName: "Neha Gupta",
    subtitle: "Elegant Henna",
    imagePath: "/images/hero-3.jpg",
  },
  {
    id: "4",
    customerName: "Divya Patel",
    subtitle: "Custom Design",
    imagePath: "/images/hero-4.jpg",
  },
];

const Gallary = () => {
  return (
    <section className="w-full py-16">
      <div className="mb-14 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/80 font-medium mb-4">
          Gallery
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-morlana font-light mb-4">
          Artistry in Every Stroke
        </h2>
        <p className="text-base md:text-lg text-foreground/70 font-light max-w-3xl mx-auto">
          Browse our curated collection of mehendi designs, each styled with
          rich detail, soft curves, and luxurious composition for every
          celebration.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4">
        {galleryItems.map((item, index) => (
          <article
            key={item.id}
            className="group overflow-hidden  border border-border/60 bg-muted shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
              <Image
                src={item.imagePath}
                alt={`Mehendi design by ${item.customerName}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority={index < 4}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground/60 mb-2">
                {item.subtitle}
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                {item.customerName}
              </h3>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-lg text-foreground/70 font-light mb-6">
          Want to see more designs or book your appointment?
        </p>
        <Link href="/gallery">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors duration-300">
            Explore More
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Gallary;
