"use client";
import { useEffect, useRef } from "react";

interface Trail {
  x: number;
  y: number;
  alpha: number;
  r: number;
}

interface SplashCursorProps {
  color?: string;
  trailLength?: number;
  maxRadius?: number;
}

/**
 * Canvas-based splash cursor trail — rendered only when user is on desktop.
 */
export function SplashCursor({
  color = "201, 169, 110",
  trailLength = 20,
  maxRadius = 18,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trails = useRef<Trail[]>([]);
  const mouse = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>();

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new point
      trails.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        alpha: 1,
        r: maxRadius,
      });

      // Keep trail length
      if (trails.current.length > trailLength) {
        trails.current.shift();
      }

      // Draw and fade
      trails.current.forEach((t, i) => {
        const progress = i / trails.current.length;
        t.alpha = progress * 0.6;
        t.r = progress * maxRadius;

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${t.alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [color, trailLength, maxRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
