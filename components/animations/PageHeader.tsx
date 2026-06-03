"use client";

import React from "react";
import { motion } from "framer-motion";
import FadeIn from "./FadeIn";
import TextReveal from "./TextReveal";

interface PageHeaderProps {
  badge?: string;
  title: string;
  highlightedWord?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

/**
 * Animated page-level header — same visual pattern as SectionHeader
 * but designed for page tops (larger text, entrance animation on mount).
 */
const PageHeader = ({
  badge,
  title,
  highlightedWord,
  description,
  className,
  children,
}: PageHeaderProps) => {
  const renderTitle = () => {
    if (!highlightedWord) {
      return (
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-morlana font-light leading-tight"
        >
          {title}
        </motion.h1>
      );
    }

    const parts = title.split(highlightedWord);
    return (
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl font-morlana font-light leading-tight"
      >
        {parts[0]}
        <span className="text-primary font-black">{highlightedWord}</span>
        {parts[1] || ""}
      </motion.h1>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`text-center max-w-2xl mx-auto mb-10 ${className || ""}`}
    >
      {badge && (
        <motion.div
          variants={itemVariants}
          className="text-lg font-light mb-2 font-serif text-primary"
        >
          {badge}
        </motion.div>
      )}

      {renderTitle()}

      {description && (
        <motion.p
          variants={itemVariants}
          className="text-sm text-muted-foreground mt-3 font-light"
        >
          {description}
        </motion.p>
      )}

      {children && <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
};

export default PageHeader;
