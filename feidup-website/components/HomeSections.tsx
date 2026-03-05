"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  CountUp,
  ScrollScale,
} from "@/components/animations";
import { MagneticButton } from "@/components/animations/MagneticButton";

/* ─── STATS BAR ─── */
function StatsSection() {
  const stats = [
    { value: 500, suffix: "+", label: "Impressions Daily" },
    { value: 25, suffix: "+", label: "Venue Partners" },
    { value: 98, suffix: "%", label: "Partner Satisfaction" },
    { value: 100, suffix: "%", label: "Unskippable" },
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* subtle top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <div className="fluid-4xl font-bold font-[family-name:var(--font-fredoka)] text-gradient">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide uppercase">
                {s.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </section>
  );
}

/* ─── HOW IT WORKS — STICKY HORIZONTAL STEPS ─── */
const steps = [
  {
    num: "01",
    title: "Partner with Venues",
    desc: "We collaborate with local cafés & venues to provide custom packaging featuring both their branding and advertiser messaging.",
    gradient: "from-rose-500 to-red-600",
  },
  {
    num: "02",
    title: "Connect with Brands",
    desc: "Advertisers gain access to targeted, contextually relevant impressions in specific geographic areas with engaged audiences.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    num: "03",
    title: "Deliver Results",
    desc: "Customers enjoy beautifully designed packaging while brands achieve meaningful, measurable visibility in the real world.",
    gradient: "from-orange-500 to-amber-500",
  },
];

function HowItWorksSection() {
  return (
    <section className="section-pad-lg bg-gray-950 text-white relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
            The Process
          </span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-white mt-4 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Simple, effective, and mutually beneficial for everyone involved.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15}>
              <div className="group relative h-full">
                <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-8 lg:p-10 h-full hover:bg-white/[0.08] transition-all duration-700 hover:border-white/[0.15]">
                  {/* Step number */}
                  <span className={`inline-block text-sm font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent tracking-wider mb-6`}>
                    {step.num}
                  </span>

                  {/* Animated line */}
                  <div className="h-px w-12 bg-gradient-to-r from-[hsl(0,83%,59%)] to-transparent mb-6 group-hover:w-20 transition-all duration-700" />

                  <h3 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-base lg:text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[hsl(0,83%,59%)] opacity-[0.06] rounded-full blur-[120px]" />
    </section>
  );
}

/* ─── TESTIMONIALS — MARQUEE STYLE ─── */
const testimonials = [
  {
    quote: "FeidUp transformed our plain cups into something our customers actually comment on. The co-branded design is beautiful and feels authentically ours.",
    name: "Sarah Chen",
    role: "Café Owner, Sydney",
    initials: "SC",
  },
  {
    quote: "The impressions we get through FeidUp are genuinely unskippable. Our brand is literally in people's hands during their morning coffee — you can't beat that.",
    name: "Mark Reynolds",
    role: "Marketing Director",
    initials: "MR",
  },
  {
    quote: "We saved on packaging costs and got a premium upgrade at the same time. Our customers love the new look and it started conversations about our café.",
    name: "James Patel",
    role: "Business Owner, Melbourne",
    initials: "JP",
  },
];

function TestimonialsSection() {
  return (
    <section className="section-pad-lg bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-xs uppercase tracking-[0.2em]">
            Trusted Partners
          </span>
          <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-4">
            What Our Partners Say
          </h2>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="group bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-1 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed flex-1 text-base lg:text-lg">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-200/30">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-gray-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── CINEMATIC CTA ─── */
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section ref={ref} className="section-pad-lg relative overflow-hidden">
      <motion.div
        className="mx-auto max-w-5xl px-6 lg:px-8"
        style={{ scale }}
      >
        <div className="relative bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,45%)] rounded-[2.5rem] px-8 py-20 md:px-16 md:py-28 text-center overflow-hidden">
          {/* Animated rings */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 border border-white/10 rounded-full"
            style={{ y }}
          />
          <motion.div
            className="absolute -bottom-16 -left-16 w-64 h-64 border border-white/10 rounded-full"
            style={{ y: useTransform(y, (v) => -v) }}
          />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 border border-white/5 rounded-full animate-rotate-slow" />

          {/* Shimmer overlay */}
          <div className="absolute inset-0 rounded-[2.5rem] shimmer" />

          <div className="relative z-10">
            <FadeIn>
              <h2 className="fluid-5xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
                Ready to Transform
                <br />
                Your Marketing?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join cafés and advertisers already experiencing the power of
                real-world, unskippable impressions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton href="/contact">
                  <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg bg-white text-[hsl(0,83%,59%)] shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50">
                    Get in Touch
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
export function HomeSections() {
  return (
    <>
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
