import { Metadata } from "next";
import { AboutSections } from "@/components/AboutSections";

export const metadata: Metadata = {
  title: "About FeidUp | Our Vision & Mission",
  description:
    "Learn about FeidUp's vision to connect cafés, customers, and advertisers through sustainable co-branded packaging.",
};

export default function AboutPage() {
  return <AboutSections />;
}
