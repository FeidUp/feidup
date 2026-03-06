"use client";

import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Eye, Building2, Globe, TrendingUp, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <Eye className="h-5 w-5 text-[hsl(0,83%,59%)]" />,
    title: "For Advertisers",
    description:
      "Reach geo-targeted audiences with physical impressions that can't be skipped, blocked, or ignored.",
    href: "/advertisers",
  },
  {
    icon: <Building2 className="h-5 w-5 text-[hsl(0,83%,59%)]" />,
    title: "For Venue Partners",
    description:
      "Get premium custom packaging co-branded with your venue's identity at zero cost.",
    href: "/businesses",
  },
  {
    icon: <Globe className="h-5 w-5 text-[hsl(0,83%,59%)]" />,
    title: "Sustainable Impact",
    description:
      "High-quality eco-friendly packaging funded by brands that value authentic connections.",
    href: "/about",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-[hsl(0,83%,59%)]" />,
    title: "Unskippable Impressions",
    description:
      "100% view rate — your brand is literally in your audience's hands during their daily routine.",
    href: "/advertisers",
  },
  {
    icon: <Users className="h-5 w-5 text-[hsl(0,83%,59%)]" />,
    title: "Community Driven",
    description:
      "We partner with local cafés and venues to build stronger communities through thoughtful co-branding.",
    href: "/about",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-[hsl(0,83%,59%)]" />,
    title: "Measurable Results",
    description:
      "Track campaign performance with distribution metrics, geographic reach, and engagement analytics.",
    href: "/advertisers",
  },
];

export function GlowingFeatureGrid() {
  return (
    <section className="py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-[hsl(0,83%,59%)] font-semibold text-sm uppercase tracking-widest">
            Why FeidUp
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mt-3 mb-4">
            Unskippable Real-World Impressions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We turn everyday packaging into powerful marketing opportunities,
            connecting brands with engaged audiences in all locations.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {features.map((feature) => (
            <GridItem
              key={feature.title}

              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  href: string;
}

const GridItem = ({ icon, title, description, href }: GridItemProps) => {
  return (
    <li
      className="min-h-[14rem] list-none"
    >
      <a href={href} className="block h-full group">
        <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-200 p-2 md:rounded-[1.5rem] md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={3}
          />
          <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-gray-100 bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-6 shadow-sm md:p-6 transition-all duration-500 group-hover:shadow-lg">
            <div className="relative flex flex-1 flex-col justify-between gap-3">
              <div className="w-fit rounded-lg border-[0.75px] border-gray-200 bg-white p-2 shadow-sm">
                {icon}
              </div>
              <div className="space-y-3">
                <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-[family-name:var(--font-fredoka)] tracking-[-0.02em] md:text-2xl md:leading-[1.875rem] text-balance text-gray-900 group-hover:text-[hsl(0,83%,59%)] transition-colors">
                  {title}
                </h3>
                <p className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-600">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};
