"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  SectionHeader,
  staggerItemVariants,
} from "@/components/animations";

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

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 50 + (i % 2) * 20,
    scale: 0.95,
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const Gallary = () => {
  return (
    <section className="w-full py-16">
      <SectionHeader
        badge="Gallery"
        title="Artistry in Every Stroke"
        description="Browse our curated collection of mehendi designs, each styled with rich detail, soft curves, and luxurious composition for every celebration."
        className="mb-14"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1">
        {galleryItems.map((item, index) => (
          <motion.article
            key={item.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="group overflow-hidden border border-border/60 bg-muted shadow-sm cursor-pointer relative"
          >
            <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
              <Image
                src={item.imagePath}
                alt={`Mehendi design by ${item.customerName}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority={index < 4}
              />
              {/* Gradient overlay — deepens on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

              {/* Hover overlay content */}
              <div className="absolute inset-0 flex items-end p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-1.5">
                    {item.subtitle}
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {item.customerName}
                  </h3>
                </div>
              </div>
            </div>

            {/* Static info below image — visible on mobile, hidden on hover-capable devices */}
            <div className="p-4 md:p-5 md:group-hover:opacity-0 transition-opacity duration-300">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground/60 mb-1.5">
                {item.subtitle}
              </p>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                {item.customerName}
              </h3>
            </div>
          </motion.article>
        ))}
      </div>

      <FadeIn direction="up" delay={0.3}>
        <div className="mt-14 md:mt-16 text-center">
          <p className="text-lg text-foreground/70 font-light mb-6">
            Want to see more designs or book your appointment?
          </p>
          <Link href="/gallery">
            <button className="group/btn relative px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] active:scale-[0.97]">
              <span className="relative z-10">Explore More</span>
            </button>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
};

export default Gallary;
