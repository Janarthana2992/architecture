"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlowingMenuItem {
  label: string;
  href: string;
  image?: string;
  description?: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
  className?: string;
}

/**
 * Large menu items where a colored band "flows" in from the side on hover,
 * with an optional image reveal. Great for services or portfolio categories.
 */
export function FlowingMenu({ items, className }: FlowingMenuProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <nav className={cn("overflow-hidden", className)} aria-label="Flowing menu">
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative flex items-center border-b border-[var(--border)] group overflow-hidden"
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {/* Background flow */}
          <AnimatePresence>
            {activeIndex === i && (
              <motion.div
                className="absolute inset-0 bg-gold-500/8 dark:bg-gold-500/5"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0, originX: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </AnimatePresence>

          <div className="relative flex items-center justify-between w-full py-6 px-0 z-10">
            <div className="flex items-center gap-6">
              {/* Number */}
              <span className="text-xs tabular-nums text-[var(--text-muted)] w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Label */}
              <motion.span
                className="font-serif text-2xl md:text-3xl text-[var(--text-primary)] group-hover:text-gold-500 transition-colors duration-300"
                animate={{ x: activeIndex === i ? 8 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.label}
              </motion.span>

              {/* Description */}
              {item.description && (
                <span className="hidden lg:block text-sm text-[var(--text-muted)] ml-4">
                  {item.description}
                </span>
              )}
            </div>

            {/* Arrow */}
            <motion.span
              className="text-gold-500 text-2xl"
              animate={{ x: activeIndex === i ? 0 : -10, opacity: activeIndex === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
