import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { SplitText } from "@/components/animations/SplitText";
import { GradientText } from "@/components/animations/ShinyText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ParallaxImage from "@/components/animations/ParallaxImage";
import CurtainReveal from "@/components/animations/CurtainReveal";
import FloatingShapes from "@/components/animations/FloatingShapes";
import TextMaskReveal from "@/components/animations/TextMaskReveal";
import { TEAM_MEMBERS, COLLABORATORS, EMPLOYMENT_INFO } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ethos Habitats — a socially responsible architecture studio in Chennai, our story, philosophy, and the passionate team behind our designs.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 bg-page overflow-hidden" aria-label="About hero">
          <FloatingShapes variant="minimal" />
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-line" />
                <span className="section-label">Our Story</span>
              </div>
              <h1 className="font-serif text-display-lg text-[var(--text-primary)] mb-6 leading-tight">
                <SplitText text="Architecture with" />
                <br />
                <GradientText className="font-serif">Purpose & Conscience</GradientText>
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-xl">
                Ethos Habitats is a socially responsible architecture studio based in Chennai — designing practical, sustainable, and innovative spaces that leave a lasting impression on people and communities.
              </p>
            </div>
          </div>
        </section>

        {/* Story + image */}
        <section className="section-padding bg-subtle">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <h2 className="font-serif text-display-sm text-[var(--text-primary)] mb-6">
                  A Practice Built on Social Responsibility
                </h2>
                <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                  <p>
                    At Ethos Habitats, we believe architecture is more than buildings — it is a social act. We design spaces that are practical, sustainable, and deeply respectful of the communities they serve.
                  </p>
                  <p>
                    Our work spans residential, commercial, and public projects. In every project we take on, we bring the same rigor, curiosity, and care — collaborating closely with clients to deliver designs that exceed their expectations.
                  </p>
                  <p>
                    Sustainability is embedded in how we design. From passive strategies to material choices that respect the environment, we stay ahead of the curve so our clients always receive cutting-edge, responsible design.
                  </p>
                </div>

                {/* Values */}
                <div className="mt-10 grid grid-cols-2 gap-6">
                  {[
                    { label: "Human-Centered", desc: "Every design decision traces back to how it serves people and communities." },
                    { label: "Contextual", desc: "We listen to place, history, and culture before we draw." },
                    { label: "Sustainable", desc: "Long-term environmental responsibility by design, not afterthought." },
                    { label: "Collaborative", desc: "The best outcomes emerge when clients and designers think together." },
                  ].map((v) => (
                    <div key={v.label}>
                      <div className="text-xs tracking-[0.15em] uppercase text-gold-500 mb-1">{v.label}</div>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2} className="relative aspect-[4/5]">
                <CurtainReveal direction="right" delay={0.15}>
                  <ParallaxImage className="relative aspect-[4/5]">
                    <Image
                      src="/images/about-studio.webp"
                      alt="Ethos Habitats studio"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </ParallaxImage>
                </CurtainReveal>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-gold-500/40 pointer-events-none" aria-hidden="true" />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-page" aria-labelledby="team-heading">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="gold-line" />
                <span className="section-label">The People</span>
                <span className="gold-line" />
              </div>
              <h2 id="team-heading" className="font-serif text-display-md text-[var(--text-primary)]">
                Meet Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
              {TEAM_MEMBERS.map((member, i) => (
                <ScrollReveal key={member.name} delay={i * 0.15}>
                <article className="group">
                  <CurtainReveal direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.1}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-5">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  </CurtainReveal>
                  <h3 className="font-serif text-lg text-[var(--text-primary)]">{member.name}</h3>
                  <div className="text-xs tracking-[0.12em] uppercase text-gold-500 mt-0.5 mb-2">{member.role}</div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{member.bio}</p>
                </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Collaborators */}
        <section className="section-padding bg-subtle" aria-labelledby="collab-heading">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="gold-line" />
                <span className="section-label">Collaborators</span>
                <span className="gold-line" />
              </div>
              <h2 id="collab-heading" className="font-serif text-display-md text-[var(--text-primary)]">
                Our Partners
              </h2>
              <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                We work with specialist studios to deliver the best outcome for every project.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {COLLABORATORS.map((c, i) => (
                <ScrollReveal key={c.name} delay={i * 0.1}>
                <a
                  href={c.href}
                  className="group border border-[var(--border)] px-8 py-6 text-center hover:border-gold-500/60 transition-colors duration-300 min-w-[200px]"
                >
                  <p className="font-serif text-lg text-[var(--text-primary)] group-hover:text-gold-500 transition-colors">{c.name}</p>
                  <p className="text-xs tracking-[0.1em] uppercase text-[var(--text-muted)] mt-1">{c.description}</p>
                </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Employment / Careers */}
        <section className="section-padding bg-page" aria-labelledby="careers-heading">
          <div className="max-w-7xl mx-auto container-padding">
            <ScrollReveal>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-line" />
                <span className="section-label">Employment</span>
              </div>
              <h2 id="careers-heading" className="font-serif text-display-md text-[var(--text-primary)] mb-4">
                Join Our Team
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-12">
                We are always looking for creative talent to join our team.
              </p>

              <div className="space-y-10">
                {/* Internship */}
                <div className="border-l-2 border-gold-500 pl-8">
                  <h3 className="font-serif text-xl text-[var(--text-primary)] mb-3">
                    {EMPLOYMENT_INFO.internship.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
                    {EMPLOYMENT_INFO.internship.description}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] italic mb-4">
                    {EMPLOYMENT_INFO.internship.note}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Apply to{" "}
                    <a
                      href={`mailto:${EMPLOYMENT_INFO.internship.email}`}
                      className="text-gold-500 hover:underline"
                    >
                      {EMPLOYMENT_INFO.internship.email}
                    </a>
                  </p>
                </div>

                {/* Work */}
                <div className="border-l-2 border-gold-500 pl-8">
                  <h3 className="font-serif text-xl text-[var(--text-primary)] mb-3">
                    {EMPLOYMENT_INFO.work.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                    {EMPLOYMENT_INFO.work.description}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {EMPLOYMENT_INFO.work.note.replace("info@ethoshabitats.com", "").trim()}{" "}
                    <a
                      href={`mailto:${EMPLOYMENT_INFO.work.email}`}
                      className="text-gold-500 hover:underline"
                    >
                      {EMPLOYMENT_INFO.work.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
