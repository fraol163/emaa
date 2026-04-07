'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin, Clock, X } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  description: string;
  detail: string;
  location: string;
  highlights: string[];
  color: string;
  image: string;
  link: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Buna Ceremony',
    time: '3:00 PM',
    description: 'Join us for traditional coffee',
    detail: 'Experience the authentic Ethiopian coffee ceremony — a centuries-old ritual of roasting, grinding, and brewing coffee by hand. Served with popcorn and incense, this is more than coffee; it\'s a cultural journey.',
    location: 'Cultural Center, Main Hall',
    highlights: ['Hand-roasted coffee beans', 'Traditional incense ceremony', 'Served with popcorn & kolo', 'Live cultural narration'],
    color: 'bg-amber-100',
    image: '/buna-ceremony.jpg',
    link: '/little-ethiopia',
  },
  {
    id: '2',
    title: 'Dinner Service',
    time: '6:30 PM',
    description: 'Family-style dining',
    detail: 'Gather around for a communal Ethiopian dining experience. Share injera with a variety of traditional stews — tibs, doro wat, misir, and more — served on a single platter in true Ethiopian fashion.',
    location: 'Gebeta Restaurant, Terrace',
    highlights: ['Injera & shared platters', 'Live cooking stations', 'Vegetarian & vegan options', 'Lake-view terrace seating'],
    color: 'bg-orange-100',
    image: '/dining-hall.jpg',
    link: '/gebeta',
  },
  {
    id: '3',
    title: 'Evening Music',
    time: '8:00 PM',
    description: 'Traditional performances',
    detail: 'An evening of Ethiopian music and dance — from the mesmerizing shoulder movements of eskista to live masinko and krar performances. Feel the rhythm of centuries-old traditions under the stars.',
    location: 'Amphitheater, Garden Level',
    highlights: ['Live eskista dance', 'Traditional instruments', 'Audience participation', 'Under the stars setting'],
    color: 'bg-rose-100',
    image: '/culture-hero.jpg',
    link: '/events',
  },
  {
    id: '4',
    title: 'Spa Session',
    time: '2:00 PM',
    description: 'Relaxation & wellness',
    detail: 'Rejuvenate with Ethiopian-inspired wellness treatments. From coffee scrubs using local beans to eucalyptus steam therapy — our spa blends ancient remedies with modern relaxation techniques.',
    location: 'Serenity Spa, Level 2',
    highlights: ['Coffee body scrub', 'Eucalyptus steam room', 'Hot stone therapy', 'Meditation garden access'],
    color: 'bg-green-100',
    image: '/spa-wellness.jpg',
    link: '/comfort',
  },
];

export default function ScrollableEvents() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="space-y-4 px-4 md:px-6 py-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">
          What&apos;s Happening Now
        </h2>
      </div>

      {/* Scrollable Events Container */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className={`flex-shrink-0 w-72 ${event.color} rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-md transition-smooth snap-start`}
            >
              {/* Event Image */}
              <div className="relative h-32 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg text-primary">{event.title}</h3>
                  <span className="text-xs font-bold bg-white/50 px-3 py-1 rounded-full">
                    {event.time}
                  </span>
                </div>
                <p className="text-sm text-foreground/70">{event.description}</p>
                <button
                  onClick={() => toggleExpand(event.id)}
                  className="block w-full mt-2 bg-white/80 hover:bg-white text-primary font-semibold py-2 rounded-lg text-center transition-smooth"
                >
                  {expandedId === event.id ? 'Show Less' : 'Learn More'}
                </button>
              </div>

              {/* Inline Detail Card */}
              {expandedId === event.id && (
                <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/90 rounded-xl p-4 space-y-3">
                    {/* Close button */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-primary">{event.title}</h4>
                      <button
                        onClick={() => setExpandedId(null)}
                        className="p-1 rounded-full hover:bg-black/5 transition-smooth"
                        aria-label="Close details"
                      >
                        <X className="w-4 h-4 text-foreground/60" />
                      </button>
                    </div>

                    {/* Detail text */}
                    <p className="text-sm text-foreground/80">{event.detail}</p>

                    {/* Location & Time */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-primary">Highlights</p>
                      <ul className="space-y-1">
                        {event.highlights.map((h, i) => (
                          <li key={i} className="text-xs text-foreground/70 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link
                      href={event.link}
                      className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg text-center text-sm transition-smooth"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Explore More Events Button */}
          <Link
            href="/events"
            className="flex-shrink-0 w-72 glass rounded-2xl p-6 shadow-warm hover:shadow-warm-md transition-smooth snap-start flex flex-col items-center justify-center gap-4"
          >
            <h3 className="font-serif text-lg font-bold text-primary text-center">
              Explore More Events
            </h3>
            <ChevronRight className="w-8 h-8 text-accent" />
          </Link>
        </div>
      </div>
    </section>
  );
}
