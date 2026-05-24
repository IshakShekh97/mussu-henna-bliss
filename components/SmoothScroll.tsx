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
        lerp: 0.1,
        syncTouchLerp: 0.7,
      }}
    >
      {children}
    </ReactLenis>
  );
}
