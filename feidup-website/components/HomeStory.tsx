"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  TextReveal,
  CountUp,
  Tilt3D,
  FloatingCup,
} from "@/components/animations";
import { MagneticButton } from "@/components/animations/MagneticButton";

/* ─── 1. DARK HERO ─── */
function DarkHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -100]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(0,83%,59%)] rounded-full blur-[180px]" style={{ opacity: "var(--glow-opacity)" }} />

      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ opacity, y }}
      >
        {/* Tag */}
        <FadeIn delay={0.2}>
          <span className="inline-block text-[hsl(0,83%,59%)] font-medium text-xs uppercase tracking-[0.3em] mb-8">
            Real-World Advertising
          </span>
        </FadeIn>

        {/* Main headline */}
        <div style={{ color: "var(--text-primary)" }}>
          <TextReveal
            as="h1"
            className="fluid-7xl font-bold font-[family-name:var(--font-fredoka)] mb-8"
            delay={0.4}
          >
            Fed up with ads people skip?
          </TextReveal>
        </div>

        <FadeIn delay={1.0}>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light" style={{ color: "var(--text-secondary)" }}>
            We put your brand in people&apos;s hands — literally.
          </p>
        </FadeIn>

        <FadeIn delay={1.3}>
          <div className="mt-12">
            <MagneticButton href="/contact">
              <span className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-lg bg-[hsl(0,83%,59%)] text-white hover:bg-[hsl(0,83%,52%)] transition-all duration-300 shadow-lg shadow-red-500/20">
                Get Started
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </MagneticButton>
          </div>
        </FadeIn>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full flex items-start justify-center p-2" style={{ border: "2px solid var(--border-hover)" }}>
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--text-muted)" }}
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ─── 2. THE PROBLEM ─── */
function ProblemSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Divider */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <FadeIn>
          <span className="text-[hsl(0,83%,59%)] font-medium text-xs uppercase tracking-[0.3em] mb-6 block">
            The Problem
          </span>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="fluid-6xl font-bold font-[family-name:var(--font-fredoka)] mb-8" style={{ color: "var(--text-primary)" }}>
            <CountUp end={70} suffix="%" className="text-gradient" /> of digital
            ads are never seen.
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-xl max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Ad blockers. Banner blindness. Infinite scroll. Your message
            disappears before it even registers.
          </p>
        </FadeIn>

        <FadeIn delay={0.45}>
          <p className="text-lg mt-6 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            There has to be a better way.
          </p>
        </FadeIn>
      </div>

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-red-500 rounded-full blur-[120px]" style={{ opacity: "calc(var(--glow-opacity) * 0.5)" }} />
    </section>
  );
}

/* ─── 3. THE INSIGHT ─── */
function InsightSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <FadeIn>
              <span className="text-[hsl(0,83%,59%)] font-medium text-xs uppercase tracking-[0.3em] mb-6 block">
                The Insight
              </span>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] mb-8 leading-tight" style={{ color: "var(--text-primary)" }}>
                People hold a coffee cup for{" "}
                <span className="text-gradient">20+ minutes.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                That&apos;s not an impression — it&apos;s a conversation. Your
                brand, cradled in their hands, during the most attentive part of
                their day.
              </p>
            </FadeIn>
            <FadeIn delay={0.45}>
              <p className="text-lg mt-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                No scrolling past. No skipping. No blocking.
                <br />
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                  Just real, tangible presence.
                </span>
              </p>
            </FadeIn>
          </div>

          {/* 3D Cup */}
          <FadeIn direction="right" delay={0.2}>
            <FloatingCup className="min-h-[400px] md:min-h-[500px]" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. HOW IT WORKS — STICKY STEPS ─── */
const steps = [
  {
    num: "01",
    title: "Partner with Cafes & Restaurants",
    desc: "We collaborate with local cafes and restaurants to provide custom packaging featuring both the cafe and advertiser.",
  },
  {
    num: "02",
    title: "Connect with Brands",
    desc: "Advertisers gain access to targeted, contextually relevant impressions in specific geographic areas with engaged audiences.",
  },
  {
    num: "03",
    title: "Deliver Results",
    desc: "Customers enjoy beautifully designed packaging while brands achieve meaningful, measurable visibility in the real world.",
  },
];

function HowItWorksSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center mb-24">
          <span className="text-[hsl(0,83%,59%)] font-medium text-xs uppercase tracking-[0.3em] block mb-4">
            The Process
          </span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)]" style={{ color: "var(--text-primary)" }}>
            How It Works
          </h2>
        </FadeIn>

        <div className="space-y-8 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15}>
              <Tilt3D maxTilt={8} scale={1.03} glare>
                <div className="group relative">
                  <div
                    className="relative rounded-2xl p-8 md:p-10 transition-all duration-700"
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
                    <div className="flex items-start gap-6 md:gap-8">
                      {/* Number */}
                      <span className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-fredoka)] text-gradient shrink-0">
                        {step.num}
                      </span>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-fredoka)] mb-3" style={{ color: "var(--text-primary)" }}>
                          {step.title}
                        </h3>
                        <p className="leading-relaxed text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    {/* Hover line */}
                    <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-[hsl(0,83%,59%)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  </div>
                </div>
              </Tilt3D>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[hsl(0,83%,59%)] rounded-full blur-[140px]" style={{ opacity: "var(--glow-opacity)" }} />
    </section>
  );
}

/* ─── 5. TWO AUDIENCES ─── */
function AudienceSplit() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-medium text-xs uppercase tracking-[0.3em] block mb-4">
            Two Sides, One Platform
          </span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)]" style={{ color: "var(--text-primary)" }}>
            Built for Both
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Advertisers */}
          <FadeIn direction="left" delay={0.1} className="flex">
            <Tilt3D maxTilt={10} scale={1.02} glare className="w-full">
            <Link href="/advertisers" className="group block h-full w-full">
              <div
                className="relative rounded-3xl p-10 md:p-12 h-full flex flex-col transition-all duration-700 overflow-hidden"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-hover)";
                  e.currentTarget.style.borderColor = "hsla(0,83%,59%,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card-bg)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(0,83%,59%)] rounded-full blur-[60px] group-hover:opacity-[0.1] transition-opacity duration-700" style={{ opacity: "var(--glow-opacity)" }} />

                <span className="text-[hsl(0,83%,59%)] font-medium text-xs uppercase tracking-[0.3em] mb-4 block">
                  For Advertisers
                </span>
                <h3 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-fredoka)] mb-4" style={{ color: "var(--text-primary)" }}>
                  Unskippable Impressions
                </h3>
                <p className="leading-relaxed text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
                  Your brand on premium packaging, in the hands of your target
                  audience, in the neighborhoods that matter.
                </p>
                <span className="inline-flex items-center gap-2 text-[hsl(0,83%,59%)] font-medium group-hover:gap-4 transition-all duration-300">
                  Learn more
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
            </Tilt3D>
          </FadeIn>

          {/* Venues */}
          <FadeIn direction="right" delay={0.1} className="flex">
            <Tilt3D maxTilt={10} scale={1.02} glare className="w-full">
            <Link href="/businesses" className="group block h-full w-full">
              <div
                className="relative rounded-3xl p-10 md:p-12 h-full flex flex-col transition-all duration-700 overflow-hidden"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-hover)";
                  e.currentTarget.style.borderColor = "hsla(0,83%,59%,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card-bg)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(0,83%,59%)] rounded-full blur-[60px] group-hover:opacity-[0.1] transition-opacity duration-700" style={{ opacity: "var(--glow-opacity)" }} />

                <span className="text-[hsl(0,83%,59%)] font-medium text-xs uppercase tracking-[0.3em] mb-4 block">
                  For Cafes & Restaurants
                </span>
                <h3 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-fredoka)] mb-4" style={{ color: "var(--text-primary)" }}>
                  Premium Packaging, Minimal Cost
                </h3>
                <p className="leading-relaxed text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
                  Upgrade your cups and packaging to a premium co-branded
                  design — with costs kept low through advertiser partnerships.
                </p>
                <span className="inline-flex items-center gap-2 text-[hsl(0,83%,59%)] font-medium group-hover:gap-4 transition-all duration-300">
                  Learn more
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
            </Tilt3D>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. STATS ─── */
// function StatsSection() {
//   const stats = [
//     { value: 500, suffix: "+", label: "Impressions Daily" },
//     { value: 25, suffix: "+", label: "Venue Partners" },
//     { value: 98, suffix: "%", label: "Partner Satisfaction" },
//     { value: 20, suffix: "+", label: "Minutes per Impression" },
//   ];

//   return (
//     <section className="relative py-32 md:py-40 overflow-hidden">
//       <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

//       <div className="mx-auto max-w-6xl px-6 lg:px-8">
//         <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
//           {stats.map((s) => (
//             <StaggerItem key={s.label} className="text-center">
//               <div className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-gradient mb-3">
//                 <CountUp end={s.value} suffix={s.suffix} />
//               </div>
//               <p className="text-sm font-medium tracking-[0.15em] uppercase" style={{ color: "var(--text-muted)" }}>
//                 {s.label}
//               </p>
//             </StaggerItem>
//           ))}
//         </StaggerContainer>
//       </div>

//       <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />
//     </section>
//   );
// }

/* ─── 7. CLOSING CTA ─── */
function ClosingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <motion.div className="mx-auto max-w-5xl px-6 lg:px-8" style={{ scale }}>
        <div className="relative bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,42%)] rounded-[2rem] px-8 py-20 md:px-16 md:py-24 text-center overflow-hidden">
          {/* Subtle rings */}
          <div className="absolute -top-20 -right-20 w-80 h-80 border border-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 border border-white/5 rounded-full" />

          <div className="relative z-10">
            <FadeIn>
              <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
                Ready to Transform
                <br />
                Your Marketing?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join cafes and advertisers already experiencing the power of
                real-world, unskippable impressions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton href="/contact">
                  <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-white text-[hsl(0,83%,59%)] shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50">
                    Get in Touch
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </MagneticButton>
                <MagneticButton href="/about">
                  <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-[hsl(0,83%,59%)] transition-all duration-300">
                    Learn More
                  </span>
                </MagneticButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── EXPORT ─── */
export function HomeStory() {
  return (
    <>
      <DarkHero />
      <ProblemSection />
      <InsightSection />
      <HowItWorksSection />
      <AudienceSplit />
      {/* <StatsSection /> */}
      <ClosingCTA />
    </>
  );
}
