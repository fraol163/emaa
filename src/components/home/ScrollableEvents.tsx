'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  description: string;
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
    color: 'bg-amber-100',
    image: '/buna-ceremony.jpg',
    link: '/little-ethiopia',
  },
  {
    id: '2',
    title: 'Dinner Service',
    time: '6:30 PM',
    description: 'Family-style dining',
    color: 'bg-orange-100',
    image: '/dining-hall.jpg',
    link: '/gebeta',
  },
  {
    id: '3',
    title: 'Evening Music',
    time: '8:00 PM',
    description: 'Traditional performances',
    color: 'bg-rose-100',
    image: '/culture-hero.jpg',
    link: '/events',
  },
  {
    id: '4',
    title: 'Spa Session',
    time: '2:00 PM',
    description: 'Relaxation & wellness',
    color: 'bg-green-100',
    image: '/spa-wellness.jpg',
    link: '/comfort',
  },
];

export default function ScrollableEvents() {
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
                <Link href={event.link} className="block w-full mt-2 bg-white/80 hover:bg-white text-primary font-semibold py-2 rounded-lg text-center transition-smooth">
                  Learn More
                </Link>
              </div>
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
