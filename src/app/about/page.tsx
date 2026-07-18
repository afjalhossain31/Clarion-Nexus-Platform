'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      icon: <Trophy className="h-6 w-6 text-brand-blue" />,
      title: 'Pioneering UX Quality',
      desc: 'We reject standard placeholders. All design grids, font variables, and theme transitions are curated to wow clients.'
    },
    {
      icon: <Cpu className="h-6 w-6 text-brand-purple" />,
      title: 'Agentic AI Workflows',
      desc: 'We integrate advanced LLMs like Google Gemini to automate text compilation, support chatting, and data intelligence.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-blue" />,
      title: 'Enterprise Architecture',
      desc: 'Our Node, Express, Mongoose, and Next.js applications are secure, responsive, and performance optimized.'
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Intro Section */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1 bg-brand-blue/10 text-brand-blue rounded-full px-3 py-1 text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Digital Journey</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-app-fg mb-6 tracking-tight">
          Blending Technical Precision with Intelligent Solutions
        </h1>
        <p className="text-sm sm:text-base text-app-fg/70 leading-relaxed">
          Clarion Nexus was founded as a boutique digital agency to build high-performance full-stack websites, technical search engine mappings, and state-of-the-art cognitive AI pipeline integrations.
        </p>
      </div>

      {/* Grid Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
        {pillars.map((p, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-card-border bg-card-bg/40 hover:border-brand-purple transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card-border/50 mb-5">
              {p.icon}
            </div>
            <h3 className="font-display text-base font-bold text-app-fg mb-2">{p.title}</h3>
            <p className="text-xs sm:text-sm text-app-fg/70 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Narrative Panel Section */}
      <div className="rounded-2xl border border-card-border bg-card-bg/60 p-8 sm:p-10 flex flex-col md:flex-row items-center gap-10 text-left mb-16">
        <div className="flex-1">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-app-fg mb-4">
            Our Mission Statement
          </h2>
          <p className="text-xs sm:text-sm text-app-fg/70 leading-relaxed mb-6">
            We believe that modern enterprise software should not only execute business requests securely but should also offer intelligent assistance out-of-the-box. Every solution we deploy includes responsive UI systems, search-friendly metadata structures, and conversational intelligence modules.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-purple transition-colors"
          >
            Connect With Our Team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="h-40 w-40 rounded-full bg-gradient-to-tr from-brand-blue/10 to-brand-purple/10 border-4 border-card-border flex items-center justify-center animate-pulse">
            <Sparkles className="h-10 w-10 text-brand-purple" />
          </div>
        </div>
      </div>

    </div>
  );
}
