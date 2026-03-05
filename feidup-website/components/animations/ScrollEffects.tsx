"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

interface StickyRevealProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function StickyReveal({
  children,
  className = "",
  height = "300vh",
}: StickyRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {typeof children === "function"
          ? (children as (progress: typeof scrollYProgress) => React.ReactNode)(scrollYProgress)
          : children}
      </div>
    </div>
  );
}

interface ScrollScaleProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollScale({ children, className = "" }: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

interface ScrollProgressBarProps {
  className?: string;
  color?: string;
}

export function ScrollProgressBar({
  className = "",
  color = "hsl(0, 83%, 59%)",
}: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left ${className}`}
      style={{
        scaleX: scrollYProgress,
        backgroundColor: color,
      }}
    />
  );
}

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  className = "",
  duration = 2,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        {isInView ? <AnimatedNumber end={end} duration={duration} /> : "0"}
      </motion.span>
      {suffix}
    </span>
  );
}

function AnimatedNumber({ end, duration }: { end: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      onAnimationStart={() => {
        if (!ref.current) return;
        const start = performance.now();
        const step = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          if (ref.current) {
            ref.current.textContent = Math.floor(eased * end).toLocaleString();
          }
          if (progress < 1) requestAnimationFrame(step);
          else if (ref.current) ref.current.textContent = end.toLocaleString();
        };
        requestAnimationFrame(step);
      }}
    >
      0
    </motion.span>
  );
}
