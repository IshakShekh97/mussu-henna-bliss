"use client";

import React from "react";
import FadeIn from "./FadeIn";
import TextReveal from "./TextReveal";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlightedWord?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}

const SectionHeader = ({
  badge,
  title,
  highlightedWord,
  description,
  className,
  titleClassName,
}: SectionHeaderProps) => {
  // If there's a highlighted word, we need to split the title and render it with spans
  const renderTitle = () => {
    if (!highlightedWord) {
      return (
        <TextReveal
          text={title}
          as="h2"
          className={`text-4xl md:text-5xl lg:text-6xl font-morlana font-light mb-4 ${titleClassName || ""}`}
        />
      );
    }

    // Split by highlighted word and render with spans
    const parts = title.split(highlightedWord);
    const words = title.split(" ");

    return (
      <FadeIn direction="up" delay={0.1}>
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-morlana font-light mb-4 ${titleClassName || ""}`}
        >
          {parts[0]}
          <span className="text-primary font-black">{highlightedWord}</span>
          {parts[1] || ""}
        </h2>
      </FadeIn>
    );
  };

  return (
    <div className={`mb-14 md:mb-16 text-center max-w-3xl mx-auto ${className || ""}`}>
      {badge && (
        <FadeIn direction="up" delay={0}>
          <div className="text-lg font-light mb-4 font-serif">{badge}</div>
        </FadeIn>
      )}

      {renderTitle()}

      {description && (
        <FadeIn direction="up" delay={0.2}>
          <p className="text-base md:text-lg text-foreground/70 font-light max-w-3xl mx-auto">
            {description}
          </p>
        </FadeIn>
      )}
    </div>
  );
};

export default SectionHeader;
