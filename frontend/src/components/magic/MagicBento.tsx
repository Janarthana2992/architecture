"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicBentoItem {
  className?: string;
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

interface MagicBentoProps {
  items: MagicBentoItem[];
  className?: string;
}

/**
 * Bento-grid layout with individual card glows that follow the cursor.
 */
export function MagicBento({ items, className }: MagicBentoProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto",
        className
      )}
    >
      {items.map((item, i) => (
        <BentoCard key={i} item={item} />
      ))}
    </div>
  );
}

function BentoCard({ item }: { item: MagicBentoItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 25 });
  const y = useSpring(rawY, { stiffness: 200, damping: 25 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  const onMouseLeave = () => {
    rawX.set(-200);
    rawY.set(-200);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-none bg-[var(--bg-alt)] border border-[var(--border)] p-6 transition-border duration-300 hover:border-gold-500/40",
        item.className
      )}
      style={{
        gridColumn: item.colSpan ? `span ${item.colSpan}` : undefined,
        gridRow: item.rowSpan ? `span ${item.rowSpan}` : undefined,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.3 }}
    >
      {/* Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: useTransform(
            [x, y],
            ([lx, ly]) =>
              `radial-gradient(250px at ${lx}px ${ly}px, rgba(201,169,110,0.08), transparent 80%)`
          ),
        }}
      />
      {item.children}
    </motion.div>
  );
}
