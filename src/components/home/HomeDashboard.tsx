'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Calendar, LogIn, LogOut } from 'lucide-react';
import { mockProactiveOffers, mockRoomStatus } from '@/src/lib/mockData';
import QuickStats from './QuickStats';
import ProactiveCard from './ProactiveCard';
import MoodButtons from './MoodButtons';
import RoomProgressCard from './RoomProgressCard';
import HighlightsSection from './HighlightsSection';
import SuggestionsForYou from './SuggestionsForYou';
import ScrollableEvents from './ScrollableEvents';
import MemoryBox from './MemoryBox';
import EmamaChatWidget from './EmamaChatWidget';
import BackToTopButton from './BackToTopButton';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
}

export default function HomeDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const guestName = isLoaded ? (user?.firstName || user?.username || 'Guest') : 'Guest';
  const [activeOffer, setActiveOffer] = useState<string | null>(null);
  const [stayDates, setStayDates] = useState<{ check_in_date: string; check_out_date: string } | null>(null);

  // Clear dates when user signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setStayDates(null);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const loadDates = () => {
      fetch('/api/preferences')
        .then(r => r.json())
        .then(data => {
          if (data.check_in_date && data.check_out_date) {
            setStayDates({ check_in_date: data.check_in_date, check_out_date: data.check_out_date });
          }
        })
        .catch(() => {});
    };

    loadDates();

    // Re-fetch when dates are saved via CheckInCheckOutModal
    const onDatesUpdated = () => loadDates();
    window.addEventListener('emama-dates-updated', onDatesUpdated);
    return () => window.removeEventListener('emama-dates-updated', onDatesUpdated);
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <Image
          src="/pool-garden.jpg"
          alt="Welcome to Kuriftu"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
          <p className="text-sm md:text-base text-white/80 mb-2">Welcome home, {guestName}</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-2">
            You are family here at Kuriftu African Village
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 md:px-6 py-6 space-y-8 max-w-4xl mx-auto">
        {/* Ethiopian Tagline */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm italic">ምርቱ ላንተ • The Best for You</p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Stay Dates */}
        {stayDates && (
          <div className="bg-white rounded-2xl shadow-warm p-4 md:p-5 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="font-semibold text-foreground text-sm">{formatDate(stayDates.check_in_date)}</p>
                </div>
              </div>
              <div className="text-center px-3">
                <p className="text-xs text-muted-foreground">
                  {nightsBetween(stayDates.check_in_date, stayDates.check_out_date)} night{nightsBetween(stayDates.check_in_date, stayDates.check_out_date) > 1 ? 's' : ''}
                </p>
                <div className="w-16 h-px bg-border my-1" />
                <Calendar className="w-4 h-4 mx-auto text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="font-semibold text-foreground text-sm">{formatDate(stayDates.check_out_date)}</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <LogOut className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What's Happening Now - Scrollable Events */}
        <ScrollableEvents />

        {/* Suggestions For You */}
        <SuggestionsForYou />

        {/* Room Preparation Progress - "We're Preparing Your Home" */}
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              We&apos;re Preparing Your Home
            </h2>
            <p className="text-sm text-muted-foreground">Everything is ready for your comfort</p>
          </div>
          
          {/* Room Hero Image */}
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-warm">
            <Image
              src="/cozy-room.jpg"
              alt="Your cozy room"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Regulate Room Button */}
          <Link
            href="/comfort"
            className="block w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-4 px-6 rounded-xl transition-smooth text-center shadow-warm"
          >
            Regulate Your Room
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockRoomStatus.map((status, idx) => (
              <RoomProgressCard key={idx} status={status} />
            ))}
          </div>
        </section>

        {/* Mood Buttons - "How can we help you?" */}
        <MoodButtons />
      </main>

      {/* Full-width Sections */}
      {/* Kuriftu African Village Banner */}
      <section className="px-4 md:px-6 py-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Kuriftu African Village</h2>
          <p className="text-muted-foreground">Your sanctuary of warmth and culture</p>
        </div>
      </section>

      {/* Memory Box */}
      <MemoryBox />

      {/* Discover the Resort / My Schedule */}
      <HighlightsSection />

      {/* Need Help Section */}
      <section className="px-4 md:px-6 py-8 bg-accent/10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">Need Help?</h2>
          <p className="text-foreground">Ask Emama Zinashe. She knows everything.</p>
          <p className="text-sm text-muted-foreground">Tap the chat button in the corner to ask any questions</p>
        </div>
      </section>

      {/* What Our Guests Say */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary text-center">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Returning Guest */}
            <div className="glass rounded-2xl p-6 shadow-warm">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src="/guest-2.jpg"
                    alt="Ato Bekele"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-primary">Ato Bekele Tadesse</p>
                  <p className="text-sm text-muted-foreground">Returning Guest • 5th visit</p>
                </div>
              </div>
              <p className="text-foreground italic">&quot;Every return feels like coming home. The warmth, the culture, the hospitality—this is exactly what I need.&quot;</p>
            </div>

            {/* New Visitor */}
            <div className="glass rounded-2xl p-6 shadow-warm">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src="/guest-1.jpg"
                    alt="Weizero Tigist"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-primary">Weizero Tigist Alemu</p>
                  <p className="text-sm text-muted-foreground">First Time Visitor</p>
                </div>
              </div>
              <p className="text-foreground italic">&quot;No login, no hassle – just instant magic. This is how hospitality should feel in 2025.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Components */}
      <EmamaChatWidget />
      <BackToTopButton />
    </div>
  );
}
