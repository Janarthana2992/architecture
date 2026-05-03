"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40 overflow-hidden bg-[#0A0A0A]"
      aria-label="Call to action"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A96E]/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto container-padding text-center">
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="w-12 h-px bg-[#C9A96E]" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9A96E]">
            Ready to Build?
          </span>
          <span className="w-12 h-px bg-[#C9A96E]" />
        </motion.div>

        <motion.h2
          className="font-serif text-4xl md:text-6xl text-white leading-[1.1] mb-6"
          style={{ letterSpacing: "-0.03em", fontWeight: 400 }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&rsquo;s create something{" "}
          <span className="italic text-[#C9A96E]">extraordinary</span>
        </motion.h2>

        <motion.p
          className="text-white/40 text-base md:text-lg leading-relaxed max-w-md mx-auto mb-14 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          Every great building starts with a conversation. Share your vision with us.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#C9A96E] text-black text-[11px] tracking-[0.2em] uppercase font-normal hover:bg-[#b8993f] transition-all duration-500"
          >
            Start a Conversation <ArrowRight size={13} />
          </Link>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white/70 text-[11px] tracking-[0.2em] uppercase font-light hover:border-white/40 hover:text-white transition-all duration-500"
          >
            View Our Work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
