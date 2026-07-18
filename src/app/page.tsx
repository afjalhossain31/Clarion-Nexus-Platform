'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Sparkles, ArrowRight, CheckCircle2, Star, Plus, Minus,
  Layers, Cpu, Zap, Trophy, Shield, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { useAuth, API_URL } from '../context/AuthContext';

// Define service interface matching our backend schema
interface ServiceItem {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: 'web-development' | 'seo' | 'ui-ux' | 'marketing' | 'ai';
  priceFrom: number;
  deliveryDays: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

export default function LandingPage() {
  const { isAuthenticated, demoLogin } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // 1. Fetch featured services (limit 4)
  const { data: featuredServices, isLoading } = useQuery<ServiceItem[]>({
    queryKey: ['featuredServices'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/services`);
      if (!res.ok) throw new Error('Failed to load featured services');
      return res.json();
    }
  });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Predefined static elements
  const whyUsData = [
    {
      icon: <Layers className="h-6 w-6 text-brand-blue" />,
      title: 'Full-Stack Excellence',
      description: 'We control the full software pipeline from architectural design to deployment databases.'
    },
    {
      icon: <Cpu className="h-6 w-6 text-brand-purple" />,
      title: 'Cognitive LLM Pipelines',
      description: 'We integrate advanced models (Gemini) directly into client dashboard scripts.'
    },
    {
      icon: <Zap className="h-6 w-6 text-brand-blue" />,
      title: 'Performance Optimization',
      description: 'Blazing-fast page speeds achieving pristine Lighthouse metrics and Google rank.'
    }
  ];

  const statsData = [
    { value: '150+', label: 'Projects Delivered' },
    { value: '99.2%', label: 'Success Rating' },
    { value: '25+', label: 'Custom AI Agents' },
    { value: '4.9★', label: 'Client Feedback' }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Strategy & Mockup',
      icon: '🎨',
      desc: 'Detailed wireframes matching light/dark systems are crafted in Figma.',
      detail: 'We begin with deep discovery sessions, persona mapping, competitive audits, and interactive Figma prototypes in both light and dark themes — signed off before a single line of code is written.'
    },
    {
      number: '02',
      title: 'Secure Engineering',
      icon: '⚙️',
      desc: 'Next.js rendering hooks and Mongoose schemas are constructed.',
      detail: 'Our engineers implement server-side rendering, REST APIs with Express, JWT authentication, Mongoose schemas, and airtight input validation — all following OWASP security practices.'
    },
    {
      number: '03',
      title: 'Agentic AI Embedding',
      icon: '🤖',
      desc: 'Cognitive chatbots and prompt generator frameworks are linked.',
      detail: 'We connect Google Gemini or OpenAI APIs to your platform — building streaming chat widgets, context-aware document summarizers, and automated content generation pipelines.'
    },
    {
      number: '04',
      title: 'Audit & Live Launch',
      icon: '🚀',
      desc: 'Pristine SEO indexing runs and the production build goes online.',
      detail: 'Final phase covers Lighthouse audits (100 scores target), structured schema markup, Vercel/Render deployment, environment hardening, and a full post-launch monitoring dashboard.'
    }
  ];

  const FAQItems = [
    {
      q: 'What is the proposal generator and how do I use it?',
      a: 'Our AI Proposal Generator is a premium content builder. By entering your business category, scope details, and preferred communication style, our integrated Gemini API creates a download-ready client proposal in seconds.'
    },
    {
      q: 'Do I get complete codebase files on delivery?',
      a: 'Yes, all custom platforms developed by Clarion Nexus come with 100% intellectual property ownership, Git repository transfer, and complete environment configuration files.'
    },
    {
      q: 'Can I request edits on existing requests?',
      a: 'Absolutely. Clients can view, track status (pending, in-progress, completed), and delete custom submissions inside their "Manage Work" panel at any time.'
    },
    {
      q: 'Does Clarion Nexus integrate databases in their services?',
      a: 'Yes, we specialize in Node.js architectures utilizing Mongoose and MongoDB backend catalogs for robust storage and secure token operations.'
    }
  ];

  const testimonials = [
    {
      quote:
        "Clarion Nexus Platforms completely transformed our outdated business portal into a modern, high-performance web application. Their attention to detail and technical expertise exceeded our expectations.",
      author: "Sarah Williams",
      role: "CEO, BrightEdge Solutions",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote:
        "The AI automation system developed by the team reduced our manual workload by over 70%. The implementation was smooth, secure, and delivered real business value.",
      author: "Michael Carter",
      role: "Operations Manager, NovaTech",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote:
        "From UI/UX design to cloud deployment, every stage of the project was handled professionally. The final product was fast, responsive, and beautifully designed.",
      author: "Emily Rodriguez",
      role: "Product Director, VisionLabs",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote:
        "Working with Clarion Nexus Platforms was one of the best technology investments we've made. Their AI-powered solutions helped us automate workflows and improve customer satisfaction significantly.",
      author: "Daniel Thompson",
      role: "Founder, Apex Digital",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  return (
    <div className="w-full flex flex-col overflow-hidden">

      {/* 1. Hero Section */}

      <section className="relative w-full min-h-[80vh] flex items-center justify-center pt-20 pb-16 px-4 md:px-8 border-b border-card-border/40 overflow-hidden">

        {/* ── Background Banner Image ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/banner.png"
            alt="Clarion Nexus Background"
            fill
            priority
            quality={85}
            className="object-cover scale-[1.03]"
          />
          {/* Dark + blur overlay so text is readable */}
          <div className="absolute inset-0 bg-app-bg/70 backdrop-blur-sm" />
          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-app-bg/30 to-app-bg/90" />
        </div>

        {/* Floating colour blobs on top of overlay */}
        <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl z-10" />
        <div className="absolute bottom-1/4 right-1/10 h-72 w-72 rounded-full bg-brand-purple/10 blur-3xl z-10" />

        <div className="mx-auto max-w-5xl text-center z-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-brand-blue bg-brand-blue/10 border border-brand-blue/15 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven Full Stack Development Agency</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-app-fg mb-6 max-w-4xl drop-shadow-lg dark:drop-shadow-none"
          >
            Engineered with Designs &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">Cognitive AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-app-fg/80 max-w-2xl mb-8 leading-relaxed drop-shadow dark:drop-shadow-none"
          >
            We construct premium full-stack web applications, UI/UX systems, search engine mappings, and state-of-the-art agentic AI automation scripts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/explore"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 hover:scale-[1.03] active:scale-98 transition-all duration-200"
            >
              Explore Services
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>

            {!isAuthenticated && (
              <button
                onClick={() => demoLogin('client')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold border border-app-fg/20 bg-app-bg/50 text-app-fg hover:bg-app-fg/5 hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                Instant Demo Access
              </button>
            )}
          </motion.div>
        </div>
      </section>


      {/* 2. Featured Services Grid Section */}
      <section className="py-20 px-4 md:px-8 border-b border-card-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-app-fg sm:text-4xl">
              Featured Expertise
            </h2>
            <p className="mt-4 text-app-fg/60 text-sm sm:text-base max-w-2xl mx-auto">
              Our curated catalog of digital agency solutions is built using modern frameworks.
            </p>
          </div>

          {isLoading ? (
            // Skeleton Loader (4 Cards)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-standard animate-pulse min-h-[360px]">
                  <div className="h-40 bg-card-border/60 rounded-xl mb-4" />
                  <div className="h-5 bg-card-border/80 w-3/4 rounded mb-2" />
                  <div className="h-4 bg-card-border/60 w-5/6 rounded mb-1" />
                  <div className="h-4 bg-card-border/60 w-2/3 rounded mb-6" />
                  <div className="mt-auto h-9 bg-card-border/80 rounded-lg w-full" />
                </div>
              ))}
            </div>
          ) : (
            // Cards Grid (4 per row on desktop)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices?.map((service) => (
                <div key={service._id} className="card-standard flex flex-col justify-between min-h-[385px]">
                  <div>
                    {/* Service Image */}
                    <div className="h-36 w-full rounded-xl overflow-hidden mb-4 relative bg-card-border">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                        {service.category.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Metadata rating */}
                    <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="font-semibold text-app-fg/80">{service.rating}</span>
                      <span className="text-app-fg/40">({service.reviewCount} reviews)</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-base font-bold text-app-fg tracking-tight mb-2">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-app-fg/70 leading-relaxed line-clamp-3">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Pricing and view detail */}
                  <div className="mt-6 pt-3 border-t border-card-border/30 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-app-fg/55 uppercase font-semibold">Starts From</p>
                      <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                        ${service.priceFrom}
                      </p>
                    </div>
                    <Link
                      href={`/services/${service._id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-purple transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-blue/5 border border-transparent hover:border-brand-blue/10"
                    >
                      Details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-20 px-4 md:px-8 border-b border-card-border/40 bg-card-bg/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-app-fg sm:text-4xl">
              Why Choose Clarion Nexus
            </h2>
            <p className="mt-4 text-app-fg/60 text-sm sm:text-base max-w-2xl mx-auto">
              Our core values guide us in delivering production-ready, highly compliant digital software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUsData.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-card-border bg-card-bg/50 backdrop-blur-xs transition-all duration-300 hover:border-brand-blue hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card-border/50 mb-6">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-app-fg mb-3">{item.title}</h3>
                <p className="text-sm text-app-fg/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats Counter Section */}
      <section className="py-16 px-4 md:px-8 border-b border-card-border/40 bg-gradient-to-r from-brand-blue/5 to-brand-purple/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statsData.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1.5 p-4 rounded-xl border border-card-border/20 bg-card-bg/30">
                <span className="font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-app-fg/75 font-medium tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process Timeline ("How we work" process timeline) */}
      <section className="py-20 px-4 md:px-8 border-b border-card-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-app-fg sm:text-4xl">
              Our Development Lifecycle
            </h2>
            <p className="mt-4 text-app-fg/60 text-sm sm:text-base max-w-2xl mx-auto">
              How we execute projects from conceptual mockups to live search optimization.
            </p>
          </div>

          {/* Interactive Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {processSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              const gradients = [
                'from-blue-500/20 to-brand-blue/5',
                'from-brand-purple/20 to-purple-500/5',
                'from-cyan-500/20 to-blue-500/5',
                'from-emerald-500/20 to-teal-500/5',
              ];
              const borderColors = [
                'hover:border-brand-blue group-hover:text-brand-blue',
                'hover:border-brand-purple group-hover:text-brand-purple',
                'hover:border-cyan-500 group-hover:text-cyan-400',
                'hover:border-emerald-500 group-hover:text-emerald-400',
              ];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => setActiveStep(isActive ? null : idx)}
                  className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 bg-card-bg/60 backdrop-blur-xs
                    ${isActive ? `border-brand-blue bg-gradient-to-br ${gradients[idx]} shadow-lg shadow-brand-blue/10` : `border-card-border ${borderColors[idx]}`}`}
                >
                  {/* Step number badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold text-white bg-gradient-to-tr from-brand-blue to-brand-purple shadow`}>
                        {step.number}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-app-fg/30 group-hover:text-brand-blue transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.div>
                  </div>

                  <h3 className="font-display text-base font-bold text-app-fg mb-2 group-hover:text-brand-blue transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-app-fg/60 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-card-border/60">
                          <p className="text-xs text-app-fg/80 leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeStepLine"
                      className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 px-4 md:px-8 border-b border-card-border/40 bg-card-bg/25">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-app-fg sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-4 text-app-fg/60 text-sm sm:text-base max-w-2xl mx-auto">
              Read verified testimonials from clients who scaled their systems using Clarion Nexus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-card-border bg-card-bg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic text-app-fg/80 leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-card-border/50">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="h-10 w-10 rounded-full border border-card-border bg-app-bg"
                  />
                  <div>
                    <h4 className="font-display text-sm font-bold text-app-fg">{t.author}</h4>
                    <p className="text-xs text-app-fg/55">{t.role}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded-full uppercase">
                    Verified Client
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section (Framer Motion Accordions) */}
      <section className="py-20 px-4 md:px-8 border-b border-card-border/40">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-app-fg">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-app-fg/60 text-sm">
              Quick answers about our scope limits, databases, and LLM integrations.
            </p>
          </div>

          <div className="space-y-4">
            {FAQItems.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-card-border bg-card-bg overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between px-6 py-4.5 text-left font-display font-bold text-sm text-app-fg hover:text-brand-blue focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-brand-blue flex-shrink-0" />
                    ) : (
                      <Plus className="h-4 w-4 text-brand-blue flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-app-fg/75 border-t border-card-border/20 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 8. Interactive CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-app-bg overflow-hidden text-center border-t border-card-border/40">

        {/* Animated Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 blur-[120px] pointer-events-none"
        />

        <div className="relative mx-auto max-w-4xl z-10 flex flex-col items-center">

          {/* Floating Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/5 text-brand-purple text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Let's Build the Future</span>
          </motion.div>

          {/* Main Heading with Gradient Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-app-fg mb-6 leading-[1.1] tracking-tight"
          >
            Ready to Accelerate Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
              Digital Footprint?
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-app-fg/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Register a standard client account or explore our full catalog of web designs, SEO optimization systems, and chatbot automation frameworks.
          </motion.p>

          {/* Action Buttons Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Button */}
            <Link
              href="/explore"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            {/* Secondary Button */}
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-app-fg bg-card-bg/50 border border-card-border backdrop-blur-sm hover:bg-card-border/50 hover:-translate-y-1 transition-all duration-300"
            >
              Talk to an Expert
            </Link>
          </motion.div>

        </div>
      </section>


    </div>
  );
}
