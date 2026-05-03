"use client";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SplitText } from "@/components/animations/SplitText";
import { ClickSpark } from "@/components/animations/ClickSpark";
import ScrollReveal from "@/components/animations/ScrollReveal";
import FloatingShapes from "@/components/animations/FloatingShapes";
import Magnetic from "@/components/animations/Magnetic";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { contactApi } from "@/lib/api";
import { COMPANY_INFO, SERVICES_LIST } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Metadata } from "next";

// Lazy load map to avoid SSR issues with Leaflet
const ContactMap = dynamic(() => import("@/components/contact/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-[var(--bg-subtle)] animate-pulse flex items-center justify-center text-[var(--text-muted)] text-sm">
      Loading map…
    </div>
  ),
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject required").max(255),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  service_interest: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await contactApi.submit(data);
      setSubmitted(true);
      toast("success", "Message sent! We'll be in touch shortly.");
      reset();
    } catch {
      toast("error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                <span className="section-label">Get in Touch</span>
              </div>
              <h1 className="font-serif text-display-lg text-[var(--text-primary)] mb-4">
                <SplitText text="Let's Start a Conversation" />
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                Whether you have a project in mind or just want to explore possibilities, we'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 bg-page">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Form */}
              <ScrollReveal className="lg:col-span-2">
                {submitted ? (
                  <div className="py-20 text-center border border-gold-500/30">
                    <div className="w-12 h-12 border border-gold-500 flex items-center justify-center mx-auto mb-6">
                      <span className="text-gold-500 text-xl">✓</span>
                    </div>
                    <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-3">
                      Message Received
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
                      Thank you for reaching out. We'll review your message and get back to you within 1–2 business days.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    aria-label="Contact form"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        placeholder="Elena Vasquez"
                        autoComplete="name"
                        error={errors.name?.message}
                        {...register("name")}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="hello@example.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                      />
                      <Input
                        label="Phone Number (optional)"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        autoComplete="tel"
                        error={errors.phone?.message}
                        {...register("phone")}
                      />

                      {/* Service interest */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--text-secondary)]">
                          Service Interest (optional)
                        </label>
                        <select
                          className="w-full px-4 py-3 text-sm bg-transparent border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-gold-500 transition-colors duration-200"
                          {...register("service_interest")}
                        >
                          <option value="">Select a service…</option>
                          {SERVICES_LIST.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Input
                        label="Subject"
                        placeholder="Brief description of your project"
                        error={errors.subject?.message}
                        {...register("subject")}
                      />
                    </div>

                    <div className="mt-6">
                      <Textarea
                        label="Your Message"
                        placeholder="Tell us about your project — location, size, timeline, budget, and anything else that's relevant…"
                        rows={6}
                        error={errors.message?.message}
                        {...register("message")}
                      />
                    </div>

                    <div className="mt-8">
                      <Magnetic strength={0.12}>
                        <ClickSpark>
                          <Button
                            type="submit"
                            loading={submitting}
                            size="lg"
                            className="w-full sm:w-auto"
                          >
                            Send Message
                          </Button>
                        </ClickSpark>
                      </Magnetic>
                      <p className="mt-3 text-xs text-[var(--text-muted)]">
                        We typically respond within 1–2 business days.
                      </p>
                    </div>
                  </form>
                )}
              </ScrollReveal>

              {/* Info sidebar */}
              <ScrollReveal direction="right" delay={0.2}>
              <aside>
                <div className="space-y-8">
                  {[
                    { icon: MapPin, label: "Address", value: COMPANY_INFO.address, href: undefined },
                    { icon: Phone, label: "Phone", value: COMPANY_INFO.phones.join(" | "), href: `tel:${COMPANY_INFO.phones[0]}` },
                    { icon: Mail, label: "Email", value: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
                    { icon: Clock, label: "Hours", value: "Mon – Sat, 9am – 6pm IST", href: undefined },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-9 h-9 border border-[var(--border)] flex items-center justify-center shrink-0">
                        <Icon size={15} strokeWidth={1.5} className="text-gold-500" />
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)] mb-1">{label}</div>
                        {href ? (
                          <a href={href} className="text-sm text-[var(--text-primary)] hover:text-gold-500 transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm text-[var(--text-primary)]">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Map */}
        <section aria-label="Office location map">
          <ContactMap lat={COMPANY_INFO.lat} lng={COMPANY_INFO.lng} />
        </section>
      </main>
      <Footer />
    </>
  );
}
