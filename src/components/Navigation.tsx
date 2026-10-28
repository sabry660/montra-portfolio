"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONTENT } from "@/data/siteContent";

const NAV_LINKS = SITE_CONTENT.navigation;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#hero");
  const [isClient, setIsClient] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    let frameId = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const activationLine = window.scrollY + Math.min(160, window.innerHeight * 0.3);
        const sections = NAV_LINKS.map((link) => document.querySelector<HTMLElement>(link.href))
          .filter((section): section is HTMLElement => section !== null);
        const currentSection = sections
          .filter((section) => section.getBoundingClientRect().top + window.scrollY <= activationLine)
          .at(-1) ?? sections[0];

        if (!currentSection) return;

        const nextActive = `#${currentSection.id}`;
        setActiveLink(nextActive);

        if (window.location.hash !== nextActive) {
          const url = new URL(window.location.href);
          url.hash = nextActive;
          window.history.replaceState({}, "", url.toString());
        }
      });
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen, isClient]);

  useEffect(() => {
    if (!isClient) return;

    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen, isClient]);

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    setMenuOpen(false);

    const section = document.querySelector(href) as HTMLElement | null;
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }

    const url = new URL(window.location.href);
    url.hash = href;
    window.history.replaceState({}, "", url.toString());
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setMenuOpen(false);
      hamburgerRef.current?.focus();
    }
  };

  if (!isClient) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a href="#hero" className="flex items-center gap-3" aria-label="Montra home">
            <Image src="/logo.png" alt="Montra logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-heading text-xl font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              {SITE_CONTENT.brand.name}
            </span>
          </a>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "nav-scrolled" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a
            href="#hero"
            onClick={(event) => {
              event.preventDefault();
              handleLinkClick("#hero");
            }}
            className="flex items-center gap-3"
            aria-label="Montra home"
          >
            <Image src="/logo.png" alt="Montra logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-heading text-xl font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              {SITE_CONTENT.brand.name}
            </span>
          </a>

          <div className="hidden items-center gap-5 whitespace-nowrap lg:flex lg:gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={cn("nav-link", activeLink === link.href && "active")}
                aria-current={activeLink === link.href ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              handleLinkClick("#contact");
            }}
            className="hero-cta hidden lg:mt-1 lg:inline-flex"
          >
            <span>{SITE_CONTENT.brand.hero.secondaryCta}</span>
            <ArrowRight size={16} className="hero-cta-arrow" />
          </a>

          <button
            ref={hamburgerRef}
            type="button"
            className={cn("relative z-[100] flex flex-col gap-[6px] rounded-full p-2 text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg lg:hidden", menuOpen && "hamburger-open")}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={cn("mobile-menu", menuOpen && "open")}
        onClick={handleBackdropClick}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="absolute right-6 top-6 z-[101] rounded-full p-2 text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          onClick={() => {
            setMenuOpen(false);
            hamburgerRef.current?.focus();
          }}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {NAV_LINKS.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(event) => {
              event.preventDefault();
              handleLinkClick(link.href);
            }}
            className={cn("mobile-menu-link", activeLink === link.href && "active")}
            aria-current={activeLink === link.href ? "page" : undefined}
            style={{ transitionDelay: menuOpen ? `${index * 0.08}s` : "0s" }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
