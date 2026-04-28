"use client";

import { ReactLenis } from "lenis/react";

type SmoothScrollProps = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1,
        lerp: 0.09,
        duration: 1.2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
