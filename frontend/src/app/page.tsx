import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTASection } from "@/components/sections/CTASection";
import type { Metadata } from "next";

const HeroScrub = dynamic(() => import("@/components/ui/hero-scrub"), { ssr: false });

export const metadata: Metadata = {
  title: "Ethos Habitats — Socially Responsible Architecture",
  description:
    "Ethos Habitats is a socially responsible architecture studio in Chennai crafting sustainable, innovative, and human-centered spaces.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroScrub />
        <StatsSection />
        <FeaturedProjects />
        <ServicesSection />
        <Testimonials />
        <BlogPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
