import { HeroScrollSection } from "@/components/HeroScrollSection";
import { GlowingFeatureGrid } from "@/components/GlowingFeatureGrid";
import { HomeSections } from "@/components/HomeSections";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero — 3D scroll-perspective animation */}
      <HeroScrollSection />

      {/* All animated sections (client component) */}
      <HomeSections />

      {/* Glowing effect bento grid */}
      <GlowingFeatureGrid />
    </div>
  );
}