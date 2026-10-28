"use client";

import { SITE_CONTENT } from "@/data/siteContent";

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="skew-section py-24 md:py-32 lg:py-40"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p
            className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-accent"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Process
          </p>
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
            data-cursor="text"
          >
            How It Works
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SITE_CONTENT.process.map((step) => (
            <div key={step.step} className="process-step relative" data-reveal="up">
              <div className="mb-4 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent text-xl font-bold text-accent">
                  {step.step}
                </span>
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {step.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-text/60">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="mb-4">
            <h3
              className="mb-2 text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Domain & Hosting
            </h3>
            <p className="text-sm text-text/60">{SITE_CONTENT.domainHosting.note}</p>
          </div>
          <div>
            <h3
              className="mb-2 text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Handoff
            </h3>
            <p className="text-sm text-text/60">{SITE_CONTENT.domainHosting.handoff}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
