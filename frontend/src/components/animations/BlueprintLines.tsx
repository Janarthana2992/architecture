"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Architectural blueprint lines that animate (draw) as the user scrolls.
 * Place as a decorative overlay inside a section.
 */
export default function BlueprintLines({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pathLen1 = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const pathLen2 = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const pathLen3 = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const pathLen4 = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        {/* Main horizontal axis */}
        <motion.line
          x1="0" y1="400" x2="1200" y2="400"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gold-500/20"
          style={{ pathLength: pathLen1 }}
        />
        {/* Vertical center */}
        <motion.line
          x1="600" y1="0" x2="600" y2="800"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gold-500/20"
          style={{ pathLength: pathLen2 }}
        />
        {/* Building outline - left */}
        <motion.path
          d="M 200 600 L 200 250 L 350 200 L 500 250 L 500 600"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-gold-500/15"
          style={{ pathLength: pathLen3 }}
        />
        {/* Building outline - right */}
        <motion.path
          d="M 700 600 L 700 300 L 850 180 L 1000 300 L 1000 600"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-gold-500/15"
          style={{ pathLength: pathLen4 }}
        />
        {/* Door left */}
        <motion.rect
          x="310" y="480" width="80" height="120"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gold-500/10"
          style={{ pathLength: pathLen3 }}
        />
        {/* Window right */}
        <motion.rect
          x="780" y="350" width="60" height="80"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gold-500/10"
          style={{ pathLength: pathLen4 }}
        />
        {/* Measurement lines */}
        <motion.path
          d="M 200 650 L 500 650 M 200 640 L 200 660 M 500 640 L 500 660"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gold-500/15"
          style={{ pathLength: pathLen1 }}
        />
        <motion.path
          d="M 700 650 L 1000 650 M 700 640 L 700 660 M 1000 640 L 1000 660"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gold-500/15"
          style={{ pathLength: pathLen2 }}
        />
        {/* Diagonal composition line */}
        <motion.line
          x1="100" y1="700" x2="1100" y2="100"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-gold-500/8"
          strokeDasharray="8 12"
          style={{ pathLength: pathLen1 }}
        />
        {/* Cross markers */}
        {[
          [200, 250], [500, 250], [700, 300], [1000, 300], [600, 400],
        ].map(([cx, cy], i) => (
          <motion.g key={i} style={{ opacity: pathLen3 }}>
            <line x1={cx - 4} y1={cy - 4} x2={cx + 4} y2={cy + 4} stroke="currentColor" strokeWidth="0.5" className="text-gold-500/20" />
            <line x1={cx + 4} y1={cy - 4} x2={cx - 4} y2={cy + 4} stroke="currentColor" strokeWidth="0.5" className="text-gold-500/20" />
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
