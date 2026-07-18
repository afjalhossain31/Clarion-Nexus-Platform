'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, API_URL } from '../../context/AuthContext';
import { Sparkles, FileText, Download, RefreshCw, AlertCircle, Loader, HelpCircle } from 'lucide-react';

export default function GenerateProposalPage() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();

  // Parameter states
  const [businessType, setBusinessType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');

  // Generator states
  const [proposal, setProposal] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setProposal('');

    if (!businessType.trim() || !requirements.trim()) {
      setErrorMsg('Please specify both the business type and specific requirements.');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          businessType,
          requirements,
          tone,
          length
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Generation failed');
      }

      const data = await res.json();
      setProposal(data.proposal);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!proposal) return;

    // Create client-side file download
    const element = document.createElement('a');
    const file = new Blob([proposal], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    // Create clean file name based on input
    const cleanName = businessType.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    element.download = `nexus_proposal_${cleanName}.md`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Convert markdown-ish headers to styled elements in previewer
  const renderStyledProposal = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-bold text-app-fg mb-4 border-b border-card-border pb-2 mt-4">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-bold text-app-fg mt-6 mb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-semibold text-app-fg mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-app-fg/85 mb-1">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs sm:text-sm text-app-fg/80 leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="flex flex-col gap-2 mb-10 text-left">
        <h1 className="font-display text-3xl font-extrabold text-app-fg tracking-tight sm:text-4xl">
          AI Proposal Builder
        </h1>
        <p className="text-sm text-app-fg/60 max-w-xl">
          Generate structured, agency-grade client proposals in seconds. Adjust communication styles and output lengths dynamically.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Parameters Form (Left Column) */}
        <div className="lg:col-span-5 rounded-2xl border border-card-border bg-card-bg/60 p-6 shadow-xl backdrop-blur-xs">
          
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border w-fit mb-6 select-none bg-app-bg text-app-fg/60 border-card-border">
            Configuration Panel
          </div>

          {errorMsg && (
            <div className="mb-6 flex gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-500 items-start text-left">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-5 text-left">
            
            {/* Business Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                Client Business Type *
              </label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Organic Coffee Shop, Dental Clinic, AI SaaS Startup"
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                required
              />
            </div>

            {/* Scope Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                Scope & Requirements *
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe project details, e.g. a next.js e-commerce checkout site, google search indexing optimization, UI/UX system..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                required
              />
            </div>

            {/* Tone & Length parameters row */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Tone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                  Drafting Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="rounded-xl border border-card-border bg-app-bg px-3 py-2.5 text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                >
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="corporate">Corporate</option>
                  <option value="friendly">Friendly</option>
                  <option value="modern">Modern</option>
                </select>
              </div>

              {/* Length */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-app-fg/60 pl-1">
                  Draft Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="rounded-xl border border-card-border bg-app-bg px-3 py-2.5 text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
                >
                  <option value="short">Short (~150 words)</option>
                  <option value="medium">Medium (~350 words)</option>
                  <option value="long">Long (~600 words)</option>
                </select>
              </div>

            </div>

            {/* Generate Trigger */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-4.5 w-4.5 animate-spin" />
                  Generating Draft...
                </>
              ) : (
                <>
                  Generate Proposal
                  <Sparkles className="h-4.5 w-4.5" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Proposal Document Previewer (Right Column) */}
        <div className="lg:col-span-7 flex flex-col h-full rounded-2xl border border-card-border bg-card-bg/60 shadow-xl backdrop-blur-xs overflow-hidden min-h-[460px]">
          
          {/* Previewer Header */}
          <div className="flex items-center justify-between border-b border-card-border px-5 py-4.5 bg-card-bg">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-blue" />
              <span className="text-sm font-bold text-app-fg">Proposal Draft Document</span>
            </div>

            {proposal && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-card-border bg-card-bg/40 text-app-fg hover:bg-card-border/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  title="Download Markdown Document"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download MD
                </button>
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="p-2 rounded-xl text-app-fg/60 border border-card-border bg-card-bg/40 hover:bg-card-border/60 hover:text-brand-purple transition-colors disabled:opacity-50"
                  title="Regenerate proposal draft"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Preview Content Area */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[500px] text-left">
            {isGenerating ? (
              <div className="flex h-full items-center justify-center text-app-fg/40 gap-2 flex-col pt-20">
                <Loader className="h-8 w-8 animate-spin text-brand-blue mb-2" />
                <p className="text-sm font-semibold">Gemini is compiling requirements...</p>
                <p className="text-[10px] text-app-fg/50">Structuring scopes, process timelines, and agency quotes.</p>
              </div>
            ) : proposal ? (
              <article className="prose prose-sm dark:prose-invert max-w-none">
                {renderStyledProposal(proposal)}
              </article>
            ) : (
              <div className="flex h-full items-center justify-center text-app-fg/30 flex-col py-24 text-center">
                <FileText className="h-10 w-10 text-app-fg/20 mb-3" />
                <h4 className="text-sm font-bold mb-1 text-app-fg/50">No Document Generated</h4>
                <p className="text-xs text-app-fg/40 max-w-xs leading-relaxed">
                  Fill in your client business category and specifications on the left, then click Generate to construct an enterprise-grade proposal scope outline.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
