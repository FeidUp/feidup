import { Metadata } from "next";
import { BusinessesSections } from "@/components/BusinessesSections";

export const metadata: Metadata = {
  title: "For Café Partners | FeidUp - Free Premium Packaging",
  description:
    "Get free premium custom packaging with co-branding opportunities. Partner with FeidUp for sustainable, high-quality packaging.",
};

export default function BusinessesPage() {
  return <BusinessesSections />;
}
