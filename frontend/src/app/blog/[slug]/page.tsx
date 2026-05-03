import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogsApi, getImageUrl } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowLeft, User } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

async function getBlog(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: "Article Not Found" };

  return {
    title: blog.meta_title ?? blog.title,
    description: blog.meta_description ?? blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.created_at,
      authors: [blog.author],
      images: [{ url: getImageUrl(blog.cover_image) }],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    author: { "@type": "Person", name: blog.author },
    publisher: {
      "@type": "Organization",
      name: "Ethos Habitats",
      logo: { "@type": "ImageObject", url: "/images/logo.png" },
    },
    datePublished: blog.created_at,
    dateModified: blog.updated_at,
    image: getImageUrl(blog.cover_image),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}` },
  };

  return (
    <>
      <Navbar />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Cover image */}
        <div className="relative h-[50vh] md:h-[60vh] mt-18 md:mt-20 overflow-hidden">
          <Image
            src={getImageUrl(blog.cover_image)}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/20 to-transparent" />
        </div>

        {/* Article */}
        <div className="max-w-3xl mx-auto container-padding py-12 md:py-16">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-[var(--text-muted)] hover:text-gold-500 transition-colors duration-200 mb-10"
          >
            <ArrowLeft size={13} /> All Articles
          </Link>

          {/* Category */}
          <span className="inline-block mb-4 px-3 py-1 bg-gold-500/10 text-gold-500 text-[9px] tracking-[0.2em] uppercase font-medium">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--text-primary)] leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 pb-8 mb-8 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <User size={13} /> {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={13} /> {blog.read_time} min read
            </span>
            <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-serif prose-headings:text-[var(--text-primary)]
              prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
              prose-a:text-gold-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[var(--text-primary)]
              prose-blockquote:border-gold-500 prose-blockquote:text-[var(--text-secondary)]
              prose-img:rounded-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags && (
            <div className="mt-12 pt-8 border-t border-[var(--border)]">
              <span className="text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] mr-3">Tags:</span>
              {blog.tags.split(",").map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block mr-2 mb-2 px-3 py-1 border border-[var(--border)] text-xs text-[var(--text-secondary)]"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
