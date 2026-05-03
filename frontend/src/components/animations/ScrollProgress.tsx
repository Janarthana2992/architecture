"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Golden scroll progress bar at the top of the page.
 * Shows how far the user has scrolled.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gold-500 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
