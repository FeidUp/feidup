import { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "For Advertisers | FeidUp - Targeted Real-World Impressions",
  description: "Reach engaged audiences with unskippable real-world impressions through FeidUp's café packaging partnerships.",
};

export default function AdvertisersPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6 leading-tight">
                Unskippable <span className="text-[hsl(14,86%,57%)]">Real-World</span> Impressions
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                FeidUp enables targeted impressions in high-traffic urban areas with unique 
                reach that can't be blocked, skipped, or ignored.
              </p>
              <Button href="/contact">Start Your Campaign</Button>
            </div>
            <div>
              <PlaceholderImage 
                text="High-Visibility Ad Placement" 
                className="w-full h-96 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Why Choose FeidUp for Your Campaign?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional digital ads get blocked or skipped. FeidUp delivers your message 
              directly into the hands of your target audience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Location Targeting
              </h3>
              <p className="text-gray-600">
                Reach specific geographic areas and demographics through strategic café partnerships 
                in high-traffic urban locations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                High Visibility
              </h3>
              <p className="text-gray-600">
                Your brand is literally in customers' hands. Every cup is a touchpoint, 
                carried through busy streets and photographed for social media.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Ad-Block Proof
              </h3>
              <p className="text-gray-600">
                No software can block real-world impressions. Your message reaches audiences 
                in an authentic, unavoidable way.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Value Per Impression
              </h3>
              <p className="text-gray-600">
                Each impression delivers sustained engagement, not a fleeting glance. 
                Customers interact with your brand throughout their café experience.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Engaged Audiences
              </h3>
              <p className="text-gray-600">
                Café customers are often professionals, students, and creatives—valuable 
                demographics actively engaged in their communities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Measurable Impact
              </h3>
              <p className="text-gray-600">
                Track campaign performance through café partnerships, distribution metrics, 
                and geographic reach analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Partnerships */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-[hsl(43,47%,95%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <PlaceholderImage 
                text="Café Partnership Network" 
                className="w-full h-96 shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6">
                Unique Café Partnerships Give You Unprecedented Reach
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Our partnerships with local cafés give you access to established, trusted venues 
                with loyal customer bases. When your brand appears on packaging at their favorite 
                café, customers notice.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                <strong className="text-gray-900">Co-branded, Not Intrusive</strong>
                <br />
                Your brand is integrated alongside the café's identity, creating a positive 
                association rather than ad fatigue. Customers see your message in a context 
                they already trust.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                This isn't just advertising—it's brand integration that respects the customer 
                experience while delivering powerful results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Process */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              How to Launch Your Campaign
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make it easy to get started with targeted, real-world advertising.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Contact Us
                </h3>
                <p className="text-gray-600 text-sm">
                  Reach out to discuss your campaign goals and target audience.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Plan Strategy
                </h3>
                <p className="text-gray-600 text-sm">
                  We identify the best café locations and design approach for your brand.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Design & Approve
                </h3>
                <p className="text-gray-600 text-sm">
                  Review co-branded packaging designs that integrate your message beautifully.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(43,47%,95%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Launch & Track
                </h3>
                <p className="text-gray-600 text-sm">
                  Your campaign goes live with measurable reach and engagement metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Form CTA */}
      <section className="py-24 bg-gradient-to-r from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
            Ready to Launch Your Campaign?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get in touch for campaign planning and discover how FeidUp can deliver 
            unskippable impressions for your brand.
          </p>
          <Button href="/contact" variant="secondary" className="bg-white text-[hsl(14,86%,57%)] border-0 hover:bg-gray-100">
            Start Planning Your Campaign
          </Button>
        </div>
      </section>
    </div>
  );
}
