"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { testimonialsApi, getImageUrl } from "@/lib/api";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialsApi.list,
  });

  if (isLoading || testimonials.length === 0) return null;

  return (
    <section
      ref={ref}
      className="section-padding bg-subtle overflow-hidden"
      aria-labelledby="testimonials-heading"
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
              <span className="section-label">Client Stories</span>
            </motion.div>
            <motion.h2
              id="testimonials-heading"
              className="text-section font-serif text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              What our clients say
            </motion.h2>
          </div>

          {/* Nav arrows */}
          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="w-10 h-10 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-500"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} strokeWidth={1.2} />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-500"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} strokeWidth={1.2} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <article className="bg-[var(--bg)] border border-[var(--border)] p-8 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < t.rating ? "var(--accent)" : "transparent"}
                        className={i < t.rating ? "text-[var(--accent)]" : "text-[var(--border)]"}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="flex-1">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </blockquote>

                  {/* Client */}
                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--border)]">
                    {t.client_photo ? (
                      <Image
                        src={getImageUrl(t.client_photo)}
                        alt={t.client_name}
                        width={36}
                        height={36}
                        className="rounded-full object-cover w-9 h-9"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                        <span className="font-serif text-sm text-[var(--accent)]">
                          {t.client_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-[var(--text-primary)]" style={{ fontWeight: 400 }}>
                        {t.client_name}
                      </div>
                      {t.client_title && (
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-light">
                          {t.client_title}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
