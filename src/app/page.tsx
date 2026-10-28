"use client";

import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";

const ProjectShowcase = lazy(() => import("@/components/ProjectShowcase"));
const MarqueeSection = lazy(() => import("@/components/MarqueeSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const PrivacyPolicySection = lazy(() => import("@/components/PrivacyPolicySection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

function SectionFallback() {
  return (
    <div data-page-fallback className="flex min-h-[40vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const waitForPageReady = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
      }

      await document.fonts.ready;

      while (document.querySelector("[data-page-fallback]")) {
        await new Promise<void>((resolve) => {
          const observer = new MutationObserver(() => {
            if (!document.querySelector("[data-page-fallback]")) {
              observer.disconnect();
              resolve();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }

      let previousLayout = "";
      let stableFrames = 0;

      while (!cancelled && stableFrames < 2) {
        const images = Array.from(document.images);
        images.forEach((image) => {
          image.loading = "eager";
        });

        await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        const currentLayout = `${document.images.length}:${document.body.scrollHeight}:${document.fonts.status}`;
        if (
          currentLayout === previousLayout &&
          !document.querySelector("[data-page-fallback]") &&
          Array.from(document.images).every((image) => image.complete)
        ) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
        }
        previousLayout = currentLayout;
      }

      if (!cancelled) setPageReady(true);
    };

    void waitForPageReady();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <Preloader ready={pageReady} onComplete={handlePreloaderComplete} />}

      <CustomCursor />

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <SmoothScroll>
          <Navigation />
          <main>
            <Hero />

            <Suspense fallback={<SectionFallback />}>
              <ProjectShowcase />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <MarqueeSection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <ServicesSection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <PricingSection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <ProcessSection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <FAQSection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <PrivacyPolicySection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <ContactSection />
            </Suspense>
          </main>

          <Suspense fallback={<SectionFallback />}>
            <Footer />
          </Suspense>
        </SmoothScroll>
      </div>
    </>
  );
}
