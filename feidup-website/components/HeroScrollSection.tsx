"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollSection() {
  return (
    <section className="relative bg-gradient-to-br from-[hsl(51,39%,94%)] via-white to-[hsl(51,39%,96%)] overflow-hidden">
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6 leading-[1.1]">
                <span className="text-[hsl(0,83%,59%)]">Transform</span>{" "}
                Packaging to Grow{" "}
                <span className="relative inline-block">
                  <span className="text-[hsl(0,83%,59%)]">Your Business</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M2 6C50 1 150 1 198 6"
                      stroke="hsl(0,83%,59%)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                We partner with local businesses to provide customised food and
                beverage packaging designed to improve customer loyalty and grow
                your local community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <a
                  href="/advertisers"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] text-white shadow-lg hover:shadow-xl hover:shadow-red-200/50 focus:ring-2 focus:ring-[hsl(0,83%,59%)] focus:ring-offset-2 outline-none"
                >
                  Advertise With Us
                  <svg
                    className="w-4 h-4"
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
                </a>
                <a
                  href="/businesses"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-gray-300 text-gray-700 hover:border-[hsl(0,83%,59%)] hover:text-[hsl(0,83%,59%)] focus:ring-2 focus:ring-[hsl(0,83%,59%)] focus:ring-offset-2 outline-none"
                >
                  Join Us As Venue Partners
                </a>
              </div>
            </div>
          }
        >
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&h=720&fit=crop"
            alt="FeidUp branded café packaging showcasing premium co-branded cups and containers"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-center"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* Animated background blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[hsl(0,83%,59%)] opacity-[0.04] rounded-full blur-3xl animate-blob pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[hsl(51,39%,80%)] opacity-[0.15] rounded-full blur-3xl animate-blob-delay pointer-events-none"></div>
    </section>
  );
}
