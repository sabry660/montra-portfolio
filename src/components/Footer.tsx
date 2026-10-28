"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter, Instagram, Mail, MessageCircle, Facebook } from "lucide-react";
import gsap from "gsap";
import { SITE_CONTENT } from "@/data/siteContent";

const FOOTER_NAV = SITE_CONTENT.navigation.filter(
  (link) => link.href !== "#contact" && link.href !== "#privacy-policy"
);

function MagneticIcon({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  href?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(ref.current, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  return (
    <a
      ref={ref}
      href={href || "#"}
      className="magnetic-icon"
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Icon size={20} />
    </a>
  );
}

export default function Footer() {
  const footerLinks = [
    {
      label: "WhatsApp",
      href: SITE_CONTENT.contact.whatsapp ? `https://wa.me/${SITE_CONTENT.contact.whatsapp}` : "#contact",
      icon: MessageCircle,
    },
    {
      label: "Email",
      href: SITE_CONTENT.contact.email ? `mailto:${SITE_CONTENT.contact.email}` : "#contact",
      icon: Mail,
    },
    {
      label: "Facebook",
      href: SITE_CONTENT.contact.social?.facebook || "#contact",
      icon: Facebook,
    },
    {
      label: "Instagram",
      href: SITE_CONTENT.contact.social?.instagram || "#contact",
      icon: Instagram,
    },
    {
      label: "LinkedIn",
      href: SITE_CONTENT.contact.social?.linkedin || "#contact",
      icon: Linkedin,
    },
  ];

  const hasSocialLinks = footerLinks.some((link) => link.href !== "#contact");

  return (
    <footer className="border-t border-white/5 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="mb-12 text-center lg:text-left">
          <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
            <Image src="/logo.png" alt="Montra logo" width={44} height={44} className="h-11 w-11 object-contain" />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {SITE_CONTENT.brand.name}
            </h2>
          </div>
          <p className="mb-6 text-sm text-text/60">{SITE_CONTENT.brand.description}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {footerLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-text transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div>
            <h4
              className="mb-4 text-sm font-bold uppercase tracking-widest text-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Navigation
            </h4>
            <ul className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-6">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-link inline-flex">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/5" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center lg:relative lg:justify-center">
          {hasSocialLinks && (
            <div className="flex gap-4 lg:absolute lg:left-0">
              {SITE_CONTENT.contact.social?.github && (
                <MagneticIcon icon={Github} label="GitHub" href={SITE_CONTENT.contact.social.github} />
              )}
              {SITE_CONTENT.contact.social?.linkedin && (
                <MagneticIcon icon={Linkedin} label="LinkedIn" href={SITE_CONTENT.contact.social.linkedin} />
              )}
              {SITE_CONTENT.contact.social?.twitter && (
                <MagneticIcon icon={Twitter} label="Twitter" href={SITE_CONTENT.contact.social.twitter} />
              )}
              {SITE_CONTENT.contact.social?.instagram && (
                <MagneticIcon icon={Instagram} label="Instagram" href={SITE_CONTENT.contact.social.instagram} />
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
            <p className="text-center text-sm text-text/30" style={{ fontFamily: "var(--font-mono)" }}>
              &copy; {new Date().getFullYear()} {SITE_CONTENT.brand.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
