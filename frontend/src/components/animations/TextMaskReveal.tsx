"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextMaskRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Cinematic text mask reveal — text slides up from behind a clipping mask.
 * Creates a premium "unveiling" effect seen in high-end architecture sites.
 */
export default function TextMaskReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}: TextMaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span ref={ref} className="inline-flex flex-wrap gap-x-[0.3em]">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.06,
                ease: [0.33, 1, 0.68, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
