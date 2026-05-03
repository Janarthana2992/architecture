"use client";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number; // seconds
}

/**
 * Text with a shimmer/shine sweep animation passing over it.
 */
export function ShinyText({ text, className, speed = 2.5 }: ShinyTextProps) {
  return (
    <span
      className={cn("shimmer-text", className)}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  /** CSS gradient string */
  gradient?: string;
  animate?: boolean;
}

/**
 * Text rendered with an animated gradient.
 */
export function GradientText({
  children,
  className,
  gradient,
  animate = true,
}: GradientTextProps) {
  const bg =
    gradient ??
    "linear-gradient(135deg, #C9A96E 0%, #E8D5A3 40%, #C9A96E 70%, #b07c28 100%)";

  return (
    <span
      className={cn(animate && "animate-gradient-x", className)}
      style={{
        background: bg,
        backgroundSize: animate ? "400% 400%" : "100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}
