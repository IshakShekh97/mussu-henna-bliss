"use client";

import React from "react";
import { motion } from "framer-motion";
import TulipSeprator from "../common/TulipSeprator";
import {
  FadeIn,
  StaggerContainer,
  AnimatedCounter,
  staggerItemVariants,
} from "@/components/animations";

const steps = [
  { number: 1, label: "View my", highlight: "Gallery" },
  { number: 2, label: "Explore my", highlight: "Services & Products" },
  { number: 3, label: "Book Your", highlight: "Appointment" },
];

const Welcome = () => {
  return (
    <div className="w-full py-5">
      {/* Steps — horizontal on desktop, vertical timeline on mobile */}
      <StaggerContainer
        staggerDelay={0.2}
        className="flex flex-col gap-8 items-center justify-center mb-10 sm:flex-row sm:gap-0 sm:justify-around"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={staggerItemVariants}
            className="flex flex-col items-center gap-2 text-center text-lg sm:flex-row sm:text-left sm:items-start sm:gap-5 group cursor-default"
          >
            <span className="font-morlana text-primary text-5xl sm:text-6xl transition-transform duration-500 group-hover:scale-110">
              <AnimatedCounter target={step.number} suffix="." />
            </span>
            <span className="font-serif leading-tight">
              {step.label} <br />
              <span className="text-primary font-semibold">
                {step.highlight}
              </span>
            </span>
          </motion.div>
        ))}
      </StaggerContainer>

      <TulipSeprator />

      {/* Welcome message */}
      <FadeIn direction="up" delay={0.1}>
        <div className="mx-auto flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-sm px-4 py-4 text-center text-sm sm:flex-row sm:gap-2 sm:px-6 sm:py-3.5 sm:text-base md:text-lg transition-all duration-500 hover:bg-primary/8">
          <span>Welcome to</span>
          <span className="text-primary font-bold">Mussu Henna Bliss</span>
          <span>- Where Art Meets Tradition!</span>
        </div>
      </FadeIn>

      <TulipSeprator />
    </div>
  );
};

export default Welcome;
