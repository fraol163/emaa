'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Clock, MapPin, CheckCircle2, ChevronRight, AlertCircle, Square, CheckSquare, Sparkles } from 'lucide-react';
import EmamaAssistant from '@/src/components/shared/EmamaAssistant';
import EmamaResultDisplay from '@/src/components/shared/EmamaResultDisplay';
import { Button } from '@/components/ui/button';

interface ScheduledActivity {
  id: string;
  date: string; // e.g. "2026-04-18"
  time: string;
  title: string;
  location: string;
  description: string;
  whatToWear: string[];
  preparation: string[];
  image?: string;
  completed?: boolean;
  fromBooking?: boolean;
}

interface BookedEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  image: string;
  type: string;
}

const defaultActivities: ScheduledActivity[] = [
  {
    id: '1',
    date: '2026-04-18',
    time: '10:00 AM',
    title: 'Buna Ceremony',
    location: 'Garden Pavilion',
    description: 'Traditional Ethiopian coffee ceremony',
    whatToWear: ['Light, breathable clothing', 'Comfortable shoes', 'Layers for outdoor setting'],
    preparation: [
      'Drink plenty of water beforehand',
      'Arrive 10 minutes early',
      'Remove any strong perfumes (respect the aroma)',
    ],
    image: '/buna-ceremony.jpg',
    completed: false,
  },
  {
    id: '2',
    date: '2026-04-19',
    time: '2:00 PM',
    title: 'Traditional Weaving Workshop',
    location: 'Artisan Studio',
    description: 'Learn to weave a traditional mesob basket',
    whatToWear: ['Casual, comfortable clothing', 'Closed-toe shoes', 'Avoid loose sleeves'],
    preparation: [
      'Bring water bottle',
      'Trim nails for safety',
      'Come with an open mind and patience',
      'Be ready to learn traditional patterns passed down through generations',
    ],
    image: '/culture-hero.jpg',
    completed: false,
  },
  {
    id: '3',
    date: '2026-04-20',
    time: '5:30 PM',
    title: 'Welcome Feast',
    location: 'Main Dining Hall',
    description: 'Authentic Ethiopian cuisine experience',
    whatToWear: ['Smart casual', 'Comfortable but elegant'],
    preparation: [
      'Come with appetite!',
      'Traditional eating from shared platter experience',
      'Arrive on time for warm food',
    ],
    image: '/dining-hall.jpg',
    completed: false,
  },
];

export default function MyScheduleTab() {
  const { user, isLoaded } = useUser();
  const displayName = isLoaded ? (user?.firstName || user?.username || 'Guest') : 'Guest';
  const [showPreparation, setShowPreparation] = useState<string | null>(null);
  const [allActivities, setAllActivities] = useState<ScheduledActivity[]>(defaultActivities);
  const [checkedActivities, setCheckedActivities] = useState<Set<string>>(new Set());
  const [addingActivities, setAddingActivities] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Load booked events from localStorage (always) + Turso DB (if logged in)
  useEffect(() => {
    // Load from localStorage first
    const storedEvents = JSON.parse(localStorage.getItem('bookedEvents') || '[]') as any[];
    if (storedEvents.length > 0) {
      const localActivities: ScheduledActivity[] = storedEvents.map((ev: any) => ({
        id: `booked-${ev.id}`,
        date: ev.date || '2026-04-18',
        time: ev.time,
        title: ev.title,
        location: 'Main Venue',
        description: ev.description || '',
        whatToWear: ['Comfortable clothing'],
        preparation: ['Arrive 10 minutes early'],
        image: ev.image || '/culture-hero.jpg',
        completed: false,
        fromBooking: true,
      }));
      setAllActivities(prev => {
        const ids = new Set(prev.map(a => a.id));
        const newActs = localActivities.filter(a => !ids.has(a.id));
        return [...prev, ...newActs];
      });
    }

    // If logged in, also load from DB
    if (!user?.id) return;
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.completedActivities) setCheckedActivities(new Set(data.completedActivities));
      })
      .catch(() => {});
  }, [user?.id]);

  // Save progress to Turso DB
  const toggleCheck = useCallback((id: string) => {
    setCheckedActivities(prev => {
      const wasChecked = prev.has(id);
      const next = new Set(prev);
      wasChecked ? next.delete(id) : next.add(id);

      // Persist to DB
      if (user?.id) {
        fetch('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'progress', activityId: id, completed: !wasChecked }),
        }).catch(() => {});
      }
      return next;
    });
  }, [user?.id]);

  // Calculate upcoming activity based on current time
  const getUpcomingActivity = useCallback(() => {
    const now = new Date();
    const sorted = [...allActivities].sort((a, b) => {
      const parseTime = (t: string) => {
        const [time, ampm] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      return parseTime(a.time) - parseTime(b.time);
    });

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const activity of sorted) {
      const parseTime = (t: string) => {
        const [time, ampm] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      const actMin = parseTime(activity.time);
      if (actMin >= currentMinutes) {
        const diff = actMin - currentMinutes;
        return { activity, minutesUntil: diff };
      }
    }
    return null;
  }, [allActivities]);

  const upcoming = getUpcomingActivity();

  const completedCount = allActivities.filter(a => checkedActivities.has(a.id)).length;
  const totalCount = allActivities.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* No Hero - Start with Content */}
      <div className="px-4 md:px-6 py-8 md:py-12 space-y-12 max-w-5xl mx-auto">
        {/* Personal Greeting */}
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
            Events You Registered To:
          </h1>
          <p className="text-lg text-foreground/70">
            Here&apos;s what&apos;s waiting for you today, {displayName}
          </p>
          <p className="text-sm text-muted-foreground">
            Check off activities as you complete them
          </p>
        </div>

        {/* Daily Progress Indicator */}
        <div className="glass rounded-2xl p-6 shadow-warm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">Today&apos;s Progress</span>
              <span className="text-sm text-accent font-bold">
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scheduled Activities Timeline - Grouped by Day */}
        <section className="space-y-8">
          <h2 className="text-lg font-semibold text-primary">Your Schedule</h2>

          {(() => {
            // Group activities by date
            const grouped: Record<string, ScheduledActivity[]> = {};
            allActivities.forEach(a => {
              if (!grouped[a.date]) grouped[a.date] = [];
              grouped[a.date].push(a);
            });
            // Sort groups by date, tasks by time
            const sortedDates = Object.keys(grouped).sort();
            return sortedDates.map(date => {
              const dayActivities = grouped[date].sort((a, b) => {
                const parseTime = (t: string) => {
                  const [time, ampm] = t.split(' ');
                  let [h, m] = time.split(':').map(Number);
                  if (ampm === 'PM' && h !== 12) h += 12;
                  if (ampm === 'AM' && h === 12) h = 0;
                  return h * 60 + m;
                };
                return parseTime(a.time) - parseTime(b.time);
              });
              const dateObj = new Date(date + 'T00:00:00');
              const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

              return (
                <div key={date} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-accent to-secondary text-white rounded-xl px-5 py-3 text-center shadow-warm">
                      <div className="text-2xl font-bold">{dateObj.getDate()}</div>
                      <div className="text-xs uppercase tracking-wider opacity-90">
                        {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-primary">{dayLabel}</h3>
                      <p className="text-sm text-muted-foreground">{dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}</p>
                    </div>
                  </div>

                  {/* Tasks for this day */}
                  {dayActivities.map((activity) => {
                    const isChecked = checkedActivities.has(activity.id);
                    return (
              <div
                key={activity.id}
                className={`glass rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all group ${
                  isChecked ? 'opacity-75' : ''
                }`}
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCheck(activity.id)}
                      className="flex-shrink-0 self-start"
                      aria-label={isChecked ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-7 h-7 text-secondary" />
                      ) : (
                        <Square className="w-7 h-7 text-muted-foreground hover:text-secondary transition-colors" />
                      )}
                    </button>

                    {/* Time Card */}
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl px-5 py-4 text-center border border-accent/30">
                        <div className="font-bold text-2xl text-accent">
                          {activity.time.split(' ')[0]}
                        </div>
                        <div className="text-xs text-primary uppercase font-semibold tracking-wide">
                          {activity.time.split(' ')[1]}
                        </div>
                      </div>
                    </div>


                    {/* Activity Details */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold text-xl mb-2 ${
                              isChecked ? 'line-through text-muted-foreground' : 'text-primary'
                            }`}>
                              {activity.title}
                            </h3>
                            {activity.fromBooking && (
                              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                Booked
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground/70">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-foreground/70 mb-4 line-clamp-2">
                        {activity.description}
                      </p>

                      {!isChecked && (
                        <button
                          onClick={() => setShowPreparation(activity.id)}
                          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-semibold px-5 py-2 rounded-lg transition-smooth group/btn"
                        >
                          Help Me Prepare
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>

                    {/* Image */}
                    {activity.image && (
                      <div className="relative h-32 w-full md:w-32 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Image
                          src={activity.image}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                        {isChecked && (
                          <div className="absolute inset-0 bg-black/30" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
                  );
                  })}
                </div>
              );
            });
          })()}
        </section>

        {/* Upcoming Activity - Dynamic Section */}
        {upcoming && upcoming.minutesUntil <= 300 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent" />
              Upcoming in {upcoming.minutesUntil} Minutes
            </h2>

            <div className="glass rounded-3xl p-8 md:p-10 border-l-4 border-accent shadow-warm-lg hover:shadow-warm-xl transition-all">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {upcoming.activity.image && (
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src={upcoming.activity.image}
                      alt={upcoming.activity.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                      {upcoming.activity.title}
                    </h3>
                    <div className="flex flex-col gap-2 text-foreground/70">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>Starting at {upcoming.activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{upcoming.activity.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Time until start</div>
                      <div className="text-5xl font-bold text-accent">{upcoming.minutesUntil}m</div>
                    </div>
                    <Button
                      onClick={() => setShowPreparation(upcoming.activity.id)}
                      className="bg-accent hover:bg-accent/90 text-primary font-bold px-8 py-4 rounded-xl text-lg whitespace-nowrap"
                    >
                      Help Me Prepare!
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Emama Suggestions */}
        <section className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl p-6 border border-accent/20">
          <h3 className="font-serif text-xl font-bold text-primary mb-4">Emama&apos;s Suggestions</h3>
          <p className="text-foreground/70 mb-4">
            Based on your schedule, Emama recommends these activities to complement your day:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-xl p-4 border border-border">
              <h4 className="font-semibold text-primary mb-1">Sunset Walk</h4>
              <p className="text-sm text-muted-foreground">Perfect after the Welcome Feast at 7:00 PM</p>
            </div>
            <div className="bg-white/50 rounded-xl p-4 border border-border">
              <h4 className="font-semibold text-primary mb-1">Morning Meditation</h4>
              <p className="text-sm text-muted-foreground">Start tomorrow refreshed at 6:30 AM</p>
            </div>
          </div>
        </section>

        {/* Add More Activities CTA */}
        <section className="glass rounded-2xl p-8 text-center shadow-warm border border-accent/20">
          <h3 className="font-serif text-2xl font-bold text-primary mb-3">
            Want to Add More Activities?
          </h3>
          <p className="text-foreground/70 mb-6">
            <span className="font-semibold text-accent">Emama Zinashe</span> will find the perfect experiences for your schedule based on your interests
          </p>
          <button
            onClick={async () => {
              setAddingActivities(true);
              try {
                // Fetch preferences to inform AI
                const prefsRes = await fetch('/api/preferences');
                const prefs = await prefsRes.ok ? await prefsRes.json() : {};
                const prefsStr = prefs.favorite_foods?.length || prefs.activities?.length
                  ? `Interests: ${(prefs.favorite_foods || []).join(', ')}. Activities: ${(prefs.activities || []).join(', ')}. Personality: ${prefs.personality_type || ''}. Traveling: ${prefs.travel_context || ''}.`
                  : '';

                // Get AI suggestions
                const aiRes = await fetch('/api/ai-chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: 'discovery', message: `Suggest 2 activities for a resort schedule. ${prefsStr}` }),
                });
                const aiData = await aiRes.json();

                // Add to schedule
                const newActivities: ScheduledActivity[] = [
                  {
                    id: `ai-${Date.now()}-1`,
                    date: '2026-04-19',
                    time: '3:00 PM',
                    title: aiData.activity?.name || 'Cultural Experience',
                    location: 'Resort Venue',
                    description: aiData.reasoning || 'Curated by Emama Zinashe for you',
                    whatToWear: ['Comfortable clothing', 'Appropriate footwear'],
                    preparation: ['Arrive 10 minutes early', 'Bring an open mind'],
                    image: '/culture-hero.jpg',
                    completed: false,
                    fromBooking: false,
                  },
                  {
                    id: `ai-${Date.now()}-2`,
                    date: '2026-04-20',
                    time: '5:00 PM',
                    title: aiData.meal?.name || 'Sunset Coffee Ceremony',
                    location: 'Garden Pavilion',
                    description: 'A relaxing Ethiopian coffee ceremony to unwind',
                    whatToWear: ['Light, comfortable clothing'],
                    preparation: ['Come hungry', 'Enjoy the experience'],
                    image: '/buna-ceremony.jpg',
                    completed: false,
                    fromBooking: false,
                  },
                ];
                setAllActivities(prev => [...prev, ...newActivities]);
              } catch (err) {
                console.error('Failed to add activities:', err);
              }
              setAddingActivities(false);
            }}
            disabled={addingActivities}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3 rounded-lg transition-smooth disabled:opacity-60"
          >
            {addingActivities ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" /> Emama is finding activities...
              </>
            ) : (
              <>
                Ask Emama <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </section>


        {/* Emotional Closing Message */}
        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-8 text-center border border-secondary/20">
          <p className="text-foreground/80 leading-relaxed italic">
            Every moment on your schedule has been thoughtfully curated. These are not just activities—they&apos;re invitations into our culture, our family, and your home away from home. Enjoy every second.
          </p>
        </div>
      </div>

      {/* Preparation Modal */}
      {showPreparation && allActivities.find(a => a.id === showPreparation) && (() => {
        const activity = allActivities.find(a => a.id === showPreparation)!;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="relative h-48 w-full">
                {activity.image && <Image src={activity.image} alt={activity.title} fill className="object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setShowPreparation(null)} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-smooth" aria-label="Close">✕</button>
              </div>
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-primary mb-2">{activity.title}</h2>
                  <div className="flex items-center gap-4 text-foreground/70">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{activity.time}</span></div>
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{activity.location}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">👔 What to Wear</h3>
                  <ul className="space-y-3">
                    {activity.whatToWear.map((item, idx) => <li key={idx} className="flex gap-3"><span className="text-accent font-bold">•</span><span className="text-foreground/80">{item}</span></li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">✓ Preparation Tips</h3>
                  <ul className="space-y-3">
                    {activity.preparation.map((tip, idx) => <li key={idx} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" /><span className="text-foreground/80">{tip}</span></li>)}
                  </ul>
                </div>
                <Link href="/little-ethiopia" className="bg-primary/5 rounded-xl p-5 border border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-smooth">
                  <div><p className="text-sm font-semibold text-primary mb-1">Want to learn more?</p><p className="text-xs text-muted-foreground">Explore traditions & cultural context</p></div>
                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </Link>
                <button onClick={() => setShowPreparation(null)} className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-3 rounded-lg transition-smooth">Ready to Go!</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Emama Zinashe Floating AI Assistant */}
      <EmamaAssistant
        page="schedule"
        onRecommend={() => setShowResult(true)}
      />

      {/* Emama Result Display */}
      {showResult && (
        <EmamaResultDisplay
          title="Activities for Your Perfect Day"
          message="I have found the most wonderful experiences for you!"
          items={[
            { icon: '☕', label: 'Coffee Ceremony - 10:00 AM', description: 'Traditional Ethiopian coffee at Garden Pavilion' },
            { icon: '🎲', label: 'Gebeta Game - 2:00 PM', description: 'Ancient strategy game with fellow guests' },
            { icon: '🌅', label: 'Sunset Walk - 5:30 PM', description: 'Scenic walk around the resort grounds' },
          ]}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}