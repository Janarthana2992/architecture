"use client";
import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface ClickSparkProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  count?: number;
}

/**
 * Emits spark particles from the click point on any child element.
 */
export function ClickSpark({
  children,
  className,
  color = "#C9A96E",
  count = 8,
}: ClickSparkProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const idRef = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newSparks: Spark[] = Array.from({ length: count }, (_, i) => ({
        id: ++idRef.current,
        x,
        y,
        angle: (360 / count) * i,
      }));

      setSparks((prev) => [...prev, ...newSparks]);
      // Remove after animation
      setTimeout(() => {
        setSparks((prev) =>
          prev.filter((s) => !newSparks.find((ns) => ns.id === s.id))
        );
      }, 600);
    },
    [count]
  );

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      onClick={handleClick}
    >
      {children}

      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 6,
              height: 6,
              backgroundColor: color,
              left: spark.x - 3,
              top: spark.y - 3,
              originX: "center",
              originY: "center",
            }}
            initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            animate={{
              scale: 0,
              opacity: 0,
              x: Math.cos((spark.angle * Math.PI) / 180) * 40,
              y: Math.sin((spark.angle * Math.PI) / 180) * 40,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
