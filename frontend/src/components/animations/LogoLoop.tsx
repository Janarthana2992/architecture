"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoLoopProps {
  items: Array<{ name: string; logo: React.ReactNode }>;
  className?: string;
  speed?: number; // pixels per second
}

/**
 * Infinite horizontal scrolling logo strip.
 */
export function LogoLoop({ items, className, speed = 40 }: LogoLoopProps) {
  // Duplicate array so the loop is seamless
  const doubled = [...items, ...items];
  const duration = (items.length * 120) / speed;

  return (
    <div
      className={cn("overflow-hidden relative", className)}
      aria-hidden="true"
    >
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-12 items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="flex items-center gap-2 text-[var(--text-muted)] opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 shrink-0"
          >
            {item.logo}
            <span className="text-sm font-medium tracking-wide whitespace-nowrap">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
