'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Loader } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('web-development');
  const [message, setMessage] = useState('');

  // Form states
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please populate all required form inputs.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please supply a valid email address.');
      return;
    }

    setLoading(true);

    // Simulate sending message to team
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1 bg-brand-purple/10 text-brand-purple rounded-full px-3 py-1 text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Connect With Clarion</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-app-fg mb-4 tracking-tight">
          Let's Build Something Enterprise-Grade
        </h1>
        <p className="text-sm text-app-fg/60">
          Have an inquiry, custom design request, or database project? Connect with our development engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
        
        {/* Info Grid (Left/Top Column) */}
        <div className="md:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-card-border bg-card-bg/40 text-left">
          
          <div>
            <h3 className="font-display text-lg font-bold text-app-fg mb-4">Contact Information</h3>
            <p className="text-xs sm:text-sm text-app-fg/60 leading-relaxed mb-8">
              Fill out the form and our technical architect will get in touch with you within 24 business hours.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 border border-brand-blue/15 text-brand-blue flex-shrink-0">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-app-fg/50 tracking-wider">Email Support</span>
                <span className="text-xs sm:text-sm font-semibold text-app-fg">hello@clarionnexus.com</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/10 border border-brand-purple/15 text-brand-purple flex-shrink-0">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-app-fg/50 tracking-wider">Call Directly</span>
                <span className="text-xs sm:text-sm font-semibold text-app-fg">+1 (555) 234-5678</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 border border-brand-blue/15 text-brand-blue flex-shrink-0">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-app-fg/50 tracking-wider">Our Studio</span>
                <span className="text-xs sm:text-sm font-semibold text-app-fg">Silicon Valley, CA</span>
              </div>
            </div>
          </div>

          <div className="border-t border-card-border/50 pt-6 mt-8 text-[11px] text-app-fg/45 font-medium">
            Official agency working hours: 9 AM - 6 PM PST.
          </div>

        </div>

        {/* Contact Form (Right/Bottom Column) */}
        <div className="md:col-span-7 rounded-2xl border border-card-border bg-card-bg/60 p-6 sm:p-8 shadow-xl backdrop-blur-xs text-left">
          
          {submitted ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <CheckCircle2 className="h-14 w-14 text-green-500 mb-4 animate-bounce" />
              <h3 className="font-display text-lg font-bold text-app-fg mb-2">Message Sent Successfully!</h3>
              <p className="text-xs text-app-fg/60 max-w-xs leading-relaxed">
                Thank you for contacting Clarion Nexus. Our team will review your project requirements and reply shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-4 py-2.5 rounded-xl text-xs font-semibold border border-card-border bg-card-bg/40 text-app-fg hover:bg-card-border/60 transition cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {errorMsg && (
                <div className="flex gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-500 items-start">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                    required
                  />
                </div>
              </div>

              {/* Project Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                  Project Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-card-border bg-app-bg px-3.5 py-2.5 text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                >
                  <option value="web-development">Web Development</option>
                  <option value="ui-ux">UI/UX Systems Design</option>
                  <option value="ai">AI agent Integration</option>
                  <option value="seo">SEO Audit Optimization</option>
                  <option value="marketing">Digital Marketing Copy</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                  Your Inquiry *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline the details of your inquiry or scope milestones..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
