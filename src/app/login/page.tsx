'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, Loader, LogIn, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin, googleLogin, isAuthenticated, error, setError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      setValidationError('Please populate both email and password fields.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must contain at least 6 characters.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleDemoClick = async (role: 'client' | 'admin') => {
    setValidationError(null);
    try {
      await demoLogin(role);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleGoogleClick = async () => {
    setValidationError(null);
    try {
      // Simulate Google Sign-In with predefined user
      await googleLogin(
        'Jane Google',
        'jane.google@gmail.com',
        'google_oauth_id_998877',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
      );
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-radial-gradient">

      <div className="w-full max-w-md rounded-2xl border border-card-border bg-card-bg/85 p-8 shadow-xl backdrop-blur-md">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app-fg">
            Welcome back to Nexus
          </h2>
          <p className="text-xs text-app-fg/60 mt-1">
            Access your custom project requests and AI proposal creators.
          </p>
        </div>

        {/* Dynamic Alerts */}
        {(error || validationError) && (
          <div className="mb-6 flex gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-500 items-start text-left">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error || validationError}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">

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
                placeholder="client@nexus.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-card-border bg-app-bg text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-app-fg/60">
              Account Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-fg/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                Sign In
                <LogIn className="h-4 w-4" />
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
            <span className="bg-card-bg px-2.5 text-app-fg/50 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Social & Demo Buttons Stack */}
        <div className="space-y-2.5">
          {/* Simulated Google Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-card-border bg-card-bg hover:bg-card-border/50 text-xs font-semibold text-app-fg transition cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.62v3.02h3.87c2.26-2.08 3.58-5.14 3.58-8.49z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-5.01H1.27v3.11C3.25 21.89 7.39 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.22A7.16 7.16 0 0 1 4.8 12c0-.79.13-1.57.38-2.31V6.58H1.27A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.27 5.42l3.97-3.2z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.25 2.11 1.27 6.58l3.97 3.21c.95-2.88 3.61-5.04 6.76-5.04z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Quick Demos */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('client')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/10 text-[11px] font-bold text-brand-blue transition cursor-pointer"
            >
              Demo Client
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-brand-purple/30 bg-brand-purple/5 hover:bg-brand-purple/10 text-[11px] font-bold text-brand-purple transition cursor-pointer"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Demo Admin
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-app-fg/50 mt-6 font-medium">
          Don't have a profile yet?{' '}
          <Link href="/register" className="text-brand-blue hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
