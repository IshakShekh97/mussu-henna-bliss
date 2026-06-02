"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  TextReveal,
  MagneticButton,
  staggerItemVariants,
} from "@/components/animations";
import { ChevronDown } from "lucide-react";

const heroImageVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const Hero = () => {
  return (
    <main className="relative">
      <section className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-5 items-center gap-10 min-h-[calc(100vh-8rem)]">
        {/* Left Column */}
        <div className="w-full h-full flex flex-col items-start justify-center col-span-1 lg:col-span-2">
          {/* Top Heading */}
          <FadeIn direction="up" delay={0} duration={0.7}>
            <div className="text-lg font-light mb-5 ml-3 font-serif w-full max-lg:text-center">
              ✨ Pure Elegance,{" "}
              <span className="text-primary">Timeless</span> Beauty
            </div>
          </FadeIn>

          {/* Main Heading — cinematic word-by-word reveal */}
          <div className="max-lg:text-center">
            <TextReveal
              text="Adorn Your Soul with Mehendi!"
              as="h1"
              mode="word"
              staggerDelay={0.08}
              delay={0.2}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-morlana font-light mt-3 md:mt-4 lg:mt-6 lg:tracking-wide leading-[1.15]"
              wordClassName="[&:nth-child(1)]:text-primary [&:nth-child(1)]:font-black [&:nth-child(5)]:text-primary [&:nth-child(5)]:font-black"
            />
          </div>

          {/* Description */}
          <FadeIn direction="up" delay={0.6} duration={0.7}>
            <div className="text-base max-lg:text-center max-md:max-w-[70%] max-lg:max-w-[80%] max-lg:mx-auto lg:text-xl font-light mt-4 text-foreground/80">
              Intricate patterns weaving tales of love, joy, and new beginnings
              on the canvas of your skin.
            </div>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn direction="up" delay={0.8} duration={0.7}>
            <div className="flex items-center justify-center gap-3 mt-7 max-lg:w-full">
              <MagneticButton>
                <Button
                  size={"lg"}
                  className="rounded-full px-7 py-3 text-base transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] active:scale-[0.97]"
                  asChild
                >
                  <Link href={"/book"}>Book Now</Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button
                  variant="outline"
                  className="rounded-full px-7 py-3 text-base border border-primary bg-primary/5 hover:bg-primary/15 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                >
                  Learn More
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>

        {/* Right Column — staggered hero images */}
        <div className="h-full w-full flex items-center justify-center col-span-1 lg:col-span-3 gap-4 sm:gap-6">
          {/* Left image */}
          <motion.div
            custom={1}
            variants={heroImageVariants}
            initial="hidden"
            animate="visible"
            className="relative h-[75%] max-sm:h-[75%] lg:w-[24%] md:h-100 md:w-[23%] w-[35%] rounded-[25rem] overflow-hidden group"
          >
            <Image
              src={"/images/hero-2.jpg"}
              alt="Beautiful henna design on hands"
              fill
              sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 18vw"
              className="p-2.5 rounded-[25rem] object-top transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>

          {/* Center (prominent) */}
          <motion.div
            custom={0}
            variants={heroImageVariants}
            initial="hidden"
            animate="visible"
            className="relative lg:h-full lg:w-[34%] md:h-120 md:w-[28%] h-80 max-sm:h-88 w-[42%] rounded-[25rem] overflow-hidden border-2 border-primary group animate-pulse-glow"
          >
            <Image
              src={"/images/hero-1.jpg"}
              alt="Bridal henna artistry showcase"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 35vw, 34vw"
              className="p-2.5 rounded-[25rem] object-top transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </motion.div>

          {/* Right image */}
          <motion.div
            custom={2}
            variants={heroImageVariants}
            initial="hidden"
            animate="visible"
            className="relative hidden md:block h-[75%] lg:w-[24%] md:h-100 md:w-[23%] w-[18%] rounded-[25rem] overflow-hidden group"
          >
            <Image
              src={"/images/hero-3.jpg"}
              alt="Elegant floral henna pattern"
              fill
              sizes="(max-width: 768px) 0vw, (max-width: 1200px) 20vw, 18vw"
              className="p-2.5 rounded-[25rem] object-top transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
        </div>
      </section>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden lg:flex"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 font-light">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Hero;
