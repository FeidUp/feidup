"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { MagneticButton } from "@/components/animations/MagneticButton";

/* ─── HERO ─── */
function AdvertisersHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--grid-color) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[hsl(0,83%,59%)] rounded-full blur-[150px] animate-blob" style={{ opacity: "var(--glow-opacity)" }} />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[120px] animate-blob-delay" style={{ opacity: "calc(var(--glow-opacity) * 0.8)" }} />

      <motion.div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full" style={{ y, opacity }}>
        <div className="max-w-3xl">
          <FadeIn delay={0.1}>
            <h1 className="fluid-7xl font-bold font-[family-name:var(--font-fredoka)] mb-6 leading-[1.05]" style={{ color: "var(--text-primary)" }}>
              Unskippable<br />
              <span className="text-gradient">Real-World</span><br />
              Impressions
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl leading-relaxed max-w-xl mb-10" style={{ color: "var(--text-secondary)" }}>
              FeidUp enables targeted impressions in high-traffic urban areas with unique
              reach that can&apos;t be blocked, skipped, or ignored.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <MagneticButton href="/contact">
              <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-[hsl(0,83%,59%)] text-white shadow-xl shadow-red-500/20 hover:shadow-2xl transition-all duration-300 hover:brightness-110">
                Start Your Campaign
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
    title: "Location Targeting",
    desc: "Reach specific geographic areas and demographics through strategic cafe partnerships in high-traffic urban locations.",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "High Visibility",
    desc: "Your brand is literally in customers' hands. Every cup is a touchpoint, carried through busy streets and social media.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  },
  {
    title: "Ad-Block Proof",
    desc: "No software can block real-world impressions. Your message reaches audiences in an authentic, unavoidable way.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "Value Per Impression",
    desc: "Each impression delivers sustained engagement, not a fleeting glance. Customers interact throughout their cafe experience.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    title: "Engaged Audiences",
    desc: "Cafe customers are often professionals, students, and creatives — valuable demographics actively engaged.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Measurable Impact",
    desc: "Track campaign performance through cafe partnerships, distribution metrics, and geographic reach analytics.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
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
            Why Choose FeidUp?
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Traditional digital ads get blocked or skipped. FeidUp delivers your message
            directly into the hands of your target audience.
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
                    {b.icon.split(" M").map((d, i) => (
                      <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={i === 0 ? d : "M" + d} />
                    ))}
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

/* ─── PARTNERSHIPS ─── */
function PartnershipsSection() {
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
            <motion.div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 shadow-2xl"
              style={{ y: imgY }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-xl font-[family-name:var(--font-fredoka)]">Partnership Network</p>
                  <p className="text-white/60 mt-2">High-traffic cafe locations</p>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-40 h-40 border border-white/10 rounded-full" />
            </motion.div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Partnerships</span>
            <h2 className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] mt-4 mb-8" style={{ color: "var(--text-primary)" }}>
              Unprecedented Reach Through Cafe Partnerships
            </h2>
            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                Our partnerships with local cafes give you access to established, trusted
                venues with loyal customer bases. When your brand appears on packaging at
                their favorite cafe, customers notice.
              </p>
              <div className="backdrop-blur-sm rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <p className="font-semibold font-[family-name:var(--font-fredoka)] text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                  Co-branded, Not Intrusive
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  Your brand is integrated alongside the cafe&apos;s identity, creating a positive
                  association rather than ad fatigue.
                </p>
              </div>
              <p>
                This isn&apos;t just advertising — it&apos;s brand integration that respects the
                customer experience while delivering powerful results.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="absolute -bottom-32 right-0 w-[500px] h-[300px] bg-[hsl(0,83%,59%)] rounded-full blur-[120px]" style={{ opacity: "var(--glow-opacity)" }} />
    </section>
  );
}

/* ─── PROCESS STEPS ─── */
const steps = [
  { num: 1, title: "Contact Us", desc: "Reach out to discuss your campaign goals and target audience." },
  { num: 2, title: "Plan Strategy", desc: "We identify the best cafe locations and design approach for your brand." },
  { num: 3, title: "Design & Approve", desc: "Review co-branded packaging designs that integrate your message beautifully." },
  { num: 4, title: "Launch & Track", desc: "Your campaign goes live with measurable reach and engagement metrics." },
];

function ProcessSection() {
  return (
    <section className="section-pad-lg relative">
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--divider), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">Getting Started</span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
            How to Launch Your Campaign
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            We make it easy to get started with targeted, real-world advertising.
          </p>
        </FadeIn>

        <div className="relative">
          <StaggerContainer className="relative z-10 grid md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <StaggerItem key={step.num} className="flex">
                <div className="relative z-10 pt-8 flex-1 flex flex-col">
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

/* ─── CTA ─── */
function AdvertisersCTA() {
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
                Ready to Launch Your Campaign?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Get in touch for campaign planning and discover how FeidUp can deliver
                unskippable impressions for your brand.
              </p>
              <MagneticButton href="/contact">
                <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-white text-[hsl(0,83%,59%)] shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50">
                  Start Planning Your Campaign
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
export function AdvertisersSections() {
  return (
    <>
      <AdvertisersHero />
      <BenefitsSection />
      <PartnershipsSection />
      <ProcessSection />
      <AdvertisersCTA />
    </>
  );
}
