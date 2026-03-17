"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";

interface FloatingCupProps {
  className?: string;
  src?: string;
  alt?: string;
}

/**
 * A real coffee cup photo with 3D scroll-driven rotation
 * and mouse-follow tilt. Uses the actual product mockup images.
 */
export function FloatingCup({
  className = "",
  src = "/images/cup-purple.jpg",
  alt = "FeidUp branded coffee cup held in hand",
}: FloatingCupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scroll-driven transforms
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -6]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  // Mouse interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const mouseRotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-12, 12]),
    springConfig
  );
  const mouseRotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [8, -8]),
    springConfig
  );

  // Glare effect
  const glareX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [0, 100]),
    springConfig
  );
  const glareY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [0, 100]),
    springConfig
  );

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={{
          rotateY,
          rotateX,
          y,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <motion.div
          style={{
            rotateY: mouseRotateY,
            rotateX: mouseRotateX,
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          {/* Main cup image */}
          <div className="relative aspect-[3/4] w-72 md:w-80 lg:w-96 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
              priority
            />

            {/* Glare overlay */}
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([gx, gy]) =>
                    `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.2) 0%, transparent 50%)`
                ),
              }}
            />
          </div>

          {/* Floating shadow */}
          <motion.div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-8 rounded-[50%] blur-xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)",
              scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
