'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, API_URL } from '../../../context/AuthContext';
import { Sparkles, FileSpreadsheet, DollarSign, Image, Clipboard, AlertCircle, Loader } from 'lucide-react';

export default function AddRequestPage() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [budget, setBudget] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // UX states
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authenticated guard check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-app-fg/60 gap-2">
        <Loader className="h-5 w-5 animate-spin text-brand-blue" />
        <span className="text-sm font-medium">Checking session...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation checks
    if (!title.trim() || !shortDesc.trim() || !fullDesc.trim() || !budget) {
      setFormError('Please populate all required form inputs.');
      return;
    }

    const budgetNum = Number(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setFormError('Budget must represent a positive currency value.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          shortDesc,
          fullDesc,
          budget: budgetNum,
          imageUrl: imageUrl.trim() || undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Could not save project request');
      }

      // Success - redirect to management dashboard
      router.push('/items/manage');
    } catch (err: any) {
      setFormError(err.message || 'Connection error submitting form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="flex flex-col gap-2 mb-8 text-left">
        <h1 className="font-display text-3xl font-extrabold text-app-fg tracking-tight sm:text-4xl">
          Submit Custom Project Request
        </h1>
        <p className="text-sm text-app-fg/60">
          Describe the scope of work you want designed. Our project team and NexusAI advisor will draft a development estimate.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-card-border bg-card-bg/60 p-6 sm:p-8 shadow-xl backdrop-blur-xs">
        
        {formError && (
          <div className="mb-6 flex gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-500 items-start text-left">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* Project Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
              Project Title *
            </label>
            <div className="relative">
              <Clipboard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-app-fg/40" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real Estate Client CRM Portal"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30"
                required
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
              Short Summary *
            </label>
            <input
              type="text"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="e.g. Next.js dashboard with Stripe and Mapbox mapping..."
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30"
              maxLength={150}
              required
            />
            <p className="text-[10px] text-app-fg/40 pl-1">Max 150 characters for catalog displays.</p>
          </div>

          {/* Budget & Optional Image Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                Estimated Budget (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-fg/40" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="2500"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30"
                  required
                />
              </div>
            </div>

            {/* Optional Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                Reference Image URL (Optional)
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-fg/40" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/mock.png"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                />
              </div>
            </div>

          </div>

          {/* Full Scope Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
              Full Requirements Scope *
            </label>
            <textarea
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Provide a comprehensive listing of features, endpoints, design assets, database persistence requirements, and integration milestones you expect in the build..."
              rows={6}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 whitespace-pre-wrap"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <Loader className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <>
                Submit Project Request
                <Sparkles className="h-4.5 w-4.5" />
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}
