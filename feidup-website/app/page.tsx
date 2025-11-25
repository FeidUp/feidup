import Button from "@/components/Button";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(51, 39%, 94%)] to-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6 leading-tight">
                Transform Café Packaging into{" "}
                <span className="text-[hsl(0,83%,59%)]">High-Visibility</span>{" "}
                Ad Inventory
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                FeidUp is a marketing and impressions company that partners with cafés to provide 
                free custom packaging funded by advertiser impressions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/advertisers">For Advertisers</Button>
                <Button href="/businesses" variant="secondary">For Café Partners</Button>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <Image 
                src="/images/feidup-logo.png" 
                alt="Branded Coffee Cup"
                width={600}
                height={400}
                />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-[hsl(0,83%,59%)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-[hsl(0,83%,59%)] opacity-5 rounded-full blur-3xl"></div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Unskippable Real-World Impressions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We turn everyday café packaging into powerful marketing opportunities, 
              connecting brands with engaged audiences in high-traffic urban locations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[hsl(51, 39%, 94%)] to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                For Advertisers
              </h3>
              <p className="text-gray-600">
                Reach targeted audiences with unique, high-value impressions that can't be skipped, 
                blocked, or ignored. Perfect for location-based campaigns.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51, 39%, 94%)] to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                For Café Partners
              </h3>
              <p className="text-gray-600">
                Get premium custom packaging at no cost, co-branded with your café's identity. 
                Enhance your brand while supporting sustainability.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[hsl(51, 39%, 94%)] to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                Sustainable Impact
              </h3>
              <p className="text-gray-600">
                High-quality packaging that's better for the environment, funded by brands 
                that value authentic connections with their audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-[hsl(51, 39%, 94%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, effective, and mutually beneficial for everyone involved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white p-8 rounded-3xl shadow-lg h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3 mt-4">
                  Partner with Cafés
                </h3>
                <p className="text-gray-600">
                  We collaborate with local cafés to provide them with premium custom packaging 
                  that features both their branding and advertiser messaging.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-3xl shadow-lg h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3 mt-4">
                  Connect with Brands
                </h3>
                <p className="text-gray-600">
                  Advertisers gain access to targeted, high-value impressions in specific 
                  geographic areas with engaged audiences.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-3xl shadow-lg h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] rounded-full flex items-center justify-center font-bold font-[family-name:var(--font-fredoka)] text-white text-xl shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3 mt-4">
                  Deliver Results
                </h3>
                <p className="text-gray-600">
                  Customers enjoy beautifully designed packaging while brands achieve 
                  meaningful visibility in the real world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join cafés and advertisers who are already experiencing the power of 
            real-world impressions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="secondary" className="bg-white text-[hsl(0,83%,59%)] border-0 hover:bg-gray-100">
              Get in Touch
            </Button>
            <Button href="/about" className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-[hsl(0,83%,59%)]">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

