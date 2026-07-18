'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';

// Inline SVG brand icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linksServices = [
    { label: 'Web Development', href: '/explore?category=web-development' },
    { label: 'UI/UX Systems', href: '/explore?category=ui-ux' },
    { label: 'AI Implementations', href: '/explore?category=ai' },
    { label: 'SEO Marketing', href: '/explore?category=seo' }
  ];

  const linksCompany = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Explore All', href: '/explore' }
  ];

  const linksLegal = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' }
  ];

  return (
    <footer className="relative w-full border-t border-card-border bg-card-bg/10 py-12 transition-colors duration-300 overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-t from-brand-blue/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="group flex items-center gap-2 w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple text-white group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                Clarion Nexus
              </span>
            </Link>
            <p className="text-sm text-app-fg/60 leading-relaxed max-w-xs">
              We design and construct digital products leveraging premium designs and next-generation agentic AI features.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-card-border/40 hover:bg-brand-blue hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/30 transition-all duration-300 text-app-fg/65">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-card-border/40 hover:bg-brand-purple hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-purple/30 transition-all duration-300 text-app-fg/65">
                <LinkedinIcon />
              </a>
              <a href="#" aria-label="GitHub" className="p-2 rounded-lg bg-card-border/40 hover:bg-app-fg hover:text-app-bg hover:-translate-y-1 hover:shadow-lg hover:shadow-app-fg/30 transition-all duration-300 text-app-fg/65">
                <GithubIcon />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-app-fg tracking-wide uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {linksServices.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-block text-sm text-app-fg/60 hover:text-brand-blue hover:translate-x-1.5 hover:font-medium transition-all duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-app-fg tracking-wide uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {linksCompany.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-block text-sm text-app-fg/60 hover:text-brand-blue hover:translate-x-1.5 hover:font-medium transition-all duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-semibold text-app-fg tracking-wide uppercase">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 text-sm text-app-fg/60">
              <div className="group flex items-center gap-3 cursor-pointer hover:text-brand-blue transition-colors duration-300">
                <div className="p-1.5 rounded-md bg-card-border/30 group-hover:bg-brand-blue/10 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-brand-blue group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span>hello@clarionnexus.com</span>
              </div>
              <div className="group flex items-center gap-3 cursor-pointer hover:text-brand-purple transition-colors duration-300">
                <div className="p-1.5 rounded-md bg-card-border/30 group-hover:bg-brand-purple/10 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-brand-purple group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="group flex items-center gap-3 cursor-pointer hover:text-brand-blue transition-colors duration-300">
                <div className="p-1.5 rounded-md bg-card-border/30 group-hover:bg-brand-blue/10 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-brand-blue group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span>Silicon Valley, CA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Area */}
        <div className="border-t border-card-border/60 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-app-fg/50">
            &copy; {currentYear} <span className="text-brand-blue/80 font-medium">Clarion Nexus</span>. All rights reserved.
          </p>
          <div className="flex gap-6">
            {linksLegal.map(l => (
              <a key={l.label} href={l.href} className="text-xs text-app-fg/50 hover:text-brand-blue transition-colors duration-300">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}