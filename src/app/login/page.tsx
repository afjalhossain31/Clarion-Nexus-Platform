'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, AlertCircle, Loader, LogIn, ShieldAlert } from 'lucide-react';
import Script from 'next/script';

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

  // Handle the credential token returned by Google's popup
  const handleCredentialResponse = async (response: any) => {
    if (response.credential) {
      setValidationError(null);
      try {
        await googleLogin(response.credential);
      } catch (err) {
        // Error is handled by context
      }
    }
  };

  // Initialize and render the Google button
  useEffect(() => {
    const initializeGoogle = () => {
      const google = (window as any).google;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '192933809772-3q60ho5ekgndc0ncbqsu6vtq8oo8unfs.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });
        
        const container = document.getElementById('googleSignInButton');
        if (container) {
          google.accounts.id.renderButton(container, {
            theme: 'filled_blue',
            size: 'large',
            width: container.offsetWidth || 382,
            text: 'continue_with',
            shape: 'rectangular',
          });
        }
      }
    };

    // If script already loaded
    if ((window as any).google) {
      initializeGoogle();
    } else {
      // Check every 300ms until loaded
      const timer = setInterval(() => {
        if ((window as any).google) {
          initializeGoogle();
          clearInterval(timer);
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, []);

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
          {/* Google Sign-In SDK Button Container */}
          <div className="w-full flex flex-col items-center">
            <div id="googleSignInButton" className="w-full min-h-[40px] flex justify-center"></div>
            <Script
              src="https://accounts.google.com/gsi/client"
              strategy="afterInteractive"
            />
          </div>

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
