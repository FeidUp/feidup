"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { GlowingEffect } from "@/components/ui/glowing-effect";

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
    <section ref={ref} className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-950">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500 opacity-[0.07] rounded-full blur-[150px] animate-blob" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[hsl(0,83%,59%)] opacity-[0.06] rounded-full blur-[120px] animate-blob-delay" />

      <motion.div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full" style={{ y, opacity }}>
        <div className="max-w-3xl">
          {/* <FadeIn>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/10">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse-soft" />
              For Café Partners
            </span>
          </FadeIn> */}

          <FadeIn delay={0.1}>
            <h1 className="fluid-7xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6 leading-[1.05]">
              Premium Packaging,<br />
              <span className="text-gradient">Zero Cost</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-xl mb-10">
              Partner with FeidUp to get free, high-quality custom packaging that showcases
              your café&apos;s brand while supporting sustainability.
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
    desc: "The packaging looks like your café branding, not a billboard. We co-brand thoughtfully, keeping your identity as the primary focus.",
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
    desc: "Work with our design team to create packaging that perfectly represents your café's unique personality and aesthetic.",
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
    <section className="section-pad-lg bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Benefits</span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4 mb-6">
            Why Partner with FeidUp?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We provide everything you need to elevate your café&apos;s packaging without the cost.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <div className="relative rounded-[1.25rem] border-[0.75px] border-gray-200 p-2 md:rounded-[1.5rem] md:p-3 h-full">
                <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} />
                <div className="relative flex flex-col h-full rounded-xl border-[0.75px] border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] flex items-center justify-center text-white mb-6 shadow-lg shadow-red-200/30">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                    {b.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── CO-BRANDING (dark section) ─── */
function CoBrandingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="section-pad-lg bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn direction="right">
            <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Co-Branding</span>
            <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-white mt-4 mb-8">
              Your Brand Always Comes First
            </h2>
            <div className="space-y-5 text-lg text-gray-400 leading-relaxed">
              <p>
                When customers pick up a cup from your café, they should see <em className="text-white/70">your</em> branding
                first and foremost. That&apos;s our promise.
              </p>
              <div className="bg-white/[0.05] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.08]">
                <p className="text-white font-semibold font-[family-name:var(--font-fredoka)] text-lg mb-2">
                  Co-Branding, Not Takeover
                </p>
                <p className="text-gray-400">
                  Advertiser messaging is integrated subtly and tastefully — complementing your
                  design, not competing with it.
                </p>
              </div>
              <p>
                For example, an &ldquo;Ipswich Cafe × FeidUp&rdquo; cup would feature Ipswich Cafe&apos;s
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
                  <p className="text-white/60 mt-2">Ipswich Cafe × FeidUp</p>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-40 h-40 border border-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-white/10 rounded-full" />
            </motion.div>
          </FadeIn>
        </div>
      </div>

      <div className="absolute -bottom-32 left-0 w-[500px] h-[300px] bg-amber-500 opacity-[0.05] rounded-full blur-[120px]" />
    </section>
  );
}

/* ─── PROCESS ─── */
const processSteps = [
  { num: 1, title: "Apply", desc: "Fill out our simple partnership form and tell us about your café." },
  { num: 2, title: "Design Together", desc: "Collaborate with our team to create packaging that represents your brand perfectly." },
  { num: 3, title: "Approve & Produce", desc: "Review the final designs and we'll handle production and delivery." },
  { num: 4, title: "Launch", desc: "Start serving with beautiful, custom packaging that elevates your brand." },
];

function ProcessSection() {
  return (
    <section className="section-pad-lg bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Getting Started</span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4 mb-6">
            Partnership Process
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Getting started with FeidUp is simple and straightforward.
          </p>
        </FadeIn>

        <div className="relative">
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-px bg-gradient-to-r from-[hsl(0,83%,59%)]/30 via-[hsl(0,83%,59%)]/20 to-[hsl(0,83%,59%)]/30 z-0" />

          <StaggerContainer className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <StaggerItem key={step.num} className="flex">
                <div className="relative pt-8 flex-1 flex flex-col">
                  <div className="absolute top-0 left-8 md:left-1/2 md:-translate-x-1/2 w-14 h-14 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,45%)] rounded-2xl flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg shadow-red-200/40 z-10">
                    {step.num}
                  </div>
                  <div className="bg-white rounded-3xl p-8 pt-14 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-500 flex-1 min-h-[180px]">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
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
    <section className="section-pad-lg bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Who We Work With</span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4 mb-6">
            Ideal Café Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re looking for cafés that value quality and have engaged local communities.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {partners.map((p) => (
            <StaggerItem key={p.title}>
              <div className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-10 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200/30 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={p.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                  {p.title}
                </h3>
                <p className="text-gray-600 leading-relaxed lg:text-lg">{p.desc}</p>
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
    <section className="section-pad-lg bg-gray-50">
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
                Join FeidUp and get premium custom packaging at no cost to your café.
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
