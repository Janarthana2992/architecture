"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogsApi, getImageUrl } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { SplitText } from "@/components/animations/SplitText";

const PAGE_SIZE = 9;

const BLOG_CATEGORIES = [
  "All",
  "Architecture",
  "Interior Design",
  "Sustainability",
  "Urban Design",
  "Materials",
  "Industry News",
];

export default function BlogPage() {
  const [category, setCategory] = useState<string>("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["blogs", category, page],
    queryFn: () =>
      blogsApi.list({
        page,
        page_size: PAGE_SIZE,
        category: category === "All" ? undefined : category,
      }),
    placeholderData: (prev) => prev,
  });

  const blogs = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-44 md:pb-20 bg-page">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-line" />
                <span className="section-label">Insights</span>
              </div>
              <h1 className="font-serif text-display-lg text-[var(--text-primary)] mb-4">
                <SplitText text="Architecture Insights" />
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                Thinking on design, craft, sustainability, and the built environment — from our studio to you.
              </p>
            </div>
          </div>
        </section>

        {/* Category filter */}
        <div className="sticky top-18 z-30 bg-[var(--bg-alt)]/90 backdrop-blur-md border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="flex gap-1 overflow-x-auto py-4">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={cn(
                    "shrink-0 px-5 py-2 text-xs tracking-[0.12em] uppercase font-medium transition-all duration-200",
                    category === cat
                      ? "bg-gold-500 text-black"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles */}
        <section className="py-16 bg-page">
          <div className="max-w-7xl mx-auto container-padding">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[var(--bg-alt)] animate-pulse">
                    <div className="h-56 bg-[var(--border)]" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-[var(--border)] w-3/4" />
                      <div className="h-3 bg-[var(--border)] w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20 text-[var(--text-muted)]">
                <p className="font-serif text-2xl mb-2">No articles found</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]"
                animate={{ opacity: isFetching ? 0.5 : 1 }}
              >
                {blogs.map((blog, i) => (
                  <motion.article
                    key={blog.id}
                    className="bg-[var(--bg-alt)] group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={getImageUrl(blog.cover_image)}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                        <div className="img-overlay opacity-30" />
                        <div className="absolute top-4 left-4">
                          <span className="px-2.5 py-1 bg-gold-500/90 text-black text-[9px] tracking-[0.2em] uppercase font-medium">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3 text-xs text-[var(--text-muted)]">
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {blog.read_time} min read
                          </span>
                          <span>·</span>
                          <span>{formatDate(blog.created_at)}</span>
                        </div>
                        <h2 className="font-serif text-lg text-[var(--text-primary)] group-hover:text-gold-500 transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">{blog.excerpt}</p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase text-gold-500 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          Read Article <ArrowRight size={11} />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-16">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 text-xs tracking-[0.12em] uppercase border border-[var(--border)] text-[var(--text-secondary)] hover:border-gold-500 hover:text-gold-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-xs text-[var(--text-muted)]">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 text-xs tracking-[0.12em] uppercase border border-[var(--border)] text-[var(--text-secondary)] hover:border-gold-500 hover:text-gold-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
