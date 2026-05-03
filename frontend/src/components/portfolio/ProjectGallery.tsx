"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getImageUrl } from "@/lib/api";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides = images.map((img) => ({
    src: getImageUrl(img),
    alt: title,
  }));

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.button
            key={i}
            className={`relative overflow-hidden group cursor-pointer focus-visible:outline-2 focus-visible:outline-gold-500 ${i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"
              }`}
            onClick={() => setLightboxIndex(i)}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            viewport={{ once: true }}
            aria-label={`View image ${i + 1} of ${images.length}`}
          >
            <Image
              src={getImageUrl(img)}
              alt={`${title} — Image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-400 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs tracking-[0.15em] uppercase border border-white/60 px-3 py-1.5">
                View
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />
    </>
  );
}
