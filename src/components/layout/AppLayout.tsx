'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from '@clerk/nextjs';
import {
  Home,
  Calendar,
  Wind,
  Images,
  MessageCircle,
  Palette,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  Map,
  Users,
  User,
  LogIn,
  UserPlus,
  BookOpen,
  MessageSquare,
  Shield,
} from 'lucide-react';
import { mockResort } from '@/src/lib/mockData';
import EmamaChatWidget from '@/src/components/home/EmamaChatWidget';
import BackToTopButton from '@/src/components/home/BackToTopButton';
import LanguageSwitcher from '@/src/components/layout/LanguageSwitcher';
import PreferencesModal from '@/src/components/auth/PreferencesModal';
import CheckInCheckOutModal from '@/src/components/auth/CheckInCheckOutModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Check prefs after auth loads (once only)
  useEffect(() => {
    if (!isSignedIn || !isLoaded) return;
    const promptedKey = `emama-prompted-${user?.id}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(promptedKey)) return;

    fetch('/api/preferences')
      .then(r => r.json())
      .then(data => {
        if (!data.check_in_date) {
          setShowCheckInModal(true);
        } else if (!data.favorite_foods || data.favorite_foods.length === 0) {
          setShowPrefsModal(true);
        }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(promptedKey, 'true');
        }
      })
      .catch(() => {});
  }, [isSignedIn, isLoaded, user?.id]);

  const handleCheckInSave = async (checkIn: string, checkOut: string) => {
    try {
      // Fetch existing prefs so we don't overwrite them
      const res = await fetch('/api/preferences');
      const existing = res.ok ? await res.json() : {};

      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...existing,
          check_in_date: checkIn,
          check_out_date: checkOut,
        }),
      });

      // Notify dashboard to re-fetch dates
      window.dispatchEvent(new Event('emama-dates-updated'));
    } catch {
      // Save anyway, user can re-enter later
    }
    setShowCheckInModal(false);
    setShowPrefsModal(true);
  };

  useEffect(() => {
    setMounted(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Map },
    { href: '/gebeta', label: 'Gebeta', icon: UtensilsCrossed },
    { href: '/schedule', label: 'My Schedule', icon: Calendar },
    { href: '/comfort', label: 'Comfort', icon: Wind },
    { href: '/little-ethiopia', label: 'Little Ethiopia', icon: null, customIcon: '🇪🇹' },
    { href: '/events', label: 'Host Your Moment', icon: Images },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/memory-box', label: 'Memory Box', icon: BookOpen },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
  ];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* TOP NAVBAR */}
      <header className="flex-none z-40 bg-white border-b border-border shadow-sm relative">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary overflow-hidden group-hover:scale-105 transition-smooth">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-sm font-semibold text-primary leading-none">
                Ende Bete
              </span>
              <span className="text-sm text-muted-foreground leading-none">|</span>
              <span className="font-serif text-sm font-semibold text-primary leading-none">
                እንደ ቤቴ
              </span>
            </div>
          </Link>

          {/* Center: Resort Info */}
          <div className="hidden md:flex flex-col items-center">
            <div className="font-serif text-lg font-semibold text-primary">{mockResort.name}</div>
            <div className="text-xs text-muted-foreground">{mockResort.location}</div>
          </div>

          {/* Right: Auth + Language + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Auth Section */}
            <div className="flex items-center gap-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: 'w-9 h-9' } }}
              />

              {!isSignedIn && (
                <>
                  <SignInButton mode="modal">
                    <button className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-white hover:bg-accent/10 transition-smooth shadow-sm" aria-label="Sign in">
                      <LogIn className="w-4 h-4 text-primary" />
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-white hover:bg-accent/10 transition-smooth shadow-sm" aria-label="Sign up">
                      <UserPlus className="w-4 h-4 text-primary" />
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>

            <LanguageSwitcher />

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-smooth">
              {mobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`hidden md:flex flex-col transition-all duration-300 ease-in-out z-30 relative ${sidebarExpanded ? 'w-64' : 'w-20'} bg-[#4B3425] py-4 px-3`}>
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className="absolute -right-3 top-10 w-6 h-6 bg-[#D4A017] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50">
            {sidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active ? 'bg-[#D4A017] text-white shadow-md' : 'text-gray-200 hover:bg-white/10'}`}>
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {item.customIcon ? (
                      <span className="font-bold text-xs">{item.customIcon}</span>
                    ) : (
                      Icon && <Icon size={22} strokeWidth={1.5} />
                    )}
                  </div>
                  {sidebarExpanded && (
                    <span className="text-[15px] font-medium whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>
                  )}
                  {!sidebarExpanded && (
                    <div className="absolute left-16 bg-[#4B3425] text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 z-50 whitespace-nowrap">{item.label}</div>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-[#4B3425] rounded-t-3xl shadow-2xl z-50 md:hidden max-h-[70vh] overflow-y-auto">
            <div className="p-6 space-y-2">
              <div className="text-center mb-6"><h2 className="font-serif text-xl font-bold text-white">Navigate</h2></div>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-smooth text-white ${isActive(item.href) ? 'bg-[#D4A017] font-semibold' : 'hover:bg-white/10'}`} onClick={() => setMobileMenuOpen(false)}>
                  {item.customIcon ? <span className="w-6 text-center">{item.customIcon}</span> : item.icon && <item.icon className="w-6 h-6" />}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile Auth Links */}
              {!isSignedIn && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-white hover:bg-white/10 transition-smooth">
                      <LogIn className="w-6 h-6" />
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-white hover:bg-white/10 transition-smooth">
                      <UserPlus className="w-6 h-6" />
                      <span>Sign Up</span>
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <EmamaChatWidget />
      <BackToTopButton />

      {/* Check-in / Check-out Modal (shown before preferences) */}
      {showCheckInModal && (
        <CheckInCheckOutModal
          onSave={handleCheckInSave}
          onClose={() => {
            setShowCheckInModal(false);
            setShowPrefsModal(true);
          }}
        />
      )}

      {/* Preferences Modal */}
      {showPrefsModal && <PreferencesModal onClose={() => setShowPrefsModal(false)} />}
    </div>
  );
}
