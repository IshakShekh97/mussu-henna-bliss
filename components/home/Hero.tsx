"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <main>
      <section className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-5 items-center gap-10 py-20 px-4 md:px-8 lg:px-16">
        {/* Left Column */}
        <div className="w-full h-full flex flex-col items-start justify-center col-span-1 lg:col-span-2">
          {/* Top Heading */}
          <div className="text-lg font-light mb-5 ml-3 font-serif w-full max-lg:text-center">
            ✨ Pure Elegance, <span className="text-primary">Timeless</span>{" "}
            Beauty
          </div>
          {/* Main Heading */}
          <div className="text-6xl md:text-7xl max-lg:text-center lg:text-8xl font-morlana font-light mt-3 md:mt-4 lg:mt-6 lg:tracking-wide leading-20 md:leading-24 lg:leading-28">
            <span className="text-primary font-black">Adorn </span>
            Your Soul with{" "}
            <span className="text-primary font-black">Mehendi</span>!
          </div>
          {/* Description */}
          <div className="text-base max-lg:text-center max-md:max-w-[70%] max-lg:max-w-[80%] max-lg:mx-auto lg:text-xl font-light mt-4">
            Intricate patterns weaving tales of love, joy, and new beginnings on
            the canvas of your skin.
          </div>
          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 mt-5 max-lg:w-full">
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
        <div className="h-full w-4xl flex items-center lg:justify-center col-span-1 lg:col-span-3 gap-3">
          <div className="relative h-[80%] lg:w-[28%] md:h-100 md:w-[23%] w-[17%] rounded-[25rem] overflow-hidden">
            <Image
              src={"/images/hero-2.jpg"}
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="p-3 rounded-[25rem] object-top"
            />
          </div>

          <div className="relative lg:h-full lg:w-[34%] md:h-120 md:w-[25%] h-80 w-[20%] rounded-[25rem] overflow-hidden border-2 border-primary">
            <Image
              src={"/images/hero-1.jpg"}
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 20vw, (max-width: 1200px) 25vw, 34vw"
              className="p-3 rounded-[25rem] object-top"
            />
          </div>

          <div className="relative h-[70%] lg:w-[24%] md:h-80 md:w-[20%] w-[15%] rounded-[25rem] overflow-hidden">
            <Image
              src={"/images/hero-3.jpg"}
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 15vw, (max-width: 1200px) 20vw, 24vw"
              className="p-3 rounded-[25rem] object-top"
            />
          </div>
        </div>
        {/* Right Column */}
      </section>
    </main>
  );
};

export default Hero;
