"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { MagneticButton } from "@/components/animations/MagneticButton";

/* ─── HERO ─── */
function ContactHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[55vh] flex items-center overflow-hidden bg-gray-950">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-[hsl(0,83%,59%)] opacity-[0.08] rounded-full blur-[150px] animate-blob" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500 opacity-[0.05] rounded-full blur-[120px] animate-blob-delay" />

      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full" style={{ y, opacity }}>
        <FadeIn>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/10">
            <span className="w-2 h-2 bg-[hsl(0,83%,59%)] rounded-full animate-pulse-soft" />
            Get in Touch
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="fluid-7xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
            Let&apos;s Start a <span className="text-gradient">Conversation</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Whether you&apos;re an advertiser looking for targeted impressions or a café
            seeking premium packaging, we&apos;d love to hear from you.
          </p>
        </FadeIn>
      </motion.div>
    </section>
  );
}

/* ─── CONTACT FORM ─── */
function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", businessType: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputBase =
    "w-full px-5 py-4 rounded-2xl border-2 bg-white focus:ring-0 outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 text-base";
  const inputFocus = "border-[hsl(0,83%,59%)] shadow-lg shadow-red-100/50";
  const inputIdle = "border-gray-200 hover:border-gray-300";

  return (
    <section className="section-pad-lg bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Sidebar */}
          <div className="lg:col-span-2">
            <FadeIn>
              <div className="sticky top-32">
                <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
                  Contact
                </span>
                <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4 mb-6">
                  We&apos;d love to hear from you
                </h2>
                <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                      label: "Email",
                      value: "info@feidup.com",
                      href: "mailto:info@feidup.com",
                    },
                    {
                      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                      label: "Location",
                      value: "United Kingdom",
                    },
                    {
                      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                      label: "Response Time",
                      value: "Within 24 hours",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200/30 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.icon.split(" M").map((d, i) => (
                            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={i === 0 ? d : "M" + d} />
                          ))}
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-[family-name:var(--font-fredoka)]">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a href={item.href} className="text-[hsl(0,83%,59%)] hover:underline">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <FadeIn delay={0.2}>
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2 font-[family-name:var(--font-fredoka)]">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputBase} ${focusedField === "name" ? inputFocus : inputIdle}`}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2 font-[family-name:var(--font-fredoka)]">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputBase} ${focusedField === "email" ? inputFocus : inputIdle}`}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-semibold text-gray-900 mb-2 font-[family-name:var(--font-fredoka)]">
                      I am an... *
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      value={formData.businessType}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("businessType")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputBase} ${focusedField === "businessType" ? inputFocus : inputIdle}`}
                    >
                      <option value="">Select one...</option>
                      <option value="advertiser">Advertiser / Brand</option>
                      <option value="cafe">Café / Business Owner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2 font-[family-name:var(--font-fredoka)]">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputBase} resize-none ${focusedField === "message" ? inputFocus : inputIdle}`}
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <div>
                    <MagneticButton type="submit" disabled={status === "submitting"}>
                      <span className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] text-white shadow-lg hover:shadow-xl hover:shadow-red-200/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {status === "submitting" ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </span>
                    </MagneticButton>
                  </div>

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-green-50 border-2 border-green-200 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-green-800 font-medium">
                          Thank you! We&apos;ll get back to you within 24 hours.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <p className="text-red-800 font-medium">
                          Something went wrong. Please try again or email us at{" "}
                          <a href="mailto:info@feidup.com" className="underline">info@feidup.com</a>.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── QUICK LINKS ─── */
const quickLinks = [
  {
    title: "For Advertisers",
    desc: "Learn about targeted real-world impressions and campaign planning.",
    href: "/advertisers",
    icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
  },
  {
    title: "For Café Partners",
    desc: "Discover free premium packaging and co-branding opportunities.",
    href: "/businesses",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    title: "About FeidUp",
    desc: "Read about our vision, values, and approach to co-branding.",
    href: "/about",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

function QuickLinksSection() {
  return (
    <section className="section-pad-lg bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
            Explore
          </span>
          <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4">
            Learn More About FeidUp
          </h2>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {quickLinks.map((link) => (
            <StaggerItem key={link.title}>
              <Link
                href={link.href}
                className="block bg-white p-8 rounded-3xl shadow-sm border border-gray-200 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                  {link.title}
                </h3>
                <p className="text-gray-600 mb-5 text-sm leading-relaxed">{link.desc}</p>
                <span className="text-[hsl(0,83%,59%)] font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300 text-sm">
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── EXPORT ─── */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <QuickLinksSection />
    </>
  );
}
