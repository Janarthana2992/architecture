"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CountUpAnim } from "@/components/animations/CountUp";
import { STATS } from "@/lib/constants";

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 bg-page border-y border-[var(--border)]"
      aria-label="Company statistics"
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="font-serif text-5xl md:text-6xl text-[var(--text-primary)] mb-3" style={{ fontWeight: 400, letterSpacing: "-0.03em" }}>
                <CountUpAnim end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] font-light">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
