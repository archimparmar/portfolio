"use client";

import { useEffect, useRef } from "react";
import { useInView, useAnimation } from "framer-motion";

type AnimControls = ReturnType<typeof useAnimation>;

interface UseScrollRevealOptions {
  threshold?: number;
  once?: boolean;
}

/**
 * Returns a ref and framer-motion animation controls that trigger
 * when the element enters the viewport.
 */
export function useScrollReveal(
  options: UseScrollRevealOptions = {}
): { ref: React.RefObject<HTMLDivElement>; controls: AnimControls } {
  const { threshold = 0.15, once = true } = options;
  const ref = useRef<HTMLDivElement>(null!);
  const controls = useAnimation();
  const inView = useInView(ref, { amount: threshold, once });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [inView, controls, once]);

  return { ref, controls };
}

/**
 * Standard animation variants for consistent scroll reveals.
 */
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const fadeLeftVariants = {
  hidden: { opacity: 0, x: -36, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const fadeRightVariants = {
  hidden: { opacity: 0, x: 36, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.88, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};
