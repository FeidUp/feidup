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
    <section ref={ref} className="relative min-h-[55vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--grid-color) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-[hsl(0,83%,59%)] rounded-full blur-[150px] animate-blob" style={{ opacity: "var(--glow-opacity)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500 rounded-full blur-[120px] animate-blob-delay" style={{ opacity: "calc(var(--glow-opacity) * 0.8)" }} />

      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full" style={{ y, opacity }}>
        <FadeIn delay={0.1}>
          <h1 className="fluid-7xl font-bold font-[family-name:var(--font-fredoka)] mb-6" style={{ color: "var(--text-primary)" }}>
            Let&apos;s Start a <span className="text-gradient">Conversation</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Whether you&apos;re an advertiser looking for targeted impressions or a cafe
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

  const inputStyles = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "1rem 1.25rem",
    borderRadius: "1rem",
    border: `2px solid ${focusedField === field ? "hsl(0,83%,59%)" : "var(--input-border)"}`,
    background: "var(--input-bg)",
    color: "var(--input-text)",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s",
    boxShadow: focusedField === field ? "0 10px 40px -10px rgba(220,38,38,0.15)" : "none",
  });

  return (
    <section className="section-pad-lg relative">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Sidebar */}
          <div className="lg:col-span-2">
            <FadeIn>
              <div className="sticky top-32">
                <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
                  Contact
                </span>
                <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
                  We&apos;d love to hear from you
                </h2>
                <p className="leading-relaxed mb-10 text-lg" style={{ color: "var(--text-secondary)" }}>
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
                      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                      label: "Response Time",
                      value: "Within 24 hours",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.icon.split(" M").map((d, i) => (
                            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={i === 0 ? d : "M" + d} />
                          ))}
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold font-[family-name:var(--font-fredoka)]" style={{ color: "var(--text-primary)" }}>
                          {item.label}
                        </p>
                        {item.href ? (
                          <a href={item.href} className="text-[hsl(0,83%,59%)] hover:underline">
                            {item.value}
                          </a>
                        ) : (
                          <p style={{ color: "var(--text-secondary)" }}>{item.value}</p>
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
              <div
                className="p-8 md:p-12 rounded-3xl"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2 font-[family-name:var(--font-fredoka)]" style={{ color: "var(--text-primary)" }}>
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
                      style={inputStyles("name")}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 font-[family-name:var(--font-fredoka)]" style={{ color: "var(--text-primary)" }}>
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
                      style={inputStyles("email")}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-semibold mb-2 font-[family-name:var(--font-fredoka)]" style={{ color: "var(--text-primary)" }}>
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
                      style={inputStyles("businessType")}
                    >
                      <option value="">Select one...</option>
                      <option value="advertiser">Advertiser / Brand</option>
                      <option value="venue">Venue Owner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2 font-[family-name:var(--font-fredoka)]" style={{ color: "var(--text-primary)" }}>
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
                      style={{ ...inputStyles("message"), resize: "none" as const }}
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <div>
                    <MagneticButton type="submit" disabled={status === "submitting"}>
                      <span className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] text-white shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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
                      className="p-5 rounded-2xl"
                      style={{
                        background: "var(--success-bg)",
                        border: `2px solid var(--success-border)`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="font-medium" style={{ color: "var(--success-text)" }}>
                          Thank you! We&apos;ll get back to you within 24 hours.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl"
                      style={{
                        background: "var(--error-bg)",
                        border: `2px solid var(--error-border)`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <p className="font-medium" style={{ color: "var(--error-text)" }}>
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
    title: "For Cafe Partners",
    desc: "Discover premium packaging and co-branding opportunities with a minimal fee.",
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
    <section className="section-pad-lg relative">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
            Explore
          </span>
          <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] mt-4" style={{ color: "var(--text-primary)" }}>
            Learn More About FeidUp
          </h2>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {quickLinks.map((link) => (
            <StaggerItem key={link.title}>
              <Link
                href={link.href}
                className="block p-8 rounded-3xl text-center hover:-translate-y-1 transition-all duration-500 h-full group"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-hover)";
                  e.currentTarget.style.borderColor = "var(--border-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card-bg)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] mb-3" style={{ color: "var(--text-primary)" }}>
                  {link.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{link.desc}</p>
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
