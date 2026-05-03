"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blogsApi, getImageUrl } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export function BlogPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const { data, isLoading } = useQuery({
    queryKey: ["blogs-preview"],
    queryFn: () => blogsApi.list({ page: 1, page_size: 3 }),
  });

  const blogs = data?.items ?? [];

  if (!isLoading && blogs.length === 0) return null;

  return (
    <section
      ref={ref}
      className="section-padding bg-page"
      aria-labelledby="blog-preview-heading"
    >
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="gold-line" />
              <span className="section-label">Insights</span>
            </motion.div>
            <motion.h2
              id="blog-preview-heading"
              className="text-section font-serif text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Latest from our blog
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-gold-500 transition-colors duration-500 group"
            >
              All Articles
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)]">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[var(--bg)] animate-pulse">
                <div className="h-56 bg-[var(--border)]" />
                <div className="p-8 space-y-3">
                  <div className="h-4 bg-[var(--border)] w-3/4" />
                  <div className="h-3 bg-[var(--border)] w-1/2" />
                </div>
              </div>
            ))
            : blogs.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[var(--bg)] group"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={getImageUrl(blog.cover_image)}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4 text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)] font-light">
                      <span className="text-[var(--accent)]">{blog.category}</span>
                      <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[var(--border)]" />
                      <span className="flex items-center gap-1">
                        <Clock size={10} aria-hidden="true" />
                        {blog.read_time} min
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-500 line-clamp-2" style={{ fontWeight: 400, letterSpacing: "-0.01em" }}>
                      {blog.title}
                    </h3>

                    <p className="mt-3 text-sm text-[var(--text-secondary)] line-clamp-2 font-light leading-relaxed">
                      {blog.excerpt}
                    </p>

                    <div className="mt-5 text-[10px] tracking-[0.1em] text-[var(--text-muted)] font-light">
                      {formatDate(blog.created_at)}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
        </div>
      </div>
    </section>
  );
}
