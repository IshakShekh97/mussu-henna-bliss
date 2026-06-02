"use client";

import { motion } from "framer-motion";
import { Leaf, Award, Heart } from "lucide-react";
import {
  StaggerContainer,
  staggerItemScaleVariants,
} from "@/components/animations";

const TrustBanner = () => {
  const trustItems = [
    {
      icon: Leaf,
      text: "100% Organic & Chemical-Free",
    },
    {
      icon: Award,
      text: "Rich, Dark Stain Guarantee",
    },
    {
      icon: Heart,
      text: "Expert Bridal Artist",
    },
  ];

  return (
    <div className="w-full py-12 md:py-16">
      {/* Desktop — staggered reveal */}
      <StaggerContainer
        staggerDelay={0.15}
        className="hidden sm:flex flex-row gap-8 items-center justify-around"
      >
        {trustItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              variants={staggerItemScaleVariants}
              className="flex flex-col items-center gap-3 text-center group cursor-default"
            >
              <div className="p-3.5 rounded-full bg-primary/8 backdrop-blur-sm border border-primary/10 transition-all duration-500 group-hover:bg-primary/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-transform duration-500 group-hover:rotate-12" />
              </div>
              <span className="text-sm sm:text-base font-medium max-w-xs leading-tight">
                {item.text}
              </span>
            </motion.div>
          );
        })}
      </StaggerContainer>

      {/* Mobile — infinite marquee */}
      <div className="sm:hidden overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-10 w-max"
        >
          {/* Duplicate items for seamless loop */}
          {[...trustItems, ...trustItems].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 shrink-0 px-4 py-3 rounded-full bg-primary/5 border border-primary/10"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustBanner;
