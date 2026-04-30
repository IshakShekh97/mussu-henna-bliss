"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <main>
      <section className="w-full grid grid-cols-5 items-center  gap-10 py-20 px-4 md:px-8 lg:px-16">
        {/* Left Column */}
        <div className="w-full h-full flex flex-col items-start justify-center col-span-2">
          {/* Top Heading */}
          <div className="text-lg font-light mb-5 ml-3 font-serif">
            ✨ Pure Elegance, <span className="text-primary">Timeless</span>{" "}
            Beauty
          </div>
          {/* Main Heading */}
          <div className="text-8xl font-morlana font-light mt-5 tracking-wide xl:leading-28 leading-16 ">
            <span className="text-primary">Adorn </span>
            Your Soul with <span className="text-primary">Mehendi</span>!
          </div>
          {/* Description */}
          <div className="text-xl font-light mt-4">
            Intricate patterns weaving tales of love, joy, and new beginnings on
            the canvas of your skin.
          </div>
          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <Button size={"lg"} className="rounded px-5 py-3" asChild>
              <Link href={"/book"}>Book Now</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded px-5 py-3 border border-primary bg-primary/5 hover:bg-primary/20"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="h-full w-full flex items-center justify-center md:col-span-3  gap-3">
          <div className="relative h-full w-80 rounded-[25rem] overflow-hidden border-2 border-primary">
            <Image
              src={"/images/hero-1.jpg"}
              alt="Hero Image"
              fill
              className="p-3 rounded-[25rem] object-top"
            />
          </div>

          <div className="relative h-[80%] w-72 rounded-[25rem] overflow-hidden">
            <Image
              src={"/images/hero-2.jpg"}
              alt="Hero Image"
              fill
              className="p-3 rounded-[25rem] object-top"
            />
          </div>

          <div className="relative h-[70%] w-64 rounded-[25rem] overflow-hidden">
            <Image
              src={"/images/hero-3.jpg"}
              alt="Hero Image"
              fill
              className="p-3 rounded-[25rem] object-top"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
