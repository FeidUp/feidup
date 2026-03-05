import { Metadata } from "next";
import { AdvertisersSections } from "@/components/AdvertisersSections";

export const metadata: Metadata = {
  title: "For Advertisers | FeidUp - Targeted Real-World Impressions",
  description:
    "Reach engaged audiences with unskippable real-world impressions through FeidUp's café packaging partnerships.",
};

export default function AdvertisersPage() {
  return <AdvertisersSections />;
}
