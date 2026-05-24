"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  customerName: string;
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    customerName: "Priya Sharma",
    imagePath: "/images/hero-1.jpg",
    imageWidth: 400,
    imageHeight: 500,
  },
  {
    id: "2",
    customerName: "Anjali Verma",
    imagePath: "/images/hero-2.jpg",
    imageWidth: 500,
    imageHeight: 400,
  },
  {
    id: "3",
    customerName: "Neha Gupta",
    imagePath: "/images/hero-3.jpg",
    imageWidth: 450,
    imageHeight: 450,
  },
  {
    id: "4",
    customerName: "Divya Patel",
    imagePath: "/images/hero-4.jpg",
    imageWidth: 350,
    imageHeight: 550,
  },
];

const Gallary = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-morlana font-light mb-4">
          <span className="text-primary font-black">Gallery </span>
          of Artistry
        </h2>
        <p className="text-base md:text-lg text-foreground/70 font-light max-w-2xl mx-auto">
          Discover the intricate mehendi designs created for our beloved
          clients. Each design tells a unique story of beauty and tradition.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 auto-rows-max">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-none border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
          >
            {/* Image Container - Fixed aspect ratio */}
            <div className="relative w-full aspect-3/4 bg-secondary overflow-hidden">
              {!loadedImages.has(item.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              <Image
                src={item.imagePath}
                alt={`Mehendi design for ${item.customerName}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  loadedImages.has(item.id) ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(item.id)}
                priority={parseInt(item.id) <= 4}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Customer Name Badge */}
            <div className="relative px-4 py-3 bg-card border-t border-border">
              <p className="text-sm md:text-base font-serif text-foreground font-medium truncate">
                {item.customerName}
              </p>
              <p className="text-xs text-foreground/60 font-light mt-1">
                Mehendi Art
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 text-center">
        <p className="text-lg text-foreground/70 font-light mb-6">
          Want to see more designs or book your appointment?
        </p>
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors duration-300">
          Explore More
        </button>
      </div>
    </section>
  );
};

export default Gallary;
