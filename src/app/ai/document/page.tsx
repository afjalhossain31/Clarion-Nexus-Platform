'use client';

import React, { useState } from 'react';
import { Upload, FileText, Loader2, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { API_URL } from '../../../context/AuthContext';

// Safe markdown-line renderer — no dynamic JSX tag, fully Vercel compatible
function renderMarkdownLine(line: string, i: number) {
  if (line.startsWith('### ')) return <h5 key={i} className="mt-5 mb-2 text-base font-bold text-app-fg">{line.slice(4)}</h5>;
  if (line.startsWith('## '))  return <h4 key={i} className="mt-6 mb-3 text-lg font-bold text-app-fg">{line.slice(3)}</h4>;
  if (line.startsWith('# '))  return <h3 key={i} className="mt-8 mb-4 text-xl font-bold text-app-fg">{line.slice(2)}</h3>;
  if (line.startsWith('- ') || line.startsWith('* '))
    return <li key={i} className="ml-5 mb-1 list-disc text-app-fg/80">{line.slice(2)}</li>;
  if (line.startsWith('| '))
    return <p key={i} className="font-mono text-xs text-app-fg/70 bg-app-bg/50 px-2 py-1 my-0.5 rounded">{line}</p>;
  if (!line.trim()) return <br key={i} />;
  return <p key={i} className="mb-2 leading-relaxed text-app-fg/85">{line}</p>;
}

export default function DocumentIntelligencePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSummary(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch(`${API_URL}/ai/document`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Analysis failed');

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple mb-4">
          AI Document Intelligence
        </h1>
        <p className="text-app-fg/70 text-lg max-w-2xl mx-auto">
          Upload any PDF or Text document. Nexus AI will read it, extract key points, action items, and tables instantly.
        </p>
      </div>

      <div className="bg-card-bg/40 border border-card-border rounded-3xl p-8 mb-8 backdrop-blur-sm max-w-3xl mx-auto shadow-xl shadow-brand-blue/5">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-card-border hover:border-brand-blue/50 transition-colors rounded-2xl p-12 bg-app-bg/30 mb-6">
          <Upload className="h-12 w-12 text-brand-blue mb-4 opacity-80" />
          <p className="text-app-fg mb-2 font-medium text-lg">Upload your document</p>
          <p className="text-sm text-app-fg/60 mb-8 text-center max-w-xs">Supports .pdf, .txt, .docx up to 10MB.</p>
          <div className="relative">
            <button className="px-6 py-2.5 bg-brand-blue/10 text-brand-blue font-medium rounded-xl border border-brand-blue/20 hover:bg-brand-blue/20 transition-all">
              Browse Files
            </button>
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-between p-4 bg-app-bg rounded-xl mb-6 border border-card-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-purple/10 rounded-lg">
                <FileText className="h-6 w-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-sm font-medium text-app-fg">{file.name}</p>
                <p className="text-xs text-app-fg/60">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <BookOpen className="h-6 w-6" />}
          {loading ? 'Processing Document...' : 'Extract Intelligence'}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-center text-sm font-medium bg-red-500/10 py-3 rounded-lg px-4">
            {error}
          </p>
        )}
      </div>

      {summary && (
        <div className="bg-card-bg border border-card-border rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-brand-purple/5 animate-in slide-in-from-bottom-8 duration-500 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-card-border/50">
            <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-brand-purple" />
            </div>
            <h2 className="text-2xl font-bold text-app-fg">Intelligence Report</h2>
          </div>
          <div className="space-y-1">
            {summary.split('\n').map((line, i) => renderMarkdownLine(line, i))}
          </div>
        </div>
      )}
    </div>
  );
}
