'use client';

import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { API_URL } from '../../../context/AuthContext';

export default function VisionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch(`${API_URL}/ai/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Analysis failed');
      
      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple mb-4">
          AI Vision & Image Understanding
        </h1>
        <p className="text-app-fg/70 text-lg max-w-2xl mx-auto">
          Upload any image and let our multimodal AI explain the content, extract data from receipts, or analyze UI layouts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Upload Section */}
        <div className="bg-card-bg/40 border border-card-border rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-brand-blue/5">
          {!previewUrl ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-card-border hover:border-brand-blue/50 transition-colors rounded-2xl p-12 bg-app-bg/30 min-h-[400px]">
              <ImageIcon className="h-12 w-12 text-brand-blue mb-4 opacity-80" />
              <p className="text-app-fg mb-2 font-medium text-lg">Upload an image</p>
              <p className="text-sm text-app-fg/60 mb-8 text-center">Supports .jpg, .png up to 10MB.</p>
              <div className="relative">
                <button className="px-6 py-2.5 bg-brand-blue/10 text-brand-blue font-medium rounded-xl border border-brand-blue/20 hover:bg-brand-blue/20 transition-all">
                  Browse Gallery
                </button>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-card-border group">
              <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover max-h-[500px]" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="relative">
                  <button className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/30 transition-all">
                    Change Image
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full mt-6 flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
            {loading ? 'Analyzing Image...' : 'Understand Image'}
          </button>

          {error && <p className="text-red-500 mt-4 text-center text-sm font-medium bg-red-500/10 py-2 rounded-lg">{error}</p>}
        </div>

        {/* Output Section */}
        <div className="bg-card-bg border border-card-border rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-brand-purple/5 min-h-[400px]">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-card-border/50">
            <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-brand-purple" />
            </div>
            <h2 className="text-2xl font-bold text-app-fg">AI Explanation</h2>
          </div>
          
          {explanation ? (
            <div className="prose prose-invert prose-brand max-w-none animate-in fade-in duration-500">
              {explanation.split('\n').map((line, i) => (
                <p key={i} className="mb-4 text-app-fg/90 leading-relaxed text-lg">{line}</p>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-app-fg/40 pt-12">
              <Sparkles className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-center text-lg">Upload an image and click "Understand Image" to see the magic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
