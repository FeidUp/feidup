import { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "About FeidUp | Our Vision & Mission",
  description: "Learn about FeidUp's vision to connect cafés, customers, and advertisers through sustainable co-branded packaging.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6">
              About <span className="text-[hsl(0,83%,59%)]">FeidUp</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're transforming the way brands connect with audiences by turning everyday 
              café packaging into powerful, sustainable marketing opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6">
                Our Long-Term Vision
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                FeidUp envisions a future where cafés, customers, and advertisers are seamlessly 
                connected through sustainable, beautifully designed branded packaging.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                We believe in creating value for everyone involved: cafés get premium packaging 
                at no cost, advertisers gain authentic real-world impressions, and customers 
                enjoy better-designed, more sustainable products.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform is built on the principle that marketing can be both effective 
                and beneficial to local communities, while reducing environmental impact through 
                higher-quality, longer-lasting materials.
              </p>
            </div>
            <div>
              <PlaceholderImage 
                text="Vision Illustration" 
                className="w-full h-96 shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Short-Term Goals Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-[hsl(51,39%,94%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <PlaceholderImage 
                text="Co-Branded Cup Example: Ipswich Cafe × FeidUp" 
                className="w-full h-96 shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6">
                Starting Local, Thinking Global
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                We're launching with targeted pilots at select local cafés, beginning with 
                custom co-branded cups that feature both the café's identity and advertiser 
                messaging.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                <strong className="text-gray-900">Key Focus: Co-Branding</strong>
                <br />
                Our packaging is designed café-first. When you see a FeidUp cup at Ipswich Cafe, 
                it looks like Ipswich Cafe branding with subtle advertiser integration—not an 
                intrusive ad that overshadows the café's identity.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                This approach ensures cafés maintain their brand integrity while gaining access 
                to premium packaging materials they might not otherwise afford.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Co-Branding Matters */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Why Co-Branding Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe packaging should enhance the café experience, not distract from it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Café Identity First
              </h3>
              <p className="text-gray-600">
                The café's branding stays front and center. Our packaging looks like it belongs 
                to the café, not like a walking billboard.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Subtle Integration
              </h3>
              <p className="text-gray-600">
                Advertiser messaging is integrated tastefully, complementing the design rather 
                than dominating it. Quality over intrusion.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Higher-quality materials, better design, and sustainable production make this 
                packaging something cafés are proud to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-[hsl(51,39%,94%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-[hsl(0,83%,59%)] mb-3">
                Community-Driven
              </h3>
              <p className="text-gray-600">
                We prioritize partnerships with local cafés and support the communities they serve.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-[hsl(0,83%,59%)] mb-3">
                Design Excellence
              </h3>
              <p className="text-gray-600">
                Every piece of packaging is thoughtfully designed to enhance, not detract from, 
                the customer experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-[hsl(0,83%,59%)] mb-3">
                Sustainability Focus
              </h3>
              <p className="text-gray-600">
                We're committed to using eco-friendly materials and reducing waste through 
                better-quality, longer-lasting products.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-[hsl(0,83%,59%)] mb-3">
                Mutual Value
              </h3>
              <p className="text-gray-600">
                Every partnership we create benefits all parties: cafés, advertisers, and customers alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're an advertiser looking for authentic reach or a café seeking 
            premium packaging, we'd love to work with you.
          </p>
          <Button href="/contact" variant="secondary" className="bg-white text-[hsl(0,83%,59%)] border-0 hover:bg-gray-100">
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  );
}
