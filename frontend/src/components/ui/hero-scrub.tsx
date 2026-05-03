"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroScrubProps {
  frameCount?: number;
  frameUrl?: (index: number) => string;
}

export default function HeroScrub({
  frameCount = 120,
  frameUrl = (i) => `/frames/${String(i + 1).padStart(4, "0")}.webp`,
}: HeroScrubProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ value: 0 });
  const [loaded, setLoaded] = useState(false);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const idx = Math.round(frameIndexRef.current.value);
    const img = imagesRef.current[idx];
    if (!img) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Cover-fit the image
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, w, h);
  }, []);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameCount) setLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, [frameCount, frameUrl]);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    render();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    tl.to(frameIndexRef.current, {
      value: frameCount - 1,
      ease: "none",
      onUpdate: render,
    });

    // Animate text elements
    gsap.fromTo(
      ".hero-title-top",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ".hero-title-bottom",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "5% top",
          end: "25% top",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ".hero-subtitle",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "15% top",
          end: "35% top",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ".hero-cta",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "25% top",
          end: "40% top",
          scrub: true,
        },
      }
    );

    // Scale canvas slightly on scroll
    gsap.fromTo(
      canvasRef.current,
      { scale: 1.05 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "50% top",
          scrub: true,
        },
      }
    );

    const handleResize = () => render();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaded, frameCount, render]);

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "transform" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-center pointer-events-auto px-5">
            {/* Label */}
            <p className="hero-subtitle section-label mb-8 opacity-0">
              Socially Responsible Architecture
            </p>

            {/* Title */}
            <h1 className="text-hero font-serif text-white">
              <span className="hero-title-top block opacity-0">Form</span>
              <span className="hero-title-bottom block text-gold-400 opacity-0">
                Space
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle mt-8 text-white/50 text-body-lg max-w-lg mx-auto opacity-0">
              We craft spaces that are practical, sustainable, and deeply
              human&mdash;architecture with purpose and conscience.
            </p>

            {/* CTA */}
            <div className="hero-cta mt-12 flex gap-4 justify-center opacity-0">
              <a
                href="/portfolio"
                className="btn-primary"
              >
                View Portfolio
              </a>
              <a
                href="/contact"
                className="btn-outline border-white/30 text-white hover:border-white hover:text-white"
              >
                Start a Project
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">
              Scroll
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
              <div
                className="absolute top-0 w-full h-1/2 bg-gold-400"
                style={{ animation: "scrollPulse 2s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>

        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center z-20">
            <div className="text-center">
              <div className="w-8 h-8 border border-gold-400/40 border-t-gold-400 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-white/30">
                Loading
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
}
