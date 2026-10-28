"use client";

import { SITE_CONTENT } from "@/data/siteContent";
import { ArrowRight } from "lucide-react";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="skew-section py-24 md:py-32 lg:py-40"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p
            className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-accent"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Services
          </p>
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
            data-cursor="text"
          >
            What We Offer
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_CONTENT.services && SITE_CONTENT.services.length > 0 ? (
            SITE_CONTENT.services.map((service, index) => (
              <div
                key={index}
                data-reveal="up"
                className="service-card group relative border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-accent/50 hover:bg-white/[0.04]"
              >
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                      service.addOn
                        ? "border border-secondary/50 text-secondary"
                        : "border border-accent/50 text-accent"
                    }`}
                  >
                    {service.addOn ? "Add-on" : "Included"}
                  </span>
                </div>
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {service.name}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-text/60">
                  {service.description}
                </p>
                {service.includedIn && service.includedIn.length > 0 && (
                  <p className="text-xs text-text/40">
                    Included in: {service.includedIn.join(", ")}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-text/60">
              No services available yet.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <a href="#contact" className="hero-cta">
            <span>Get a Quote</span>
            <ArrowRight size={16} className="hero-cta-arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
