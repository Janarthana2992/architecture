"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Sofa, TreePine, MapPin, Cpu, FileCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SERVICES } from "@/lib/constants";

const ICONS: Record<string, React.ElementType> = { Building2, Sofa, TreePine, MapPin, Cpu, FileCheck };

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} className="section-padding bg-subtle" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="max-w-xl mb-20">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="gold-line" />
            <span className="section-label">What We Do</span>
          </motion.div>
          <motion.h2
            id="services-heading"
            className="text-section font-serif text-[var(--text-primary)]"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            A complete design partnership
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Building2;
            return (
              <motion.div
                key={service.title}
                className="bg-[var(--bg)] p-10 group cursor-default"
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-10 h-10 border border-[var(--border)] group-hover:border-gold-500/50 flex items-center justify-center mb-8 transition-colors duration-700">
                  <Icon size={16} strokeWidth={1} className="text-gold-500" />
                </div>
                <h3 className="font-serif text-xl text-[var(--text-primary)] mb-3" style={{ fontWeight: 400, letterSpacing: "-0.01em" }}>
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-light mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-[var(--text-muted)] font-light">
                      <span className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link href="/services" className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-gold-500 transition-colors duration-500 group">
            Explore All Services
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
