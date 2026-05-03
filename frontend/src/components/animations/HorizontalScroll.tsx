"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Horizontal scroll section: content moves sideways as you scroll vertically.
 * Creates a cinematic portfolio-gallery feel. Parent pin area is 300vh tall.
 */
export default function HorizontalScroll({ children, className }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div
          className={`flex gap-8 pl-[5vw] ${className ?? ""}`}
          style={{ x }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
