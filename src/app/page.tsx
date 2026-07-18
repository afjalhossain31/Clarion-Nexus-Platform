'use client';

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
    { number: '01', title: 'Strategy & Mockup', desc: 'Detailed wireframes matching light/dark systems are crafted in Figma.' },
    { number: '02', title: 'Secure Engineering', desc: 'Next.js rendering hooks and Mongoose schemas are constructed.' },
    { number: '03', title: 'Agentic Embedding', desc: 'Cognitive chatbots and prompt generator frameworks are linked.' },
    { number: '04', title: 'Audit & Live Launch', desc: 'Pristine SEO indexing runs and the production build goes online.' }
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
      quote: "Nexus team turned our legacy e-commerce site into a speed champion. Organic traffic jumped 180% within days of technical SEO audits.",
      author: "Sarah Jenkins",
      role: "Founder, Zenith Apparel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      quote: "The custom chatbot widget built on Gemini has automated 80% of our customer onboarding queries, saving us tons of staff hours weekly.",
      author: "Marcus Chen",
      role: "Operations Lead, CloudCore",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
    }
  ];

  return (
    <div className="w-full flex flex-col overflow-hidden">
      
      {/* 1. Hero Section (staggered fade-up, background floaters, CTAs) */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center pt-20 pb-16 px-4 md:px-8 border-b border-card-border/40 bg-radial-gradient">
        {/* Floating Background Blobs */}
        <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 h-72 w-72 rounded-full bg-brand-purple/10 blur-3xl" />

        <div className="mx-auto max-w-5xl text-center z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-brand-blue bg-brand-blue/10 border border-brand-blue/15 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven Full Stack Development Agency</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-app-fg mb-6 max-w-4xl"
          >
            Engineered with Designs & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">Cognitive AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-app-fg/70 max-w-2xl mb-8 leading-relaxed"
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
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 hover:scale-[1.02] active:scale-98 transition-all duration-200"
            >
              Explore Services
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>

            {!isAuthenticated && (
              <button
                onClick={() => demoLogin('client')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold border border-card-border bg-card-bg/40 text-app-fg hover:bg-card-border/60 hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer"
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

          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 timeline-gradient hidden md:block" />

            <div className="space-y-12">
              {processSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col md:flex-row items-stretch ${
                    idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Space filler */}
                  <div className="hidden md:block w-1/2" />
                  
                  {/* Timeline Badge */}
                  <div className="flex justify-start md:justify-center items-center relative z-10 my-4 md:my-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple text-white flex items-center justify-center font-bold text-sm shadow-md border-4 border-app-bg">
                      {step.number}
                    </div>
                  </div>

                  {/* Timeline content block */}
                  <div className="w-full md:w-1/2 md:px-8">
                    <div className="p-6 rounded-2xl border border-card-border bg-card-bg hover:border-brand-purple transition-all duration-300">
                      <h3 className="font-display text-base font-bold text-app-fg mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-app-fg/70 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* 8. Final CTA Section */}
      <section className="py-24 px-4 md:px-8 bg-radial-gradient text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-brand-blue/5 blur-3xl" />
        <div className="mx-auto max-w-4xl z-10 relative">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-app-fg mb-6 leading-tight">
            Ready to Accelerate Your Digital Footprint?
          </h2>
          <p className="text-sm sm:text-base text-app-fg/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Register a standard client account or explore our full catalog of web designs, SEO optimization systems, and chatbot automation frameworks.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/explore"
              className="flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all duration-200"
            >
              Get Started Now
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
