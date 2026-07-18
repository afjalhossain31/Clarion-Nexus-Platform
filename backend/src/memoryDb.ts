// In-memory Database Fallback for Clarion Nexus Backend
// Used automatically when MongoDB is unavailable.

import bcrypt from 'bcryptjs';

export interface MemoryUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'client' | 'admin';
  googleId?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface MemoryService {
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

export interface MemoryRequest {
  _id: string;
  user: string | { _id: string; name: string; email: string; avatarUrl?: string };
  title: string;
  shortDesc: string;
  fullDesc: string;
  budget: number;
  imageUrl?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
}

export interface MemoryChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// Global Memory State
export const users: MemoryUser[] = [];
export const services: MemoryService[] = [];
export const requests: MemoryRequest[] = [];
export const chatHistory: Map<string, MemoryChatMessage[]> = new Map();

// Initialize with default seeds
export const initMemoryDb = async () => {
  if (users.length > 0) return; // already initialized

  console.log('[MemoryDB] Initializing fallback in-memory database store...');
  const salt = await bcrypt.genSalt(10);
  const demoPassword = await bcrypt.hash('nexuspass123', salt);

  // Seed users
  users.push({
    _id: 'user_client_demo_id',
    name: 'Demo Client',
    email: 'demo@nexus.com',
    password: demoPassword,
    role: 'client',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
    createdAt: new Date()
  });

  users.push({
    _id: 'user_admin_demo_id',
    name: 'Clarion Admin',
    email: 'admin@nexus.com',
    password: demoPassword,
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
    createdAt: new Date()
  });

  // Seed services
  const rawServices = [
    {
      _id: 'service_web_dev_id',
      title: 'Enterprise Web Development',
      shortDesc: 'High-performance, secure, and SEO-optimized full stack web applications.',
      fullDesc: 'Leverage our expertise to build next-generation web applications. We utilize React, Next.js, and Node.js to create scalable, blazing-fast interfaces. Package includes full styling customization, theme configurations (dark/light), custom content databases, REST API design, state-management integration, responsive CSS optimization, and deployment pipelines.',
      category: 'web-development' as const,
      priceFrom: 1499,
      deliveryDays: 14,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
      rating: 4.9,
      reviewCount: 38
    },
    {
      _id: 'service_ui_ux_id',
      title: 'Modern UI/UX Design System',
      shortDesc: 'Beautiful, custom designs and wireframes with complete design systems.',
      fullDesc: 'We create professional user interfaces that delight customers. Includes detailed persona research, competitive analysis, wireframes, high-fidelity interactive mockups in Figma, complete custom color palettes (matching light and dark themes), typography sheets, button grids, and layout rules for responsive web and mobile viewports.',
      category: 'ui-ux' as const,
      priceFrom: 499,
      deliveryDays: 7,
      imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60',
      rating: 4.8,
      reviewCount: 22
    },
    {
      _id: 'service_ai_id',
      title: 'AI Integration & Agentic Workflows',
      shortDesc: 'Automate business workflows and customer support with state-of-the-art LLMs.',
      fullDesc: 'Harness the power of AI to supercharge your business. We build secure API pipelines connecting to top-tier LLM models like Google Gemini and OpenAI. Deliverables include custom customer support chatbot widgets with typing indicators, semantic document parsers, automated categorization tools, custom prompt structures, and vector database memory stores.',
      category: 'ai' as const,
      priceFrom: 1999,
      deliveryDays: 21,
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60',
      rating: 5.0,
      reviewCount: 15
    },
    {
      _id: 'service_seo_id',
      title: 'Technical SEO Optimization & Audits',
      shortDesc: 'Rank #1 on Google with technical schema configurations and link building.',
      fullDesc: 'Drive high-volume organic search traffic to your application. Our team performs deep keyword intent mapping, technical site speed optimizations, schema markup tags insertion, XML sitemaps corrections, robots.txt tuning, authority link-building outreach, and sets up custom tracking dashboards with monthly performance metrics.',
      category: 'seo' as const,
      priceFrom: 999,
      deliveryDays: 10,
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
      rating: 4.7,
      reviewCount: 45
    },
    {
      _id: 'service_marketing_id',
      title: 'Digital Marketing & Growth Strategy',
      shortDesc: 'Boost sales and client retention with ad campaigns and content marketing.',
      fullDesc: 'Acquire customers at scale. We design, deploy, and manage highly target-optimized ad campaigns across Google Ads and Meta platforms. We create conversion-optimized copy, perform detailed demographic matching, implement conversion pixels, and deliver bi-weekly lead analytics and CPA improvement reports.',
      category: 'marketing' as const,
      priceFrom: 799,
      deliveryDays: 7,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60&seed=marketing',
      rating: 4.6,
      reviewCount: 29
    },
    {
      _id: 'service_analytics_id',
      title: 'AI Data Intelligence & Analytics',
      shortDesc: 'Extract insights and trends from your sales reports using LLM pipelines.',
      fullDesc: 'Turn unstructured raw data (JSON, CSV, PDF) into actionable business intelligence reports. We integrate smart analytical scripts that compile visual charts, isolate risk indicators, list operational anomalies, and summarize financial KPIs automatically using advanced language model processing and secure cloud infrastructure.',
      category: 'ai' as const,
      priceFrom: 1799,
      deliveryDays: 12,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
      rating: 4.9,
      reviewCount: 19
    }
  ];

  services.push(...rawServices);
  console.log(`[MemoryDB] Pre-seeded ${users.length} users and ${services.length} services successfully.`);
};

// Auto run init
initMemoryDb();
