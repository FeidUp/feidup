import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: "FeidUp | Transform Cafe Packaging into High-Visibility Ad Inventory",
  description: "FeidUp partners with cafes to provide premium custom packaging through a minimal fee, supported by advertiser impressions. Unskippable real-world advertising meets sustainable co-branding.",
  keywords: "advertising impressions, cafe partnerships, co-branded packaging, marketing platform, real-world advertising, sustainable packaging",
  openGraph: {
    title: "FeidUp | Marketing & Impressions Platform",
    description: "Transform everyday cafe packaging into high-visibility ad inventory",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fredoka.variable} antialiased font-sans`}
      >
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
