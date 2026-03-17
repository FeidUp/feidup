"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  FloatingCup,
} from "@/components/animations";
import { MagneticButton } from "@/components/animations/MagneticButton";

/* ─── HERO ─── */
function BusinessesHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--grid-color) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[150px] animate-blob" style={{ opacity: "var(--glow-opacity)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[hsl(0,83%,59%)] rounded-full blur-[120px] animate-blob-delay" style={{ opacity: "var(--glow-opacity)" }} />

      <motion.div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full" style={{ y, opacity }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
              <h1 className="fluid-7xl font-bold font-[family-name:var(--font-fredoka)] mb-6 leading-[1.05]" style={{ color: "var(--text-primary)" }}>
                Premium Packaging,<br />
                <span className="text-gradient">Zero Cost</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl leading-relaxed max-w-xl mb-10" style={{ color: "var(--text-secondary)" }}>
                Partner with FeidUp to get free, high-quality custom packaging that showcases
                your cafe&apos;s brand while supporting sustainability.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <MagneticButton href="/contact">
                <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-[hsl(0,83%,59%)] text-white shadow-xl shadow-red-500/20 hover:shadow-2xl transition-all duration-300 hover:brightness-110">
                  Become a Partner
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </MagneticButton>
            </FadeIn>
          </div>

          <FadeIn direction="right" delay={0.2} className="hidden lg:block">
            <FloatingCup src="/images/cup-white.jpg" alt="Co-branded café packaging by FeidUp" />
          </FadeIn>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── BENEFITS ─── */
const benefits = [
  {
    title: "No Cost to You",
    desc: "Premium custom packaging is 100% funded by advertiser partnerships. Upgrade your packaging quality without impacting your budget.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Your Brand Front & Center",
    desc: "The packaging looks like your cafe branding, not a billboard. We co-brand thoughtfully, keeping your identity as the primary focus.",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    title: "Premium Quality",
    desc: "Higher-grade materials, better designs, and professional printing. Packaging that makes your customers feel special.",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
  {
    title: "Sustainable Materials",
    desc: "Eco-friendly, durable packaging that aligns with modern customer values and reduces environmental impact.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Custom Design",
    desc: "Work with our design team to create packaging that perfectly represents your cafe's unique personality and aesthetic.",
    icon: "M4 5a1 1 0 011-1h4a1 1 0 010 2H6v2a1 1 0 01-2 0V5zM4 13a1 1 0 011 1v2h2a1 1 0 110 2H5a1 1 0 01-1-1v-3a1 1 0 011-1zm16 0a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 110-2h2v-2a1 1 0 011-1zM15 4a1 1 0 100 2h2v2a1 1 0 102 0V5a1 1 0 00-1-1h-3z",
  },
  {
    title: "Simple Partnership",
    desc: "No complicated contracts or hidden fees. Just great packaging and a partnership that works for your business.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

function BenefitsSection() {
  return (
    <section className="section-pad-lg relative">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Benefits</span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
            Why Partner with FeidUp?
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            We provide everything you need to elevate your cafe&apos;s packaging without the cost.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <div
                className="group rounded-3xl p-8 h-full transition-all duration-700"
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] flex items-center justify-center text-white mb-6 shadow-lg shadow-red-500/20">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] mb-3" style={{ color: "var(--text-primary)" }}>
                  {b.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── CO-BRANDING ─── */
function CoBrandingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="section-pad-lg relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--grid-color) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn direction="right">
            <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Co-Branding</span>
            <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] mt-4 mb-8" style={{ color: "var(--text-primary)" }}>
              Your Brand Always Comes First
            </h2>
            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                When customers pick up a cup from your cafe, they should see <em style={{ color: "var(--text-primary)", opacity: 0.8 }}>your</em> branding
                first and foremost. That&apos;s our promise.
              </p>
              <div className="backdrop-blur-sm rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <p className="font-semibold font-[family-name:var(--font-fredoka)] text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                  Co-Branding, Not Takeover
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  Advertiser messaging is integrated subtly and tastefully — complementing your
                  design, not competing with it.
                </p>
              </div>
              <p>
                For example, an &ldquo;Ipswich Cafe x FeidUp&rdquo; cup would feature Ipswich Cafe&apos;s
                branding prominently, with advertiser elements integrated thoughtfully.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <motion.div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl"
              style={{ y: imgY }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-xl font-[family-name:var(--font-fredoka)]">Co-Branded Cup</p>
                  <p className="text-white/60 mt-2">Ipswich Cafe x FeidUp</p>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-40 h-40 border border-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-white/10 rounded-full" />
            </motion.div>
          </FadeIn>
        </div>
      </div>

      <div className="absolute -bottom-32 left-0 w-[500px] h-[300px] bg-amber-500 rounded-full blur-[120px]" style={{ opacity: "calc(var(--glow-opacity) * 0.8)" }} />
    </section>
  );
}

/* ─── PROCESS ─── */
const processSteps = [
  { num: 1, title: "Apply", desc: "Fill out our simple partnership form and tell us about your cafe." },
  { num: 2, title: "Design Together", desc: "Collaborate with our team to create packaging that represents your brand perfectly." },
  { num: 3, title: "Approve & Produce", desc: "Review the final designs and we'll handle production and delivery." },
  { num: 4, title: "Launch", desc: "Start serving with beautiful, custom packaging that elevates your brand." },
];

function ProcessSection() {
  return (
    <section className="section-pad-lg relative">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Getting Started</span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
            Partnership Process
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Getting started with FeidUp is simple and straightforward.
          </p>
        </FadeIn>

        <div className="relative">
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-px bg-gradient-to-r from-[hsl(0,83%,59%)]/30 via-[hsl(0,83%,59%)]/20 to-[hsl(0,83%,59%)]/30 z-0" />

          <StaggerContainer className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <StaggerItem key={step.num} className="flex">
                <div className="relative pt-8 flex-1 flex flex-col">
                  <div className="absolute top-0 left-8 md:left-1/2 md:-translate-x-1/2 w-14 h-14 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,45%)] rounded-2xl flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg shadow-red-500/20 z-10">
                    {step.num}
                  </div>
                  <div
                    className="rounded-3xl p-8 pt-14 transition-all duration-500 flex-1 min-h-[180px]"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] mb-3" style={{ color: "var(--text-primary)" }}>
                      {step.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

/* ─── IDEAL PARTNERS ─── */
const partners = [
  {
    title: "Urban Locations",
    desc: "High foot traffic in cities or busy neighborhoods",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    title: "Engaged Community",
    desc: "Loyal customer base and active social presence",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Quality-Focused",
    desc: "Values presentation, design, and premium customer experience",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

function IdealPartnersSection() {
  return (
    <section className="section-pad-lg relative">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Who We Work With</span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
            Ideal Cafe Partners
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            We&apos;re looking for cafes that value quality and have engaged local communities.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {partners.map((p) => (
            <StaggerItem key={p.title}>
              <div
                className="group rounded-3xl p-10 text-center h-full transition-all duration-500 hover:-translate-y-1"
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
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={p.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] mb-3" style={{ color: "var(--text-primary)" }}>
                  {p.title}
                </h3>
                <p className="leading-relaxed lg:text-lg" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function BusinessesCTA() {
  return (
    <section className="section-pad-lg relative">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <FadeIn>
          <div className="relative bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,45%)] rounded-[2.5rem] px-8 py-20 md:px-16 md:py-24 text-center overflow-hidden">
            <div className="absolute inset-0 rounded-[2.5rem] shimmer" />
            <div className="absolute -top-16 -right-16 w-64 h-64 border border-white/10 rounded-full animate-rotate-slow" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/10 rounded-full" />

            <div className="relative z-10">
              <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
                Ready to Upgrade Your Packaging?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join FeidUp and get premium custom packaging at no cost to your cafe.
              </p>
              <MagneticButton href="/contact">
                <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-white text-[hsl(0,83%,59%)] shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50">
                  Partner with Us Today
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── EXPORT ─── */
export function BusinessesSections() {
  return (
    <>
      <BusinessesHero />
      <BenefitsSection />
      <CoBrandingSection />
      <ProcessSection />
      <IdealPartnersSection />
      <BusinessesCTA />
    </>
  );
}
