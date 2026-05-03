"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface CurtainRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  delay?: number;
  curtainColor?: string;
}

/**
 * Architectural image-reveal: a solid curtain slides away to reveal content.
 * Creates a dramatic unveiling effect popular in architecture portfolios.
 */
export default function CurtainReveal({
  children,
  className,
  direction = "left",
  duration = 0.9,
  delay = 0,
  curtainColor = "var(--accent)",
}: CurtainRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const origins: Record<string, string> = {
    left: "left",
    right: "right",
    up: "top",
    down: "bottom",
  };
  const scaleAxis = direction === "left" || direction === "right" ? "scaleX" : "scaleY";

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      {/* Content (fades in after curtain passes) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.01, delay: delay + duration * 0.4 }}
      >
        {children}
      </motion.div>

      {/* Curtain overlay */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: curtainColor,
          transformOrigin: origins[direction],
        }}
        initial={{ [scaleAxis]: 1 }}
        animate={inView ? { [scaleAxis]: 0 } : {}}
        transition={{
          duration,
          delay,
          ease: [0.65, 0, 0.35, 1],
        }}
      />
    </div>
  );
}
