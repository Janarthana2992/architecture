"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SplitText } from "@/components/animations/SplitText";
import { RotatingText } from "@/components/animations/RotatingText";
import { ClickSpark } from "@/components/animations/ClickSpark";
import Magnetic from "@/components/animations/Magnetic";

const ROTATING_WORDS = ["Sustainable.", "Innovative.", "Responsible.", "Inspired.", "Human."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityOverlay = useTransform(scrollYProgress, [0, 0.7], [0.45, 0.85]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[600px] flex items-end overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 bg-obsidian-900"
        style={{ y: yBg }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
          role="img"
          aria-label="Architecture showcase"
        />
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: opacityOverlay }}
        />
      </motion.div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[33, 66].map((pct) => (
          <motion.div
            key={`v${pct}`}
            className="absolute top-0 w-px h-full bg-white/5"
            style={{ left: `${pct}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
          />
        ))}
        {[33, 66].map((pct) => (
          <motion.div
            key={`h${pct}`}
            className="absolute left-0 h-px w-full bg-white/5"
            style={{ top: `${pct}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.7, ease: [0.33, 1, 0.68, 1] }}
          />
        ))}
        {/* Corner architectural marks */}
        {[
          { top: "33%", left: "33%" },
          { top: "33%", left: "66%" },
          { top: "66%", left: "33%" },
          { top: "66%", left: "66%" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3"
            style={pos}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
          >
            <div className="absolute top-1/2 left-0 w-full h-px bg-gold-400/30" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-gold-400/30" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="max-w-3xl">
          {/* Label */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="w-8 h-px bg-gold-400" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-gold-400 font-medium">
              Socially Responsible Architecture
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-display-xl text-white font-medium leading-[1.05] mb-6">
            <SplitText text="Architecture" delay={0.3} className="block" />
            <span className="block mt-1">
              <SplitText text="That Is" delay={0.45} />
              &nbsp;
              <RotatingText
                words={ROTATING_WORDS}
                className="text-gold-400 italic"
                interval={2800}
              />
            </span>
          </h1>

          {/* Sub */}
          <motion.p
            className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            We design practical, sustainable, and innovative spaces — from residential homes to commercial landmarks, rooted in social responsibility.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            <Magnetic strength={0.15}>
              <ClickSpark>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 text-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-400 transition-all duration-300 hover:-translate-y-px hover:shadow-glow-gold"
                >
                  View Portfolio <ArrowRight size={14} />
                </Link>
              </ClickSpark>
            </Magnetic>

            <Magnetic strength={0.15}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-xs tracking-[0.15em] uppercase font-medium hover:border-white hover:bg-white/5 transition-all duration-300"
              >
                Start a Project
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          aria-hidden="true"
        >
          <span className="text-[9px] tracking-[0.25em] uppercase rotate-90 origin-center mb-4">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={16} strokeWidth={1} />
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        className="absolute bottom-0 right-0 left-0 md:left-auto md:w-auto bg-black/40 backdrop-blur-md border-t border-white/10 md:border-t-0 md:border-l"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1 }}
      >
        <div className="flex divide-x divide-white/10 md:flex-col md:divide-x-0 md:divide-y">
          {[
            { value: "50+", label: "Projects" },
            { value: "5 yrs", label: "Experience" },
            { value: "100%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-4 text-center md:text-left flex-1 md:flex-none">
              <div className="font-serif text-xl text-gold-400">{stat.value}</div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-white/40 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
