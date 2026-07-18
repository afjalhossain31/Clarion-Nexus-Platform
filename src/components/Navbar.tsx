'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, LogOut, Sparkles, FolderKanban } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = isAuthenticated
    ? [
        { href: '/', label: 'Home' },
        { href: '/explore', label: 'Explore' },
        { href: '/items/add', label: 'Add Request' },
        { href: '/items/manage', label: 'Manage Work' },
        { href: '/generate', label: 'AI Proposal' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/explore', label: 'Explore' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border/50 bg-app-bg/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-md shadow-brand-blue/20 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
              Clarion Nexus
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-250 ${
                  isActive(link.href)
                    ? 'text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/15'
                    : 'text-app-fg/75 hover:text-brand-blue hover:bg-card-border/40'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Area (Theme, Account & Auth CTAs) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-card-border bg-card-bg/40 text-app-fg hover:text-brand-purple hover:bg-card-border/60 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Auth Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-card-border">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-brand-blue/30 bg-card-bg"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-app-fg leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-medium text-app-fg/60 capitalize leading-none">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-app-fg/60 hover:text-red-500 hover:bg-red-500/10 hover:scale-105 active:scale-95 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-app-fg/80 hover:text-brand-blue transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-brand-blue to-brand-purple shadow-md shadow-brand-blue/10 hover:shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all duration-250"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-card-border bg-card-bg/40 text-app-fg"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-card-border bg-card-bg text-app-fg hover:bg-card-border/40"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-card-border/50 bg-app-bg animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-blue bg-brand-blue/10'
                    : 'text-app-fg/70 hover:text-brand-blue hover:bg-card-border/30'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <div className="pt-4 mt-4 border-t border-card-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-9 w-9 rounded-full bg-card-bg"
                  />
                  <div>
                    <p className="text-sm font-semibold text-app-fg">{user.name}</p>
                    <p className="text-xs text-app-fg/60 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-card-border">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center py-2 text-sm font-medium text-app-fg/80 border border-card-border rounded-xl bg-card-bg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-brand-blue to-brand-purple"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
