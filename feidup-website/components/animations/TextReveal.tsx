"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  splitBy?: "word" | "line" | "character";
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  once = true,
  as: Component = "p",
  splitBy = "word",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const MotionComponent = motion.create(Component);

  const units =
    splitBy === "character"
      ? children.split("")
      : splitBy === "line"
        ? children.split("\n")
        : children.split(" ");

  return (
    <MotionComponent ref={ref} className={`${className} overflow-hidden`}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + i * (splitBy === "character" ? 0.02 : 0.04),
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            {unit}
            {splitBy === "word" ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}

interface LineRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  direction?: "up" | "down" | "left" | "right";
}

export function LineReveal({
  children,
  className = "",
  delay = 0,
  once = true,
  direction = "up",
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const directionMap = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  };

  const d = directionMap[direction];

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: d.y, x: d.x, opacity: 0 }}
        animate={isInView ? { y: 0, x: 0, opacity: 1 } : { y: d.y, x: d.x, opacity: 0 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.4, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
