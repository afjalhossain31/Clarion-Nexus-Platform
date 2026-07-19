'use client';

import React, { useState } from 'react';
import { Upload, FileText, Loader2, BarChart2 } from 'lucide-react';
import { API_URL } from '../../../context/AuthContext';

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch(`${API_URL}/ai/data-analyzer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Analysis failed');
      
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple mb-4">
          AI Data Analyzer
        </h1>
        <p className="text-app-fg/70 text-lg">
          Upload CSV or JSON files for instant AI-driven trend analysis and KPI summaries.
        </p>
      </div>

      <div className="bg-card-bg/40 border border-card-border rounded-2xl p-8 mb-8 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-card-border rounded-xl p-10 bg-app-bg/50 mb-6">
          <Upload className="h-10 w-10 text-brand-blue mb-4" />
          <p className="text-app-fg mb-2 font-medium">Drag & drop your file here, or click to browse</p>
          <p className="text-sm text-app-fg/60 mb-6">Supports .csv, .json (Max 10MB)</p>
          <input
            type="file"
            accept=".csv,.json"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-app-fg/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-all cursor-pointer"
          />
        </div>

        {file && (
          <div className="flex items-center gap-3 p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-lg mb-6">
            <FileText className="h-5 w-5 text-brand-blue" />
            <span className="text-sm font-medium text-app-fg">{file.name}</span>
            <span className="text-xs text-app-fg/60 ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl font-medium shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <BarChart2 className="h-5 w-5" />}
          {loading ? 'Analyzing Data...' : 'Generate Insights'}
        </button>

        {error && <p className="text-red-500 mt-4 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}
      </div>

      {result && (
        <div className="bg-card-bg/40 border border-card-border rounded-2xl p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold text-app-fg mb-6 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-brand-purple" />
            Analysis Report
          </h2>
          <div className="prose prose-invert prose-brand max-w-none">
            {result.split('\n').map((line, i) => (
              <p key={i} className="mb-2 text-app-fg/90">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
