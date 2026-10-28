"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reveal-state", "visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );

    const observeRevealElements = (root: ParentNode) => {
      if (
        root instanceof Element &&
        root.matches("[data-reveal]") &&
        !root.hasAttribute("data-reveal-state")
      ) {
        root.setAttribute("data-reveal-state", "pending");
        revealObserver.observe(root);
      }

      root.querySelectorAll("[data-reveal]").forEach((element) => {
        if (element.hasAttribute("data-reveal-state")) return;
        element.setAttribute("data-reveal-state", "pending");
        revealObserver.observe(element);
      });
    };

    observeRevealElements(document);

    const contentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) observeRevealElements(node);
        });
      });
    });
    contentObserver.observe(document.body, { childList: true, subtree: true });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      autoRaf: true,
    });

    const marqueeTweens = gsap
      .utils.toArray<HTMLDivElement & { _marquee?: gsap.core.Tween }>(
        ".marquee-track"
      )
      .map((track) => track._marquee)
      .filter((tween): tween is gsap.core.Tween => Boolean(tween));
    const marqueeSpeed = { value: 1 };
    const setMarqueeSpeed = gsap.quickTo(marqueeSpeed, "value", {
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        marqueeTweens.forEach((tween) => tween.timeScale(marqueeSpeed.value));
      },
    });
    const syncScrollTrigger = () => ScrollTrigger.update();

    lenis.on("scroll", syncScrollTrigger);
    lenis.on("scroll", (event: { velocity: number }) => {
      setMarqueeSpeed(1 + Math.abs(event.velocity) * 0.5);
    });

    return () => {
      lenis.off("scroll", syncScrollTrigger);
      lenis.destroy();
      contentObserver.disconnect();
      revealObserver.disconnect();
      gsap.killTweensOf(marqueeSpeed);
      marqueeTweens.forEach((tween) => tween.timeScale(1));
    };
  }, []);

  return <>{children}</>;
}
