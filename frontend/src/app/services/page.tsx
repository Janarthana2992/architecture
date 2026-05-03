import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { FlowingMenu } from "@/components/magic/FlowingMenu";
import { MagicBento } from "@/components/magic/MagicBento";
import { SplitText } from "@/components/animations/SplitText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import FloatingShapes from "@/components/animations/FloatingShapes";
import BlueprintLines from "@/components/animations/BlueprintLines";
import { SERVICES } from "@/lib/constants";
import { Building2, Sofa, TreePine, MapPin, Cpu, FileCheck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-spectrum architectural services: design, interior architecture, landscape, urban planning, 3D visualization, and project management.",
};

const ICON_MAP: Record<string, React.ElementType> = { Building2, Sofa, TreePine, MapPin, Cpu, FileCheck };

export default function ServicesPage() {
  const menuItems = SERVICES.map((s) => ({
    label: s.title,
    href: `/contact?service=${encodeURIComponent(s.title)}`,
    description: s.description,
  }));

  const bentoItems = SERVICES.map((s) => {
    const Icon = ICON_MAP[s.icon] ?? Building2;
    return {
      children: (
        <div>
          <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center mb-5">
            <Icon size={18} strokeWidth={1.5} className="text-gold-500" />
          </div>
          <h3 className="font-serif text-xl text-[var(--text-primary)] mb-3">{s.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">{s.description}</p>
          <ul className="space-y-1.5">
            {s.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ),
    };
  });

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 bg-page overflow-hidden">
          <FloatingShapes variant="minimal" />
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-line" />
                <span className="section-label">What We Offer</span>
              </div>
              <h1 className="font-serif text-display-lg text-[var(--text-primary)] mb-6">
                <SplitText text="A Complete Design Partnership" />
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                From the first pencil sketch to occupancy, we are with you every step. Our integrated services eliminate the gap between vision and reality.
              </p>
            </div>
          </div>
        </section>

        {/* Flowing menu overview */}
        <section className="py-12 bg-subtle" aria-label="Services list">
          <div className="max-w-7xl mx-auto container-padding">
            <FlowingMenu items={menuItems} />
          </div>
        </section>

        {/* Bento detail grid */}
        <section className="section-padding bg-page" aria-labelledby="service-details-heading">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="gold-line" />
                <span className="section-label">In Depth</span>
                <span className="gold-line" />
              </div>
              <h2 id="service-details-heading" className="font-serif text-display-md text-[var(--text-primary)]">
                Service Details
              </h2>
            </div>

            <MagicBento items={bentoItems} />
          </div>
        </section>

        {/* Process */}
        <section className="relative section-padding bg-obsidian-800 overflow-hidden" aria-labelledby="process-heading">
          <BlueprintLines />
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-8 h-px bg-gold-400" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-medium">How We Work</span>
                <span className="w-8 h-px bg-gold-400" />
              </div>
              <h2 id="process-heading" className="font-serif text-display-md text-cream-100">Our Process</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-obsidian-600">
              {[
                { step: "01", title: "Discover", desc: "We listen deeply to understand your needs, aspirations, site, and budget." },
                { step: "02", title: "Design", desc: "Concepts evolve from sketches to refined drawings through continuous dialogue." },
                { step: "03", title: "Develop", desc: "Technical documents, permits, and specifications are prepared with precision." },
                { step: "04", title: "Deliver", desc: "We oversee construction and ensure the built result matches the design intent." },
              ].map((phase, i) => (
                <ScrollReveal key={phase.step} delay={i * 0.15}>
                <div className="bg-obsidian-700 p-8">
                  <div className="font-serif text-4xl text-gold-400/30 mb-4">{phase.step}</div>
                  <h3 className="font-sans text-base font-medium text-cream-100 mb-3 tracking-wide">{phase.title}</h3>
                  <p className="text-sm text-cream-200/50 leading-relaxed">{phase.desc}</p>
                </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
