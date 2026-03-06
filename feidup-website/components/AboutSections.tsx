"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { GlowingEffect } from "@/components/ui/glowing-effect";

/* ─── HERO ─── */
function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[hsl(0,83%,59%)] opacity-[0.08] rounded-full blur-[150px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[hsl(30,90%,55%)] opacity-[0.06] rounded-full blur-[120px] animate-blob-delay" />

      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ y, opacity }}>
        {/* <FadeIn>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/10">
            <span className="w-2 h-2 bg-[hsl(0,83%,59%)] rounded-full animate-pulse-soft" />
            Our Story
          </span>
        </FadeIn> */}

        <FadeIn delay={0.1}>
          <h1 className="fluid-7xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
            About <span className="text-gradient">FeidUp</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We&apos;re transforming the way brands connect with audiences by turning everyday
            packaging into powerful, sustainable marketing.
          </p>
        </FadeIn>

        {/* Scroll indicator */}
        <FadeIn delay={0.5}>
          <motion.div
            className="mt-16 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll to explore</span>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </FadeIn>
      </motion.div>
    </section>
  );
}

/* ─── VISION — SPLIT SCREEN ─── */
function VisionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="section-pad-lg bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn direction="right" className="order-2 lg:order-1">
            <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
              The Vision
            </span>
            <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4 mb-8">
              Connecting communities
              <br />
              through great design.
            </h2>
            <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
              <p>
                FeidUp envisions a future where cafés, customers, and advertisers are seamlessly
                connected through sustainable, beautifully designed branded packaging.
              </p>
              <p>
                We believe in creating value for everyone: cafés get premium packaging
                at no cost, advertisers gain authentic real-world impressions, and customers
                enjoy better-designed, more sustainable products.
              </p>
              <p>
                Our platform is built on the principle that marketing can be both effective
                and beneficial to local communities.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2} className="order-1 lg:order-2">
            <motion.div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[hsl(0,83%,55%)] to-[hsl(0,83%,45%)] shadow-2xl"
              style={{ y: imgY }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-xl font-[family-name:var(--font-fredoka)]">Our Vision</p>
                  <p className="text-white/70 mt-2">Premium packaging for every café</p>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-40 h-40 border border-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-white/10 rounded-full" />
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── STARTING LOCAL ─── */
function StartingLocalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="section-pad-lg bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn direction="right">
            <motion.div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl"
              style={{ y: imgY }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-xl font-[family-name:var(--font-fredoka)]">Co-Branded Packaging</p>
                  <p className="text-white/70 mt-2">Ipswich Café × FeidUp</p>
                </div>
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
              Our Focus
            </span>
            <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4 mb-8">
              Starting Local,
              <br />
              Thinking Global.
            </h2>
            <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
              <p>
                We&apos;re launching with targeted pilots at select local cafés, beginning with
                custom co-branded cups that feature both the café&apos;s identity and advertiser
                messaging.
              </p>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-900 font-semibold font-[family-name:var(--font-fredoka)] text-lg mb-2">
                  Co-Branding, Not Takeover
                </p>
                <p className="text-gray-600">
                  Our packaging is designed café-first. When you see a FeidUp cup at Ipswich Cafe,
                  it looks like their branding with subtle advertiser integration.
                </p>
              </div>
              <p>
                This ensures cafés maintain brand integrity while gaining access
                to premium materials they might not otherwise afford.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── CO-BRANDING MATTERS ─── */
const approaches = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Café Identity First",
    desc: "The café's branding stays front and center. Our packaging looks like it belongs to the café, not like a walking billboard.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
    title: "Subtle Integration",
    desc: "Advertiser messaging is integrated tastefully, complementing the design rather than dominating it. Quality over intrusion.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Premium Quality",
    desc: "Higher-quality materials, better design, and sustainable production make this packaging something cafés are proud to use.",
  },
];

function CoBrandingSection() {
  return (
    <section className="section-pad-lg bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
            Our Approach
          </span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4 mb-6">
            Why Co-Branding Matters
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We believe packaging should enhance the café experience, not distract from it.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {approaches.map((item) => (
            <StaggerItem key={item.title}>
              <div className="relative rounded-[1.25rem] border-[0.75px] border-gray-200 p-2 md:rounded-[1.5rem] md:p-3 h-full">
                <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} />
                <div className="relative flex flex-col h-full rounded-xl border-[0.75px] border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 lg:p-10 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] flex items-center justify-center text-white mb-6 shadow-lg shadow-red-200/30">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                    {item.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── VALUES ─── */
const values = [
  {
    title: "Community-Driven",
    desc: "We prioritize partnerships with local cafés and support the communities they serve.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Design Excellence",
    desc: "Every piece of packaging is thoughtfully designed to enhance the customer experience.",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
  {
    title: "Sustainability Focus",
    desc: "We're committed to eco-friendly materials and reducing waste through higher-quality products.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Mutual Value",
    desc: "Every partnership benefits all parties: cafés, advertisers, and customers alike.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

function ValuesSection() {
  return (
    <section className="section-pad-lg bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
            What Drives Us
          </span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-white mt-4">
            Our Core Values
          </h2>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <div className="group bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-8 lg:p-10 hover:bg-white/[0.08] transition-all duration-700 hover:border-white/[0.15] h-full">
                <div className="w-12 h-12 rounded-xl bg-[hsl(0,83%,59%)]/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[hsl(0,83%,59%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-3 group-hover:text-[hsl(0,83%,59%)] transition-colors">
                  {v.title}
                </h3>
                <p className="text-gray-400 leading-relaxed lg:text-lg">{v.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[hsl(0,83%,59%)] opacity-[0.06] rounded-full blur-[120px]" />
    </section>
  );
}

/* ─── CTA ─── */
function AboutCTA() {
  return (
    <section className="section-pad-lg bg-white">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <FadeIn>
          <div className="relative bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,45%)] rounded-[2.5rem] px-8 py-20 md:px-16 md:py-24 text-center overflow-hidden">
            <div className="absolute inset-0 rounded-[2.5rem] shimmer" />
            <div className="absolute -top-16 -right-16 w-64 h-64 border border-white/10 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/10 rounded-full" />

            <div className="relative z-10">
              <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
                Join Our Mission
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Whether you&apos;re an advertiser or a café seeking premium packaging,
                we&apos;d love to work with you.
              </p>
              <MagneticButton href="/contact">
                <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-white text-[hsl(0,83%,59%)] shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50">
                  Get in Touch
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
export function AboutSections() {
  return (
    <>
      <AboutHero />
      <VisionSection />
      <StartingLocalSection />
      <CoBrandingSection />
      <ValuesSection />
      <AboutCTA />
    </>
  );
}
