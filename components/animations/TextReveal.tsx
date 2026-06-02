"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

type ElementTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TextRevealProps {
  text: string;
  as?: ElementTag;
  mode?: "word" | "character";
  staggerDelay?: number;
  className?: string;
  wordClassName?: string;
  once?: boolean;
  delay?: number;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.05,
      delayChildren: delay,
    },
  }),
};

const unitVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const TextReveal = ({
  text,
  as: Tag = "h2",
  mode = "word",
  staggerDelay = 0.05,
  className,
  wordClassName,
  once = true,
  delay = 0,
}: TextRevealProps) => {
  const MotionTag = motion.create(Tag);

  const units = mode === "word" ? text.split(" ") : text.split("");

  const customContainerVariants: Variants = {
    ...containerVariants,
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <MotionTag
      variants={customContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5, margin: "-30px" }}
      className={className}
      aria-label={text}
    >
      {units.map((unit, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: "top" }}
        >
          <motion.span
            variants={unitVariants}
            className={`inline-block ${wordClassName || ""}`}
          >
            {unit}
            {mode === "word" && index < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

export default TextReveal;
