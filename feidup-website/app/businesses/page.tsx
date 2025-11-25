import { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "For Café Partners | FeidUp - Free Premium Packaging",
  description: "Get free premium custom packaging with co-branding opportunities. Partner with FeidUp for sustainable, high-quality packaging.",
};

export default function BusinessesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6 leading-tight">
                Premium Packaging, <span className="text-[hsl(0,83%,59%)]">Zero Cost</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Partner with FeidUp to get free, high-quality custom packaging that showcases 
                your café's brand while supporting sustainability.
              </p>
              <Button href="/contact">Become a Partner</Button>
            </div>
            <div>
              <PlaceholderImage 
                text="Custom Café Packaging" 
                className="w-full h-96 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Why Partner with FeidUp?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to elevate your café's packaging without the cost.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                No Cost to You
              </h3>
              <p className="text-gray-600">
                Premium custom packaging is 100% funded by advertiser partnerships. 
                Upgrade your packaging quality without impacting your budget.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Your Brand Front & Center
              </h3>
              <p className="text-gray-600">
                The packaging looks like your café branding, not a billboard. We co-brand 
                thoughtfully, keeping your identity as the primary focus.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Higher-grade materials, better designs, and professional printing. 
                Packaging that makes your customers feel special.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Sustainable Materials
              </h3>
              <p className="text-gray-600">
                Eco-friendly, durable packaging that aligns with modern customer values 
                and reduces environmental impact.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v2a1 1 0 01-2 0V5zM4 13a1 1 0 011 1v2h2a1 1 0 110 2H5a1 1 0 01-1-1v-3a1 1 0 011-1zm16 0a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 110-2h2v-2a1 1 0 011-1zM15 4a1 1 0 100 2h2v2a1 1 0 102 0V5a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Custom Design
              </h3>
              <p className="text-gray-600">
                Work with our design team to create packaging that perfectly represents 
                your café's unique personality and aesthetic.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Simple Partnership
              </h3>
              <p className="text-gray-600">
                No complicated contracts or hidden fees. Just great packaging and a 
                partnership that works for your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Branding Explanation */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-[hsl(51,39%,94%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6">
                Your Brand Always Comes First
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                When customers pick up a cup from your café, they should see <em>your</em> branding 
                first and foremost. That's our promise.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                <strong className="text-gray-900">Co-Branding, Not Takeover</strong>
                <br />
                Advertiser messaging is integrated subtly and tastefully—complementing your 
                design, not competing with it. Think of it as a partnership: your café's name 
                and logo are prominent, with sponsor branding incorporated in a way that feels 
                natural and premium.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                For example, an "Ipswich Cafe × FeidUp" cup would feature Ipswich Cafe's 
                branding prominently, with advertiser elements integrated thoughtfully into 
                the overall design aesthetic.
              </p>
            </div>
            <div>
              <PlaceholderImage 
                text="Co-Branded Cup Example" 
                className="w-full h-96 shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Cafés */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Partnership Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with FeidUp is simple and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Apply
                </h3>
                <p className="text-gray-600 text-sm">
                  Fill out our simple partnership form and tell us about your café.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Design Together
                </h3>
                <p className="text-gray-600 text-sm">
                  Collaborate with our team to create packaging that represents your brand perfectly.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Approve & Produce
                </h3>
                <p className="text-gray-600 text-sm">
                  Review the final designs and we'll handle production and delivery.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-6 rounded-3xl shadow-lg h-full border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2 mt-4">
                  Launch
                </h3>
                <p className="text-gray-600 text-sm">
                  Start serving with beautiful, custom packaging that elevates your brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal Partners */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-[hsl(51,39%,94%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Ideal Café Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're looking for cafés that value quality and have engaged local communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2">
                Urban Locations
              </h3>
              <p className="text-gray-600">
                High foot traffic in cities or busy neighborhoods
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2">
                Engaged Community
              </h3>
              <p className="text-gray-600">
                Loyal customer base and active social presence
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-2">
                Quality-Focused
              </h3>
              <p className="text-gray-600">
                Values presentation, design, and premium customer experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
            Ready to Upgrade Your Packaging?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join FeidUp and get premium custom packaging at no cost to your café.
          </p>
          <Button href="/contact" variant="secondary" className="bg-white text-[hsl(0,83%,59%)] border-0 hover:bg-gray-100">
            Partner with Us Today
          </Button>
        </div>
      </section>
    </div>
  );
}
