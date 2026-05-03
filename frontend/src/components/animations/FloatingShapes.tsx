"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Subtle floating architectural geometric shapes that drift on scroll.
 * Place inside a section as a decorative background layer.
 */
export default function FloatingShapes({
  variant = "default",
  className,
}: {
  variant?: "default" | "minimal" | "dense";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div ref={ref} className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ""}`} aria-hidden="true">
      {/* Golden rectangle (architectural proportion) */}
      <motion.div
        className="absolute w-32 h-20 border border-gold-500/10 right-[10%] top-[15%]"
        style={{ y: y1, rotate: rotate1 }}
      />

      {/* Circle — reference to compass / plan */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-gold-500/8 left-[5%] top-[40%]"
        style={{ y: y2 }}
      />

      {/* Diagonal line */}
      <motion.div
        className="absolute w-px h-48 bg-gold-500/8 right-[25%] top-[20%] origin-top"
        style={{ y: y3, rotate: rotate2 }}
      />

      {/* Small square — brick / module reference */}
      <motion.div
        className="absolute w-8 h-8 border border-gold-500/10 left-[15%] bottom-[20%]"
        style={{ y: y1, rotate: rotate1 }}
      />

      {/* Cross mark — architectural datum */}
      <motion.div className="absolute right-[8%] bottom-[30%]" style={{ y: y2 }}>
        <div className="w-px h-6 bg-gold-500/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-6 h-px bg-gold-500/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      {variant !== "minimal" && (
        <>
          {/* Triangle — roof line */}
          <motion.div
            className="absolute left-[30%] top-[10%]"
            style={{ y: y3 }}
          >
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <path d="M30 0 L60 40 L0 40 Z" stroke="currentColor" strokeWidth="0.5" className="text-gold-500/10" />
            </svg>
          </motion.div>

          {/* Dotted grid */}
          <motion.div
            className="absolute right-[15%] top-[55%] grid grid-cols-4 gap-4"
            style={{ y: y1 }}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-gold-500/8" />
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
