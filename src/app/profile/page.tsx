'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, API_URL } from '../../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  LogOut,
  FolderKanban,
  PlusCircle,
  Loader,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

interface UserProfileDetails {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  avatarUrl?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading, token, logout, user: authUser } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfileDetails | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirection guard for unauthorized users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch verified profile details from the backend
  useEffect(() => {
    if (isLoading) return;
    if (!token) return;

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        setErrorMsg(null);

        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          return;
        }

        // Backend returned an error (e.g. 404 for old tokens without embedded data)
        // Fall back gracefully to the user data cached in AuthContext / localStorage
        if (authUser) {
          setProfile({
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            role: authUser.role,
            avatarUrl: authUser.avatarUrl
          });
          return;
        }

        throw new Error('Failed to load verified profile details from server.');
      } catch (err: any) {
        console.error(err);
        // Last resort: use authUser if available
        if (authUser) {
          setProfile({
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            role: authUser.role,
            avatarUrl: authUser.avatarUrl
          });
        } else {
          setErrorMsg(err.message || 'Could not load profile. Please try again.');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token, isLoading, authUser]);

  if (isLoading || (loadingProfile && !profile)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader className="h-10 w-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-app-fg/60">Fetching verified profile details...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center backdrop-blur-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
          <h3 className="font-display text-lg font-bold text-red-500 mb-2">Error Loading Profile</h3>
          <p className="text-sm text-app-fg/70 mb-4">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userAvatar = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'default'}`;
  const formattedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : 'Unknown Date';

  return (
    <div className="min-h-[85vh] py-16 px-4 bg-radial-gradient">
      <div className="mx-auto max-w-2xl">

        {/* Glow Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-blue/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />

        <div className="relative rounded-2xl border border-card-border bg-card-bg/85 p-8 shadow-2xl backdrop-blur-md text-left">

          {/* Header Badge */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-[11px] font-bold uppercase tracking-wider text-brand-blue">
              <UserCheck className="h-3.5 w-3.5" />
              Verified User Profile
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>

          {/* Profile Card Body */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-card-border/60">
            {/* Avatar with Glow Ring */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple opacity-70 blur-sm group-hover:opacity-100 transition duration-300" />
              <img
                src={userAvatar}
                alt={profile?.name}
                className="relative h-24 w-24 rounded-full border border-card-border bg-app-bg object-cover"
              />
            </div>

            {/* Profile Meta Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold tracking-tight text-app-fg flex items-center justify-center sm:justify-start gap-2">
                {profile?.name}
                <Sparkles className="h-5 w-5 text-brand-purple animate-pulse" />
              </h1>
              <p className="text-sm text-app-fg/60 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-4 w-4 text-app-fg/40" />
                {profile?.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg border border-card-border bg-card-bg text-xs font-bold text-app-fg/80 capitalize">
                  <Shield className="h-3.5 w-3.5 text-brand-blue" />
                  Role: {profile?.role}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg border border-card-border bg-card-bg text-xs font-semibold text-app-fg/60">
                  <Calendar className="h-3.5 w-3.5 text-brand-purple" />
                  Joined: {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Quick Links Area */}
          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-app-fg/50 mb-4">
              Workspace Access & Control
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

              {profile?.role === 'client' && (
                <>
                  {/* Client Action 1: Add request */}
                  <Link
                    href="/items/add"
                    className="flex items-center justify-between p-4 rounded-xl border border-card-border bg-card-bg/40 hover:bg-card-border/80 hover:border-brand-blue/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue">
                        <PlusCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-app-fg">Submit Request</h4>
                        <p className="text-xs text-app-fg/60">Create a new agency job</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-app-fg/40 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                  </Link>

                  {/* Client Action 2: Manage requests */}
                  <Link
                    href="/items/manage"
                    className="flex items-center justify-between p-4 rounded-xl border border-card-border bg-card-bg/40 hover:bg-card-border/80 hover:border-brand-purple/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple">
                        <FolderKanban className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-app-fg">Manage Requests</h4>
                        <p className="text-xs text-app-fg/60">Track your order statuses</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-app-fg/40 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
                  </Link>
                </>
              )}

              {profile?.role === 'admin' && (
                <>
                  {/* Admin Action: Manage all work */}
                  <Link
                    href="/items/manage"
                    className="flex items-center justify-between p-4 rounded-xl border border-card-border bg-card-bg/40 hover:bg-card-border/80 hover:border-brand-blue/30 transition-all duration-250 group sm:col-span-2"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue">
                        <FolderKanban className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-app-fg">Manage Client Projects</h4>
                        <p className="text-xs text-app-fg/60">View, update, or reject all client request specifications</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-app-fg/40 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                  </Link>
                </>
              )}

              {/* Action 3: AI Proposal Draft generator (common to both) */}
              <Link
                href="/generate"
                className="flex items-center justify-between p-4 rounded-xl border border-card-border bg-card-bg/40 hover:bg-card-border/80 hover:border-brand-blue/30 transition-all duration-200 group sm:col-span-2"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-app-fg">AI Proposal Drafts</h4>
                    <p className="text-xs text-app-fg/60">Generate instantly tailored project pitches</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-app-fg/40 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
