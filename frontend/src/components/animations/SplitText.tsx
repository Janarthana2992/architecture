"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** "words" or "chars" */
  mode?: "words" | "chars";
  once?: boolean;
}

export function SplitText({
  text,
  className,
  delay = 0,
  mode = "words",
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
    else if (!once) controls.start("hidden");
  }, [inView, controls, once]);

  const items =
    mode === "words" ? text.split(" ") : text.split("");

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: mode === "words" ? 0.08 : 0.03, delayChildren: delay },
    },
  };

  const item = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <span ref={ref} className={cn("inline", className)} aria-label={text}>
      <motion.span
        className="inline"
        variants={container}
        initial="hidden"
        animate={controls}
      >
        {items.map((chunk, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden"
            aria-hidden="true"
          >
            <motion.span className="inline-block" variants={item}>
              {chunk}
              {mode === "words" && i < items.length - 1 ? "\u00a0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}
