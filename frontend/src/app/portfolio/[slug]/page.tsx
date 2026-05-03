import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { projectsApi, getImageUrl } from "@/lib/api";
import { getCategoryLabel, formatDate } from "@/lib/utils";
import { MapPin, Calendar, Maximize2, Users, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

// Server-side data fetching for SSR & SEO
async function getProject(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.meta_title ?? project.title,
    description: project.meta_description ?? project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: [{ url: getImageUrl(project.cover_image) }],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const details = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Calendar, label: "Year", value: project.year },
    project.area && { icon: Maximize2, label: "Area", value: project.area },
    project.client && { icon: Users, label: "Client", value: project.client },
  ].filter(Boolean) as Array<{ icon: React.ElementType; label: string; value: string | number }>;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.short_description,
    creator: { "@type": "Organization", name: "Ethos Habitats" },
    locationCreated: { "@type": "Place", name: project.location },
    dateCreated: String(project.year),
    image: getImageUrl(project.cover_image),
  };

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero image */}
        <div className="relative h-[60vh] md:h-[75vh] mt-18 md:mt-20 overflow-hidden">
          <Image
            src={getImageUrl(project.cover_image)}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Back */}
          <Link
            href="/portfolio"
            className="absolute top-6 left-6 md:left-8 flex items-center gap-2 text-white/70 hover:text-white text-xs tracking-[0.12em] uppercase transition-colors duration-200"
          >
            <ArrowLeft size={14} /> Portfolio
          </Link>

          {/* Overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block mb-3 px-3 py-1 bg-gold-500/90 text-black text-[9px] tracking-[0.2em] uppercase font-medium">
                {getCategoryLabel(project.category)}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight">
                {project.title}
              </h1>
              <p className="mt-3 text-white/60 text-sm md:text-base max-w-xl">
                {project.short_description}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto container-padding py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">About the Project</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed">
                {project.description.split("\n\n").map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {project.materials && (
                <div className="mt-10">
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-gold-500 mb-4">Materials Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.materials.split(",").map((m: string) => (
                      <span
                        key={m}
                        className="px-3 py-1.5 border border-[var(--border)] text-xs text-[var(--text-secondary)]"
                      >
                        {m.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar details */}
            <aside>
              <div className="sticky top-28 space-y-6">
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] border-b border-[var(--border)] pb-3">
                  Project Info
                </h3>
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <Icon size={15} strokeWidth={1.5} className="text-gold-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)] mb-0.5">
                        {label}
                      </div>
                      <div className="text-sm text-[var(--text-primary)]">{value}</div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-[var(--border)]">
                  <Link
                    href="/contact"
                    className="block text-center px-6 py-3.5 bg-gold-500 text-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-400 transition-colors duration-300"
                  >
                    Inquire About This Project
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Gallery */}
        {project.gallery_images?.length > 0 && (
          <section className="pb-16 md:pb-24" aria-label="Project gallery">
            <div className="max-w-7xl mx-auto container-padding">
              <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-8">
                Project Gallery
              </h2>
              <ProjectGallery images={project.gallery_images} title={project.title} />
            </div>
          </section>
        )}

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
