"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlareHoverProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  maxTilt?: number;
}

/**
 * 3D tilt + glare spotlight effect on hover.
 */
export function GlareHover({
  children,
  className,
  glareColor = "rgba(201, 169, 110, 0.15)",
  maxTilt = 8,
}: GlareHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 300, damping: 30 });
  const y = useSpring(rawY, { stiffness: 300, damping: 30 });

  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]);

  // Glare position
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      {children}

      {/* Glare overlay */}
      {hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, ${glareColor} 0%, transparent 70%)`,
            opacity: 1,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
        />
      )}
    </motion.div>
  );
}
