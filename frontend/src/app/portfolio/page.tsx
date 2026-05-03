"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { projectsApi, categoriesApi, getImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SplitText } from "@/components/animations/SplitText";
import { GlareHover } from "@/components/animations/GlareHover";
import CurtainReveal from "@/components/animations/CurtainReveal";
import FloatingShapes from "@/components/animations/FloatingShapes";

const PAGE_SIZE = 9;

export default function PortfolioPage() {
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["projects", category, page],
    queryFn: () =>
      projectsApi.list({
        page,
        page_size: PAGE_SIZE,
        category: category === "all" ? undefined : category,
      }),
    placeholderData: (prev) => prev,
  });

  const { data: apiCategories = [] } = useQuery({
    queryKey: ["categories", "project"],
    queryFn: () => categoriesApi.list("project"),
  });

  const filterTabs = [
    { value: "all", label: "All Projects" },
    ...apiCategories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const projects = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-16 md:pt-44 md:pb-20 bg-page overflow-hidden">
          <FloatingShapes variant="minimal" />
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-line" />
                <span className="section-label">Our Portfolio</span>
              </div>
              <h1 className="font-serif text-display-lg text-[var(--text-primary)] mb-4">
                <SplitText text="Built Works" />
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                A curated selection of our most significant projects — each one a story of collaboration, craft, and vision realized.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="sticky top-18 z-30 bg-[var(--bg-alt)]/90 backdrop-blur-md border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto container-padding">
            <div
              className="flex gap-1 overflow-x-auto py-4 scrollbar-none"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {filterTabs.map((cat) => (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={category === cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={cn(
                    "shrink-0 px-5 py-2 text-xs tracking-[0.12em] uppercase font-medium transition-all duration-200",
                    category === cat.value
                      ? "bg-gold-500 text-black"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <section className="py-16 bg-page">
          <div className="max-w-7xl mx-auto container-padding">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[var(--bg-alt)] animate-pulse">
                    <div className="h-72 bg-[var(--border)]" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-[var(--border)] w-2/3" />
                      <div className="h-3 bg-[var(--border)] w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 text-[var(--text-muted)]">
                <p className="font-serif text-2xl mb-2">No projects found</p>
                <p className="text-sm">Try a different category.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]"
                animate={{ opacity: isFetching ? 0.5 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {projects.map((project, i) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <GlareHover className="h-full group">
                      <Link href={`/portfolio/${project.slug}`} className="block h-full bg-[var(--bg-alt)]">
                        <CurtainReveal direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.05} className="relative h-72 overflow-hidden">
                          <Image
                            src={getImageUrl(project.cover_image)}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="lazy"
                          />
                          <div className="img-overlay" />
                          <div className="absolute top-4 left-4">
                            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-[9px] tracking-[0.2em] uppercase text-gold-400">
                              {getCategoryLabel(project.category)}
                            </span>
                          </div>
                        </CurtainReveal>
                        <div className="p-5">
                          <h2 className="font-serif text-lg text-[var(--text-primary)] group-hover:text-gold-500 transition-colors duration-300">
                            {project.title}
                          </h2>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
                            <span>{project.location}</span>
                            <span>·</span>
                            <span>{project.year}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase text-gold-500 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            View Project <ArrowRight size={11} />
                          </div>
                        </div>
                      </Link>
                    </GlareHover>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                ref={ref}
                className="flex items-center justify-center gap-3 mt-16"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 text-xs tracking-[0.12em] uppercase border border-[var(--border)] text-[var(--text-secondary)] hover:border-gold-500 hover:text-gold-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                <span className="text-xs text-[var(--text-muted)]">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 text-xs tracking-[0.12em] uppercase border border-[var(--border)] text-[var(--text-secondary)] hover:border-gold-500 hover:text-gold-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
