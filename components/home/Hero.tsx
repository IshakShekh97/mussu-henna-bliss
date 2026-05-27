"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <main>
      <section className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-5 items-center gap-10 ">
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

        <div className="h-full w-full flex items-center justify-center col-span-1 lg:col-span-3 gap-6">
          <div className="relative h-[80%] max-sm:h-[80%] lg:w-[24%] md:h-100 md:w-[23%] w-[38%] rounded-[25rem] overflow-hidden">
            <Image
              src={"/images/hero-2.jpg"}
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 18vw"
              className="p-3 rounded-[25rem] object-top"
            />
          </div>

          {/* Center (prominent) - always visible */}
          <div className="relative lg:h-full lg:w-[34%] md:h-120 md:w-[28%] h-80 max-sm:h-88 w-[45%] rounded-[25rem] overflow-hidden border-2 border-primary">
            <Image
              src={"/images/hero-1.jpg"}
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 35vw, 34vw"
              className="p-3 rounded-[25rem] object-top"
            />
          </div>

          <div className="relative hidden md:block h-[80%] lg:w-[24%] md:h-100 md:w-[23%] w-[18%] rounded-[25rem] overflow-hidden">
            <Image
              src={"/images/hero-3.jpg"}
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 0vw, (max-width: 1200px) 20vw, 18vw"
              className="p-3 rounded-[25rem] object-top"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
