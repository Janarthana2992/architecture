"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  children: ReactNode;
  className?: string;
  speed?: number; // multiplier: 0.5 = subtle, 1 = full
  direction?: "up" | "down";
}

/**
 * Wraps an image (or any element) and shifts it on scroll for a parallax effect.
 * The parent should have `overflow-hidden` for the best result.
 */
export default function ParallaxImage({
  children,
  className,
  speed = 0.3,
  direction = "up",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = 100 * speed;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [`${range}px`, `-${range}px`] : [`-${range}px`, `${range}px`]
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="will-change-transform h-[120%] -mt-[10%]">
        {children}
      </motion.div>
    </div>
  );
}
