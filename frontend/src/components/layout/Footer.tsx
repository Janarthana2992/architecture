import Link from "next/link";
import { Instagram, Linkedin, PinIcon, ArrowRight } from "lucide-react";
import { NAV_LINKS, COMPANY_INFO, SERVICES } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#0A0A0A] text-white/70 border-t border-white/[0.06]"
      role="contentinfo"
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto container-padding py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-xl tracking-[0.05em]">
              <span className="text-[#C9A96E]">ETHOS</span>
              <span className="ml-1.5 text-white/40 font-light">HABITATS</span>
            </Link>
            <p className="mt-1 text-[9px] tracking-[0.25em] uppercase text-[#C9A96E]/50">
              Socially Responsible Architecture
            </p>
            <p className="mt-5 text-sm text-white/35 leading-relaxed font-light">
              Crafting sustainable, innovative, and human-centered spaces that leave a lasting impression.
            </p>

            <div className="flex gap-2.5 mt-7">
              {[
                { icon: Instagram, href: COMPANY_INFO.social.instagram, label: "Instagram" },
                { icon: Linkedin, href: COMPANY_INFO.social.linkedin, label: "LinkedIn" },
                { icon: PinIcon, href: COMPANY_INFO.social.pinterest, label: "Pinterest" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/30 hover:border-[#C9A96E]/50 hover:text-[#C9A96E] transition-all duration-500"
                >
                  <Icon size={14} strokeWidth={1.2} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-[#C9A96E] mb-6 font-normal">
              Navigation
            </h3>
            <ul className="space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-white/70 transition-colors duration-500 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-[#C9A96E] mb-6 font-normal">
              Services
            </h3>
            <ul className="space-y-3.5">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.title}>
                  <Link
                    href="/services"
                    className="text-sm text-white/35 hover:text-white/70 transition-colors duration-500 font-light"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-[#C9A96E] mb-6 font-normal">
              Contact
            </h3>
            <address className="not-italic space-y-3.5 text-sm text-white/35 font-light">
              <p className="leading-relaxed">{COMPANY_INFO.address}</p>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="block hover:text-white/70 transition-colors duration-500"
              >
                {COMPANY_INFO.phone}
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="block hover:text-white/70 transition-colors duration-500"
              >
                {COMPANY_INFO.email}
              </a>
            </address>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#C9A96E] hover:gap-3 transition-all duration-500 group"
            >
              Start a Project <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto container-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/20 font-light">
          <p>&copy; {year} Ethos Habitats. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/40 transition-colors duration-500">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/40 transition-colors duration-500">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
