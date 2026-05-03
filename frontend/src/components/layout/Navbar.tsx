"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <motion.header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled || !isHome
            ? "bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-transparent"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className={cn(
                "font-serif text-xl tracking-[0.05em] transition-colors duration-500",
                transparent ? "text-white" : "text-[var(--text-primary)]"
              )}
              aria-label="Ethos Habitats — Home"
            >
              <span className="text-gold-500">ETHOS</span>
              <span className="ml-1.5 font-light opacity-60">HABITATS</span>
            </Link>

            {/* Desktop Nav */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative text-[11px] tracking-[0.2em] uppercase font-light transition-colors duration-500 group py-2",
                      transparent
                        ? active ? "text-gold-400" : "text-white/70 hover:text-white"
                        : active ? "text-gold-500" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px transition-all duration-500",
                        active
                          ? "w-full bg-gold-500"
                          : "w-0 group-hover:w-full bg-gold-500/50"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "p-2 transition-all duration-500",
                    transparent
                      ? "text-white/60 hover:text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={16} strokeWidth={1.2} /> : <Moon size={16} strokeWidth={1.2} />}
                </button>
              )}

              <Link
                href="/contact"
                className={cn(
                  "hidden md:inline-flex items-center px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-light border transition-all duration-500",
                  transparent
                    ? "border-white/25 text-white/80 hover:bg-white hover:text-black"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-gold-500 hover:text-gold-500"
                )}
              >
                Get in Touch
              </Link>

              <button
                onClick={() => setMobileOpen((o) => !o)}
                className={cn(
                  "md:hidden p-2 transition-colors duration-500",
                  transparent ? "text-white" : "text-[var(--text-primary)]"
                )}
                aria-expanded={mobileOpen}
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X size={20} strokeWidth={1.2} /> : <Menu size={20} strokeWidth={1.2} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.nav
              className="absolute top-0 right-0 bottom-0 w-72 bg-[var(--bg)] border-l border-[var(--border)] flex flex-col pt-24 pb-12 px-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block py-3.5 text-[11px] tracking-[0.2em] uppercase font-light border-b border-[var(--border)] transition-colors duration-300",
                        pathname === link.href
                          ? "text-gold-500"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto">
                <Link
                  href="/contact"
                  className="block text-center px-6 py-3.5 text-[10px] tracking-[0.2em] uppercase font-light bg-gold-500 text-black hover:bg-gold-600 transition-colors duration-300"
                >
                  Get in Touch
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
