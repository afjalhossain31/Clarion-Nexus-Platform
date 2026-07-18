'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Star, Clock, Tag, ArrowLeft, StarHalf, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { API_URL } from '../../../context/AuthContext';

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

interface DetailsResponse {
  service: ServiceItem;
  related: ServiceItem[];
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useQuery<DetailsResponse>({
    queryKey: ['serviceDetails', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/services/${id}`);
      if (!res.ok) throw new Error('Service detail load failure');
      return res.json();
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-6 w-32 bg-card-border/85 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-96 bg-card-border/60 rounded-2xl" />
          <div>
            <div className="h-10 bg-card-border/80 w-3/4 rounded mb-4" />
            <div className="h-6 bg-card-border/60 w-1/3 rounded mb-8" />
            <div className="h-4 bg-card-border/50 w-full rounded mb-2" />
            <div className="h-4 bg-card-border/50 w-full rounded mb-2" />
            <div className="h-4 bg-card-border/50 w-5/6 rounded mb-8" />
            <div className="h-16 bg-card-border/70 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="font-display text-xl font-bold text-red-500 mb-2">Failed to load service detail</h2>
        <p className="text-sm text-app-fg/60 mb-6">Could not establish contact with the agency backend server.</p>
        <Link href="/explore" className="text-sm font-semibold text-brand-blue hover:underline">
          Return to Explore
        </Link>
      </div>
    );
  }

  const { service, related } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/explore" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-app-fg/60 hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-start">
        
        {/* Media Container (Left Column) */}
        <div className="rounded-2xl overflow-hidden border border-card-border shadow-md bg-card-bg">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-80 sm:h-96 object-cover"
          />
        </div>

        {/* Info & Callout (Right Column) */}
        <div className="flex flex-col text-left">
          
          {/* Category Chip */}
          <div className="mb-4">
            <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-brand-blue/15 text-brand-blue border border-brand-blue/10">
              {service.category.replace('-', ' ')}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-app-fg tracking-tight mb-4">
            {service.title}
          </h1>

          {/* Reviews Meta */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <div className="flex items-center gap-0.5 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 fill-current ${
                    i < Math.floor(service.rating) ? 'text-yellow-500' : 'text-card-border'
                  }`} 
                />
              ))}
            </div>
            <span className="font-bold text-app-fg">{service.rating}</span>
            <span className="text-app-fg/40">|</span>
            <span className="text-app-fg/60">{service.reviewCount} Verified Ratings</span>
          </div>

          {/* Specifications Grid Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 p-4 rounded-xl border border-card-border bg-card-bg/40">
            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-brand-purple flex-shrink-0" />
              <div>
                <p className="text-[9px] uppercase font-bold tracking-wider text-app-fg/50">Delivery Time</p>
                <p className="text-xs font-bold text-app-fg">{service.deliveryDays} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4.5 w-4.5 text-brand-blue flex-shrink-0" />
              <div>
                <p className="text-[9px] uppercase font-bold tracking-wider text-app-fg/50">Pricing From</p>
                <p className="text-xs font-bold text-app-fg">${service.priceFrom}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 className="h-4.5 w-4.5 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-[9px] uppercase font-bold tracking-wider text-app-fg/50">Quality Audit</p>
                <p className="text-xs font-bold text-green-500">Passed</p>
              </div>
            </div>
          </div>

          {/* Service narrative Description / Overview */}
          <div className="mb-8">
            <h3 className="font-display text-sm font-semibold text-app-fg tracking-wide uppercase mb-3">
              Description & Deliverables
            </h3>
            <p className="text-xs sm:text-sm text-app-fg/75 leading-relaxed whitespace-pre-wrap">
              {service.fullDesc}
            </p>
          </div>

          {/* Quote Button */}
          <div className="mt-auto">
            <Link
              href="/items/add"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] transition-all duration-200"
            >
              Request Custom Project
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          </div>

        </div>
      </div>

      {/* Related services grid section (4 columns) */}
      {related.length > 0 && (
        <div className="border-t border-card-border pt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-app-fg text-left mb-8">
            Related Agency Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div key={item._id} className="card-standard flex flex-col justify-between min-h-[385px]">
                <div>
                  <div className="h-36 w-full rounded-xl overflow-hidden mb-4 relative bg-card-border">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                      {item.category.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-semibold text-app-fg/80">{item.rating}</span>
                    <span className="text-app-fg/40">({item.reviewCount})</span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-app-fg tracking-tight mb-2 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-app-fg/70 leading-relaxed line-clamp-3">
                    {item.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-card-border/30 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-app-fg/55 uppercase font-semibold">Price From</p>
                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                      ${item.priceFrom}
                    </p>
                  </div>
                  <Link
                    href={`/services/${item._id}`}
                    className="flex items-center gap-0.5 text-xs font-semibold text-brand-blue hover:text-brand-purple transition-colors"
                  >
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
