'use client';

import React, { useState } from 'react';
import { Tag, Loader2, List, Sparkles } from 'lucide-react';
import { API_URL } from '../../../context/AuthContext';

export default function ClassifierPage() {
  const [itemsText, setItemsText] = useState('');
  const [categoryType, setCategoryType] = useState('Expenses');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleClassify = async () => {
    if (!itemsText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch(`${API_URL}/ai/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: itemsText, categoryType })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Classification failed');
      
      setTags(data.tags || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple mb-4">
          AI Auto Classification
        </h1>
        <p className="text-app-fg/70 text-lg">
          Paste a list of items, expenses, or keywords, and let AI automatically categorize and tag them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-card-bg/40 border border-card-border rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-app-fg mb-2">Category Domain</label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full bg-app-bg border border-card-border rounded-lg px-4 py-2.5 text-app-fg focus:outline-none focus:border-brand-blue/50"
            >
              <option value="Expenses">Expenses & Finance</option>
              <option value="Documents">Document Types</option>
              <option value="E-commerce Products">E-commerce Products</option>
              <option value="Support Tickets">Support Tickets</option>
              <option value="General Keywords">General Keywords</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-app-fg mb-2">Items to Classify</label>
            <textarea
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="e.g. Uber ride, AWS hosting, Facebook Ads, Office chairs..."
              rows={6}
              className="w-full bg-app-bg border border-card-border rounded-lg px-4 py-3 text-app-fg focus:outline-none focus:border-brand-blue/50 resize-none"
            />
          </div>

          <button
            onClick={handleClassify}
            disabled={!itemsText.trim() || loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl font-medium shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {loading ? 'Classifying...' : 'Auto-Generate Tags'}
          </button>
          
          {error && <p className="text-red-500 mt-4 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}
        </div>

        {/* Output Section */}
        <div className="bg-card-bg/40 border border-card-border rounded-2xl p-8 backdrop-blur-sm flex flex-col">
          <h2 className="text-xl font-bold text-app-fg mb-6 flex items-center gap-2">
            <Tag className="h-5 w-5 text-brand-purple" />
            Generated Tags
          </h2>
          
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue px-3 py-1.5 rounded-lg text-sm font-medium animate-in fade-in zoom-in duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                  {tag}
                  <button onClick={() => removeTag(index)} className="hover:text-red-400 focus:outline-none transition-colors">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-app-fg/40 border-2 border-dashed border-card-border rounded-xl p-8">
              <List className="h-10 w-10 mb-4 opacity-50" />
              <p className="text-center">Enter your items on the left to see AI-generated classifications here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
