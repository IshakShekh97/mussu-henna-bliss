"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  delay = 0,
  className,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) => {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pre-built item variants for use inside StaggerContainer
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const staggerItemScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const staggerItemSlideVariants = (
  direction: "left" | "right" = "left"
): Variants => ({
  hidden: { opacity: 0, x: direction === "left" ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
});

export default StaggerContainer;
