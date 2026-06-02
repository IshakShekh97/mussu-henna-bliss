"use client";

import { clsx } from "clsx";
import { Flower } from "lucide-react";
import { motion } from "framer-motion";

interface TulipSepratorProps {
  sepratorColor?: string;
  tulipColor?: string;
  variant?: "straight" | "wavy";
  className?: string;
}

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const flowerVariants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: "backOut" as const,
    },
  },
};

const WavySeparator = ({ color }: { color: string }) => {
  return (
    <motion.svg
      className="flex-1 h-6"
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.8 },
        },
      }}
    >
      <motion.path
        d="M0,12 Q 25,4 50,12 T 100,12"
        stroke={color}
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

const TulipSeprator = ({
  sepratorColor,
  tulipColor,
  variant = "straight",
  className,
}: TulipSepratorProps) => {
  const color = sepratorColor ? sepratorColor : "var(--color-accent)";
  const accentClass = sepratorColor ? "" : "bg-accent";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={clsx("flex items-center justify-center gap-3 py-4", className)}
    >
      {variant === "wavy" ? (
        <WavySeparator color={color} />
      ) : (
        <motion.span
          variants={lineVariants}
          style={{ originX: 1 }}
          className={clsx("h-px flex-1", accentClass)}
        />
      )}
      <motion.div variants={flowerVariants}>
        <Flower
          className={clsx(
            "h-6 w-6",
            tulipColor ? tulipColor : "text-red-600"
          )}
          aria-hidden="true"
        />
      </motion.div>
      {variant === "wavy" ? (
        <WavySeparator color={color} />
      ) : (
        <motion.span
          variants={lineVariants}
          style={{ originX: 0 }}
          className={clsx("h-px flex-1", accentClass)}
        />
      )}
    </motion.div>
  );
};

export default TulipSeprator;
