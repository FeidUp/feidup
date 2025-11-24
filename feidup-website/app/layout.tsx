import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FeidUp | Transform Café Packaging into High-Visibility Ad Inventory",
  description: "FeidUp partners with cafés to provide free custom packaging funded by advertiser impressions. Unskippable real-world advertising meets sustainable co-branding.",
  keywords: "advertising impressions, café partnerships, co-branded packaging, marketing platform, real-world advertising, sustainable packaging",
  openGraph: {
    title: "FeidUp | Marketing & Impressions Platform",
    description: "Transform everyday café packaging into high-visibility ad inventory",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${fredoka.variable} antialiased font-sans`}
      >
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
