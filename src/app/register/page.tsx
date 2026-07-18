'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, User, Mail, AlertCircle, Loader, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register, demoLogin, isAuthenticated, error, setError, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setError(null);
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name || !email) {
      setValidationError('Please populate both your name and email address.');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please supply a valid email address.');
      return;
    }

    try {
      await register(name, email);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleDemoClick = async () => {
    setValidationError(null);
    try {
      await demoLogin('client');
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-radial-gradient">
      
      <div className="w-full max-w-md rounded-2xl border border-card-border bg-card-bg/85 p-8 shadow-xl backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app-fg">
            Create Client Profile
          </h2>
          <p className="text-xs text-app-fg/60 mt-1">
            Sign up to post custom service requests and consult NexusAI.
          </p>
        </div>

        {/* Dynamic Alerts */}
        {(error || validationError) && (
          <div className="mb-6 flex gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-500 items-start text-left">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error || validationError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-fg/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-fg/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-md hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <>
                Create Profile
                <UserPlus className="h-4.5 w-4.5" />
              </>
            )}
          </button>

        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card-bg px-2.5 text-app-fg/50 font-medium">Or use instant login</span>
          </div>
        </div>

        {/* Demo trigger */}
        <button
          type="button"
          onClick={handleDemoClick}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/10 text-xs font-bold text-brand-blue transition cursor-pointer"
        >
          Access Instant Client Demo
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-app-fg/50 mt-6 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-blue hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
