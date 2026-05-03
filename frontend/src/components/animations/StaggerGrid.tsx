"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface StaggerGridProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

/**
 * Cascading waterfall animation for grid items.
 * Each child animates in sequence with a subtle y-slide + fade.
 */
export default function StaggerGrid({
  children,
  className,
  staggerDelay = 0.08,
  duration = 0.6,
}: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{
            duration,
            delay: i * staggerDelay,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
