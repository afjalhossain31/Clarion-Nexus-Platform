'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Star, ArrowLeftRight, ChevronLeft, ChevronRight, Sparkles, BarChart2, Tag, BookOpen, ImageIcon } from 'lucide-react';
import { API_URL } from '../../context/AuthContext';

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

interface ExploreResponse {
  services: ServiceItem[];
  total: number;
  page: number;
  pages: number;
}

export default function ExplorePage() {
  // Filtering & pagination states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  // Debounce search input (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Reset page to 1 when changing filters
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value));
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  // Fetch data using TanStack Query
  const { data, isLoading, isError } = useQuery<ExploreResponse>({
    queryKey: ['exploreServices', debouncedSearch, category, maxPrice, sort, page],
    queryFn: async () => {
      const url = new URL(`${API_URL}/services/explore`);
      if (debouncedSearch) url.searchParams.append('q', debouncedSearch);
      if (category && category !== 'all') url.searchParams.append('category', category);
      if (maxPrice > 0 && maxPrice < 3000) url.searchParams.append('maxPrice', String(maxPrice));
      if (sort !== 'default') url.searchParams.append('sort', sort);
      url.searchParams.append('page', String(page));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch catalog services');
      return res.json();
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-10 text-left">
        <h1 className="font-display text-3xl font-extrabold text-app-fg tracking-tight sm:text-4xl">
          Digital Solutions Directory
        </h1>
        <p className="text-sm text-app-fg/60 max-w-xl">
          Browse and filter our agency capabilities. Easily request quotes, inspect deliverables, or build proposal outlines.
        </p>
      </div>

      {/* AI Tools Quick Links */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/ai/analyzer" className="p-4 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 hover:bg-brand-blue/10 hover:scale-[1.02] transition-all flex flex-col items-center text-center gap-2">
          <BarChart2 className="h-6 w-6 text-brand-blue" />
          <span className="text-sm font-semibold text-app-fg">Data Analyzer</span>
        </Link>
        <Link href="/ai/classifier" className="p-4 rounded-2xl border border-brand-purple/20 bg-brand-purple/5 hover:bg-brand-purple/10 hover:scale-[1.02] transition-all flex flex-col items-center text-center gap-2">
          <Tag className="h-6 w-6 text-brand-purple" />
          <span className="text-sm font-semibold text-app-fg">Auto Classifier</span>
        </Link>
        <Link href="/ai/document" className="p-4 rounded-2xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:scale-[1.02] transition-all flex flex-col items-center text-center gap-2">
          <BookOpen className="h-6 w-6 text-green-500" />
          <span className="text-sm font-semibold text-app-fg">Document AI</span>
        </Link>
        <Link href="/ai/vision" className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 hover:scale-[1.02] transition-all flex flex-col items-center text-center gap-2">
          <ImageIcon className="h-6 w-6 text-orange-500" />
          <span className="text-sm font-semibold text-app-fg">Vision AI</span>
        </Link>
      </div>

      {/* Filters Panel Box */}
      <div className="mb-8 p-5 rounded-2xl border border-card-border bg-card-bg/60 backdrop-blur-xs flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-app-fg/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, stack, title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm text-app-fg focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
          
          {/* Category Select */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] uppercase font-bold tracking-wider text-app-fg/50 pl-1">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="rounded-xl border border-card-border bg-app-bg px-3.5 py-2.5 text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
            >
              <option value="all">All Categories</option>
              <option value="web-development">Web Dev</option>
              <option value="ui-ux">UI/UX Design</option>
              <option value="ai">AI & Automation</option>
              <option value="seo">SEO Optimization</option>
              <option value="marketing">Growth Marketing</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] uppercase font-bold tracking-wider text-app-fg/50 pl-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={handleSortChange}
              className="rounded-xl border border-card-border bg-app-bg px-3.5 py-2.5 text-sm text-app-fg focus:outline-none focus:border-brand-blue/50"
            >
              <option value="default">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Highest Rating</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col gap-1.5 text-left justify-center">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-app-fg/50">
                Max Price
              </span>
              <span className="text-xs font-bold text-brand-blue">
                {maxPrice === 3000 ? 'Any' : `$${maxPrice}`}
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={handlePriceChange}
              className="w-full accent-brand-blue h-1 bg-card-border rounded-lg appearance-none cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Catalog Display */}
      {isLoading ? (
        // Grid Skeleton (8 Items)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-standard animate-pulse min-h-[385px]">
              <div className="h-36 bg-card-border/60 rounded-xl mb-4" />
              <div className="h-4 bg-card-border/70 w-3/4 rounded mb-2" />
              <div className="h-3 bg-card-border/50 w-5/6 rounded mb-1" />
              <div className="h-3 bg-card-border/50 w-2/3 rounded mb-8" />
              <div className="mt-auto flex justify-between items-center pt-2">
                <div className="h-6 w-16 bg-card-border/70 rounded" />
                <div className="h-8 w-20 bg-card-border/70 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError || !data ? (
        <div className="text-center py-16 border border-card-border/60 rounded-2xl bg-card-bg">
          <p className="text-red-500 font-semibold mb-2">Service unavailable</p>
          <p className="text-xs text-app-fg/60">Could not pull service listings from the backend.</p>
        </div>
      ) : data.services.length === 0 ? (
        <div className="text-center py-20 border border-card-border/60 rounded-2xl bg-card-bg">
          <SlidersHorizontal className="h-10 w-10 text-app-fg/30 mx-auto mb-4" />
          <h3 className="font-display font-bold text-app-fg text-base mb-1">No services matched criteria</h3>
          <p className="text-xs text-app-fg/60">Try modifying your text search, expanding price limits, or category types.</p>
        </div>
      ) : (
        // Active services grid (4 cards per row on desktop)
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {data.services.map((service) => (
              <div key={service._id} className="card-standard flex flex-col justify-between min-h-[385px]">
                <div>
                  {/* Service Image banner */}
                  <div className="h-36 w-full rounded-xl overflow-hidden mb-4 relative bg-card-border">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                      {service.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Rating meta details */}
                  <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-semibold text-app-fg/80">{service.rating}</span>
                    <span className="text-app-fg/40">({service.reviewCount})</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-sm sm:text-base font-bold text-app-fg tracking-tight mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-app-fg/70 leading-relaxed line-clamp-3">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Footer spec information */}
                <div className="mt-6 pt-3 border-t border-card-border/30 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-app-fg/55 uppercase font-semibold">Price From</p>
                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                      ${service.priceFrom}
                    </p>
                  </div>
                  <Link
                    href={`/services/${service._id}`}
                    className="flex items-center gap-0.5 text-xs font-semibold text-brand-blue hover:text-brand-purple transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-blue/5 border border-transparent hover:border-brand-blue/10"
                  >
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-3 border-t border-card-border/40 pt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-xl border border-card-border bg-card-bg/40 text-app-fg hover:bg-card-border/60 disabled:opacity-50 transition"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <span className="text-xs font-semibold text-app-fg/80">
                Page {page} of {data.pages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-xl border border-card-border bg-card-bg/40 text-app-fg hover:bg-card-border/60 disabled:opacity-50 transition"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
