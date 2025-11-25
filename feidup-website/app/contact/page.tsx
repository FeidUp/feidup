"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // TODO: Replace with your actual email service (EmailJS, Formspree, Resend, etc.)
      // Example with fetch to a serverless function:
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", businessType: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-6">
              Get in <span className="text-[hsl(0,83%,59%)]">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Whether you're an advertiser looking for targeted impressions or a café 
              seeking premium packaging, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[hsl(51,39%,94%)] to-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[hsl(0,83%,59%)] focus:border-transparent outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[hsl(0,83%,59%)] focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Business Type */}
              <div>
                <label htmlFor="businessType" className="block text-sm font-semibold text-gray-900 mb-2">
                  I am an... *
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[hsl(0,83%,59%)] focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">Select one...</option>
                  <option value="advertiser">Advertiser / Brand</option>
                  <option value="cafe">Café / Business Owner</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[hsl(0,83%,59%)] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </div>

              {/* Status Messages */}
              {status === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800 font-medium text-center">
                    ✓ Thank you! We'll get back to you soon.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 font-medium text-center">
                    ✗ Something went wrong. Please try again or email us directly.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Alternative Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Prefer to email directly?{" "}
              <a 
                href="mailto:hello@feidup.com" 
                className="text-[hsl(0,83%,59%)] font-semibold hover:underline"
              >
                hello@feidup.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-[hsl(51,39%,94%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-4">
              Learn More About FeidUp
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                For Advertisers
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Learn about targeted real-world impressions and campaign planning.
              </p>
              <a
                href="/advertisers"
                className="text-[hsl(0,83%,59%)] font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                For Café Partners
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Discover free premium packaging and co-branding opportunities.
              </p>
              <a
                href="/businesses"
                className="text-[hsl(0,83%,59%)] font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-gray-900 mb-3">
                About FeidUp
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Read about our vision, values, and approach to co-branding.
              </p>
              <a
                href="/about"
                className="text-[hsl(0,83%,59%)] font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
