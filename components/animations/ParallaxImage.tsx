"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  sizes?: string;
  speed?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

const ParallaxImage = ({
  src,
  alt,
  sizes,
  speed = 0.5,
  className,
  imageClassName,
  priority = false,
}: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-30 * speed, 30 * speed]);

  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.div style={{ y }} className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={imageClassName}
          priority={priority}
        />
      </motion.div>
    </div>
  );
};

export default ParallaxImage;
