"use client";

import { useEffect, useRef, memo, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = memo(function ProjectCard({
  project,
}: {
  project: (typeof PROJECTS)[0];
}) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="project-card relative" data-cursor="project" data-reveal="up">
      <div ref={imageRef} className="project-card-image project-card-image-reveal">
        <Image
          src={project.image}
          alt={project.title}
          fill
          loading="eager"
          sizes="(max-width: 1023px) 100vw, 400px"
          className="object-cover"
        />
        <div className="project-card-image-overlay" />
      </div>

      {/* Circular overlay for project name - clickable */}
      {project.liveDemo ? (
        <a
          href={project.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="rounded-full border-2 border-white/80 bg-black/80 px-6 py-3 text-center backdrop-blur-sm transition-transform hover:scale-105">
            <h3
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project.title}
            </h3>
            <p className="text-xs text-text/80 mt-1">{project.category}</p>
          </div>
        </a>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="rounded-full border-2 border-white/80 bg-black/80 px-6 py-3 text-center backdrop-blur-sm">
            <h3
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project.title}
            </h3>
            <p className="text-xs text-text/80 mt-1">{project.category}</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const totalWidth =
        trackRef.current!.scrollWidth - sectionRef.current!.offsetWidth;

      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative overflow-hidden pt-16 md:pt-24" suppressHydrationWarning>
      {/* Section header — visible on all sizes */}
      <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <p
          className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-accent"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Selected Work
        </p>
        <h2
          className="text-4xl font-bold md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Projects
        </h2>
      </div>

      {/* Desktop: horizontal scroll track */}
      <div
        ref={trackRef}
        className="hidden lg:flex items-end gap-10 pb-24"
        style={{ paddingLeft: "max(2rem, calc((100vw - 80rem) / 2 + 1.5rem))", paddingRight: "2rem" }}
      >
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Mobile/Tablet: carousel with arrows */}
      <div className="lg:hidden px-0 pb-16">
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {PROJECTS.map((project) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-4 mt-4 px-6">
            <button
              onClick={prevProject}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-accent text-black hover:bg-accent/90 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="flex gap-2 overflow-x-auto max-w-[200px]">
              {PROJECTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 w-3 rounded-full transition-colors flex-shrink-0 ${
                    index === currentIndex ? "bg-accent" : "bg-white/20"
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextProject}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-accent text-black hover:bg-accent/90 transition-colors"
              aria-label="Next project"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
