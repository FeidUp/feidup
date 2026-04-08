import { Metadata } from "next";
import { BusinessesSections } from "@/components/BusinessesSections";

export const metadata: Metadata = {
  title: "For Café Partners | FeidUp - Affordable Premium Packaging",
  description:
    "Get premium custom packaging with co-branding opportunities for a minimal fee. Partner with FeidUp for sustainable, high-quality packaging.",
};

export default function BusinessesPage() {
  return <BusinessesSections />;
}
