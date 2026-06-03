"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SectionHeader,
  FadeIn,
  StaggerContainer,
  staggerItemVariants,
} from "@/components/animations";

interface GalleryItem {
  id: string;
  customerName: string;
  imagePath: string;
  subtitle: string;
}

const galleryItems: GalleryItem[] = [
  { id: "1", customerName: "Priya Sharma", subtitle: "Bridal Mehendi", imagePath: "/images/hero-1.jpg" },
  { id: "2", customerName: "Anjali Verma", subtitle: "Floral Motif", imagePath: "/images/hero-2.jpg" },
  { id: "3", customerName: "Neha Gupta", subtitle: "Elegant Henna", imagePath: "/images/hero-3.jpg" },
  { id: "4", customerName: "Divya Patel", subtitle: "Custom Design", imagePath: "/images/hero-4.jpg" },
  { id: "5", customerName: "Kavya Rao", subtitle: "Arabic Style", imagePath: "/images/hero-5.jpg" },
  { id: "6", customerName: "Riya Singh", subtitle: "Festive Pattern", imagePath: "/images/hero-1.jpg" },
  { id: "7", customerName: "Meera Kapoor", subtitle: "Traditional Art", imagePath: "/images/hero-2.jpg" },
  { id: "8", customerName: "Sana Mirza", subtitle: "Modern Fusion", imagePath: "/images/hero-3.jpg" },
];

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 40 + (i % 3) * 15,
    scale: 0.95,
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const GalleryPage = () => {
  return (
    <div className="w-full pb-16">
      {/* Animated Section Header */}
      <SectionHeader
        badge="✨ Our Portfolio"
        title="Henna Design Gallery"
        highlightedWord="Gallery"
        description="A curated collection of our finest mehendi artistry — from bridal masterpieces to contemporary designs, every stroke tells a story of beauty and tradition."
      />

      {/* Masonry-style gallery grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="break-inside-avoid group relative overflow-hidden rounded-2xl border border-border/40 bg-muted shadow-sm cursor-pointer"
          >
            <div
              className="relative overflow-hidden bg-slate-100"
              style={{
                // Alternate heights for masonry effect
                aspectRatio: index % 3 === 0 ? "3/4" : index % 3 === 1 ? "4/5" : "3/3.5",
              }}
            >
              <Image
                src={item.imagePath}
                alt={`Mehendi design: ${item.subtitle} by ${item.customerName}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority={index < 4}
              />
              
              {/* Elegant Inner Border */}
              <div className="absolute inset-1.5 border-[0.5px] border-white/30 rounded-xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Vintage Corner Flourishes */}
              <div className="absolute top-3.5 left-3.5 text-[#D4C3B3] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute top-3.5 right-3.5 text-[#D4C3B3] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute bottom-3.5 left-3.5 text-[#D4C3B3] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>
              <div className="absolute bottom-3.5 right-3.5 text-[#D4C3B3] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1 h-1 rounded-full bg-[#D4C3B3]" />
              </div>

              {/* Gradient overlay — deepens on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10" />

              {/* Hover overlay content */}
              <div className="absolute inset-0 flex items-end p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-1">
                    {item.subtitle}
                  </p>
                  <h3 className="text-base font-semibold text-white">
                    {item.customerName}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <FadeIn direction="up" delay={0.2}>
        <div className="mt-16 bg-gradient-to-r from-primary/15 to-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-gradient-rotate opacity-50" />
          <div className="relative z-10">
            <h3 className="font-morlana text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4">
              Want This{" "}
              <span className="text-primary font-black">Artistry</span> for
              Yourself?
            </h3>
            <p className="text-muted-foreground font-light text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Book a session with Mussu and get bespoke henna designs crafted
              just for you. Bridal, festive, or just because.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] active:scale-[0.97]"
            >
              Book Your Session
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default GalleryPage;
