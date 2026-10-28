"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, X } from "lucide-react";
import { SITE_CONTENT } from "@/data/siteContent";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  useEffect(() => {
    if (!titleRef.current) return;

    const titleText = titleRef.current.textContent || "";
    titleRef.current.innerHTML = "";

    // Split into words then chars
    const words = titleText.split(" ");
    words.forEach((word, wi) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      for (const char of word) {
        const charSpan = document.createElement("span");
        charSpan.className = "hero-title-char";
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      }

      titleRef.current!.appendChild(wordSpan);
      if (wi < words.length - 1) {
        const space = document.createElement("span");
        space.innerHTML = "&nbsp;";
        space.className = "hero-title-char";
        titleRef.current!.appendChild(space);
      }
    });

    const chars = titleRef.current.querySelectorAll(".hero-title-char");

    // Set initial states
    gsap.set(chars, { opacity: 0, scale: 0, rotation: -15 });
    gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
    gsap.set(ctaRef.current, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(chars, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.05,
    });

    tl.to(
      subtitleRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    );

    tl.to(
      ctaRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.2"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "#0a0a0a" }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Decorative gradient circles */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center lg:px-8">
        {/* Logo */}
        <div className="mb-8 md:mb-12">
          <button
            onClick={() => setLogoModalOpen(true)}
            className="inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(255,77,0,0.12)] ring-1 ring-white/10 transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-32 md:w-32"
            aria-label="Open Montra logo"
          >
            <Image
              src="/logo.png"
              alt="Montra Logo"
              width={512}
              height={512}
              priority
              className="h-full w-full rounded-full object-cover object-center"
            />
          </button>
        </div>

        <p
          className="mb-6 hidden text-sm font-medium uppercase tracking-[0.3em] text-accent md:block"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {SITE_CONTENT.brand.hero.eyebrow}
        </p>

        <h1
          ref={titleRef}
          className="mb-8 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {SITE_CONTENT.brand.hero.headline}
        </h1>

        <p
          ref={subtitleRef}
          className="mb-12 max-w-2xl text-center text-base leading-relaxed text-text/60 md:text-lg"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {SITE_CONTENT.brand.hero.supportingText}
        </p>

        <div className="flex justify-center pt-2 md:pt-0">
          <a ref={ctaRef} href="#contact" className="hero-cta mt-2 sm:mt-0">
            <span>{SITE_CONTENT.brand.hero.primaryCta}</span>
            <ArrowRight size={16} className="hero-cta-arrow" />
          </a>
        </div>
      </div>

      {/* Logo Modal */}
      {logoModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLogoModalOpen(false)}
        >
          <div className="relative max-w-2xl max-h-full">
            <button
              onClick={() => setLogoModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-accent transition-colors"
              aria-label="Close"
            >
              <X size={32} />
            </button>
            <Image
              src="/logo.png"
              alt="Montra Logo"
              width={512}
              height={512}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
