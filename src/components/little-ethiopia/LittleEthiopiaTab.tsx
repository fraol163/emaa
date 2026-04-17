'use client';
import EmamaAssistant from '@/src/components/shared/EmamaAssistant';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Heart,
  Search,
  X,
  Clock,
  Users,
  MapPin,
  Sparkles,
  Filter,
} from 'lucide-react';

// Types
interface CulturalExperience {
  id: string;
  title: string;
  type: 'Ceremony' | 'Game' | 'Story' | 'Dining' | 'Music' | 'Dance';
  image: string;
  description: string;
  shortDescription: string;
  time: string;
  duration: string;
  guests: number;
  location: string;
  price: string;
  aiReason?: string;
}

// Mock data for cultural experiences
const allExperiences: CulturalExperience[] = [
  {
    id: 'exp1',
    title: 'Coffee Ceremony - Buna',
    type: 'Ceremony',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_1_2026-04-05_14-24-19-RkG1mVM0fQF3JPWeVguWJwMjkA4MfR.jpg',
    description: 'The Ethiopian coffee ceremony is a ritual of connection, patience, and warmth. Experience the ancient art of roasting, grinding, and brewing while joining our family in this sacred tradition. The aroma fills the room as stories are shared and time slows down. This ceremony has been passed down through generations, each step carrying deep meaning and respect for the coffee bean that Ethiopia gifted to the world.',
    shortDescription: 'Traditional Ethiopian coffee ritual with roasting, grinding & brewing',
    time: '3:00 PM',
    duration: '1.5 hours',
    guests: 8,
    location: 'Garden Pavilion',
    price: '$25',
    aiReason: 'You loved warm cultural experiences during your last visit',
  },
  {
    id: 'exp2',
    title: 'Gebeta - Ancient Strategy',
    type: 'Game',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2_2026-04-05_14-24-19-zOyeGxaqdYU6ev9q0H0iGGvLUGMtSM.jpg',
    description: 'Gebeta (Mancala) has been played in Ethiopia for over a thousand years. This ancient game of strategy and skill is played with stones on a beautifully carved wooden board. It requires deep strategic thinking and patience, teaching players about balance and foresight. Many Ethiopian legends speak of great Gebeta masters whose games decided the fate of kingdoms.',
    shortDescription: 'Ancient strategy game played with stones on wooden boards',
    time: '4:00 PM',
    duration: '1 hour',
    guests: 12,
    location: 'Cultural Lounge',
    price: '$20',
    aiReason: 'Perfect for your love of strategy and friendly competition',
  },
  {
    id: 'exp3',
    title: 'Eskista Dance Workshop',
    type: 'Dance',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2_2026-04-05_17-28-14-YTBg7YEgDFZsLTz7CTA9JiswgVLyK1.jpg',
    description: 'Eskista is the vibrant, joyful dance of Ethiopia — a celebration of life where shoulders shimmy and hearts soar. The intricate shoulder movements tell stories of love, war, and celebration. No experience necessary, just bring your spirit and willingness to celebrate with us in movement and music. Our dance masters will guide you through the basics while sharing the rich history behind each movement.',
    shortDescription: 'Learn the famous Ethiopian shoulder dance with live music',
    time: '6:00 PM',
    duration: '1 hour',
    guests: 20,
    location: 'Dance Hall',
    price: '$30',
    aiReason: 'Your love for music and movement makes this perfect for you',
  },
  {
    id: 'exp4',
    title: 'Gursha - Sharing Love',
    type: 'Dining',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_1_2026-04-05_17-28-14-PtlYA6YLmNS1yT7fB9LcI6dpug5Jg0.jpg',
    description: 'Gursha is the Ethiopian tradition of hand-feeding loved ones as a sign of respect, affection, and celebration. Experience this intimate gesture around our family table, a moment of genuine human connection that transcends language. The bigger the gursha, the greater the love. Join us for a feast where strangers become family through shared plates and open hearts.',
    shortDescription: 'Traditional hand-feeding ceremony with authentic cuisine',
    time: '7:00 PM',
    duration: '2 hours',
    guests: 15,
    location: 'Family Dining Hall',
    price: '$35',
    aiReason: 'You mentioned loving family-style dining experiences',
  },
  {
    id: 'exp5',
    title: 'Dama - Ethiopian Checkers',
    type: 'Game',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_3_2026-04-05_17-28-14-83sr5YMVPHAc8tQUN38E5yBIEF9MoN.jpg',
    description: 'Dama is a beloved board game similar to checkers, enjoyed across Ethiopia during coffee ceremonies and family gatherings. Dama represents the Ethiopian tradition of intellectual pursuit and friendly competition. Many legendary matches have shaped Ethiopian culture, with stories of games lasting for days.',
    shortDescription: 'Classic Ethiopian board game perfect for all ages',
    time: '2:00 PM',
    duration: '45 mins',
    guests: 10,
    location: 'Game Room',
    price: '$15',
    aiReason: 'Your interest in board games and quality time with others',
  },
  {
    id: 'exp6',
    title: 'Injera Megager - Making Injera',
    type: 'Dining',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_6_2026-04-05_17-28-14-NVy9glKyvd0iMg4I2qJ34PRSldaUV8.jpg',
    description: 'Learn the art of making Ethiopia\'s beloved spongy flatbread, injera. Our master cooks will guide you through the entire process - from preparing the teff batter to pouring it on the traditional clay plate (mitad). Watch as the bubbles form the signature honeycomb texture, and experience the satisfaction of creating this staple food that has nourished Ethiopians for centuries.',
    shortDescription: 'Learn to make traditional Ethiopian injera bread',
    time: '10:00 AM',
    duration: '2 hours',
    guests: 8,
    location: 'Traditional Kitchen',
    price: '$30',
    aiReason: 'Your passion for cooking and learning new culinary traditions',
  },
  {
    id: 'exp7',
    title: 'Ethiopian Storytelling',
    type: 'Story',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_4_2026-04-05_17-28-14-WK248wR3rxsuoU99QWbu5ovRkSIBCd.jpg',
    description: 'Gather around the fire as our elders share ancient Ethiopian tales passed down through generations. These stories carry wisdom, humor, and the spirit of our ancestors. From the legend of the Queen of Sheba to fables of clever animals, each tale offers insights into Ethiopian values and history.',
    shortDescription: 'Ancient tales and legends shared by our storytelling elders',
    time: '8:00 PM',
    duration: '1.5 hours',
    guests: 25,
    location: 'Firepit Circle',
    price: '$20',
    aiReason: 'Your love for history, folklore and meaningful conversations',
  },
  {
    id: 'exp8',
    title: 'Traditional Music Night',
    type: 'Music',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_5_2026-04-05_17-28-14-gn2pdGqaFoIQdHIj3NpBrFUxKFPian.jpg',
    description: 'Experience the soulful sounds of Ethiopia with live performances featuring the masinko (single-stringed fiddle), krar (lyre), and washint (bamboo flute). Our musicians will transport you through centuries of Ethiopian musical tradition, from spiritual hymns to celebratory tunes.',
    shortDescription: 'Live Ethiopian music with traditional instruments',
    time: '7:30 PM',
    duration: '2 hours',
    guests: 30,
    location: 'Main Stage',
    price: '$25',
    aiReason: 'Your appreciation for live performances and cultural arts',
  },
];

// AI recommended experiences (top 3)
const aiRecommendedIds = ['exp1', 'exp2', 'exp4'];

type FilterType = 'All' | 'Ceremonies' | 'Games' | 'Stories' | 'Dining' | 'Music';

const filterMapping: Record<FilterType, CulturalExperience['type'][]> = {
  All: ['Ceremony', 'Game', 'Story', 'Dining', 'Music', 'Dance'],
  Ceremonies: ['Ceremony'],
  Games: ['Game'],
  Stories: ['Story'],
  Dining: ['Dining'],
  Music: ['Music', 'Dance'],
};

export default function LittleEthiopiaTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedExperience, setSelectedExperience] = useState<CulturalExperience | null>(null);
  const [savedExperiences, setSavedExperiences] = useState<Set<string>>(new Set());
  const [joinedExperiences, setJoinedExperiences] = useState<Set<string>>(new Set());
  const [showEmamaChat, setShowEmamaChat] = useState(true);
  const [emamaRecommendation, setEmamaRecommendation] = useState<CulturalExperience | null>(null);
  const [emamaDismissed, setEmamaDismissed] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  const handleParticipate = (experienceId: string, experienceTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJoinedExperiences((prev) => new Set(prev).add(experienceId));
    // Close modals after joining
    setTimeout(() => {
      setSelectedExperience(null);
      setEmamaRecommendation(null);
    }, 800);
  };

  const filters: FilterType[] = ['All', 'Ceremonies', 'Games', 'Stories', 'Dining', 'Music'];

  const matchesSearch = (exp: CulturalExperience) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return exp.title.toLowerCase().includes(q) ||
           exp.type.toLowerCase().includes(q) ||
           exp.description.toLowerCase().includes(q) ||
           exp.shortDescription.toLowerCase().includes(q) ||
           exp.location.toLowerCase().includes(q);
  };

  const aiRecommended = allExperiences.filter((exp) =>
    aiRecommendedIds.includes(exp.id) && matchesSearch(exp) && filterMapping[activeFilter].includes(exp.type)
  );

  const filteredExperiences = allExperiences.filter((exp) =>
    !aiRecommendedIds.includes(exp.id) && filterMapping[activeFilter].includes(exp.type) && matchesSearch(exp)
  );

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedExperiences((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleEmamaYes = () => {
    // Get a random recommendation from experiences not already in AI recommended
    const otherExperiences = allExperiences.filter((exp) => !aiRecommendedIds.includes(exp.id));
    const randomIndex = Math.floor(Math.random() * otherExperiences.length);
    setEmamaRecommendation(otherExperiences[randomIndex]);
    setShowEmamaChat(false);
  };

  const handleEmamaLater = () => {
    setShowEmamaChat(false);
    setEmamaDismissed(true);
  };

  const getTypeColor = (type: CulturalExperience['type']) => {
    const colors: Record<CulturalExperience['type'], string> = {
      Ceremony: 'bg-amber-100 text-amber-800 border-amber-200',
      Game: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Story: 'bg-purple-100 text-purple-800 border-purple-200',
      Dining: 'bg-rose-100 text-rose-800 border-rose-200',
      Music: 'bg-blue-100 text-blue-800 border-blue-200',
      Dance: 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-80 md:h-96 lg:h-[500px] overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_7_2026-04-05_17-28-14-9SvPmQxMSOMf3GawAONXzCvYgGnyIg.jpg"
          alt="Ethiopian Family Dining Together"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-5">
          <h1 className="text-white font-serif text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">
            Little Ethiopia
          </h1>

          <p className="text-white/95 text-base md:text-lg lg:text-xl font-light drop-shadow-lg max-w-2xl leading-relaxed">
            The heart of home, right here in your resort. Rediscover the warmth, stories, games, and rituals that make Ethiopia family.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cultural experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-10 space-y-16 max-w-7xl mx-auto">
        {/* Emama's Personalized Recommendation (if user clicked Yes) */}
        {emamaRecommendation && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-2xl">
                👵
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Emama&apos;s Pick for You</h2>
                <p className="text-muted-foreground text-sm">A special moment chosen just for you</p>
              </div>
            </div>
            <div
              className="glass rounded-2xl overflow-hidden shadow-warm hover:shadow-xl transition-all cursor-pointer border-2 border-accent/30"
              onClick={() => setSelectedExperience(emamaRecommendation)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                  <Image
                    src={emamaRecommendation.image}
                    alt={emamaRecommendation.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3 space-y-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(emamaRecommendation.type)}`}>
                    {emamaRecommendation.type}
                  </span>
                  <h3 className="font-semibold text-xl text-primary">{emamaRecommendation.title}</h3>
                  <p className="text-foreground/70">{emamaRecommendation.shortDescription}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {emamaRecommendation.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {emamaRecommendation.guests} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {emamaRecommendation.location}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-accent">
                      {emamaRecommendation.price}
                    </span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExperience(emamaRecommendation);
                      }}
                      className="bg-accent hover:bg-accent/90 text-primary font-semibold px-6 py-2.5 rounded-lg transition-all"
                    >
                      Teret Teret
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmamaRecommendation(null);
                      }}
                      className="bg-muted hover:bg-muted/80 text-foreground font-medium px-4 py-2.5 rounded-lg transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section A: Emama's Recommendations */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full border border-accent/40">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Personalized for You</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              Emama&apos;s Recommendations for You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Emama Zinashe has handpicked these experiences just for you based on your interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommended.map((exp) => {
              const isSaved = savedExperiences.has(exp.id);
              return (
                <div
                  key={exp.id}
                  className="glass rounded-2xl overflow-hidden shadow-warm hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
                  onClick={() => setSelectedExperience(exp)}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Type Badge */}
                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(exp.type)}`}>
                      {exp.type}
                    </span>

                    {/* Price Badge */}
                    <span className="absolute bottom-3 right-3 px-3 py-1.5 text-sm font-bold rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm">
                      {exp.price}
                    </span>

                    {/* Save Button */}
                    <button
                      onClick={(e) => toggleSave(exp.id, e)}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-all backdrop-blur-sm z-10"
                      aria-label="Save experience"
                    >
                      <Heart
                        className={`w-5 h-5 ${isSaved ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                      />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg text-primary line-clamp-1">{exp.title}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-2">{exp.shortDescription}</p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        {exp.time}
                      </span>
                      <span className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                        <Users className="w-3 h-3" />
                        {exp.guests} guests
                      </span>
                      <span className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>

                    {/* AI Reason */}
                    {exp.aiReason && (
                      <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                        <Sparkles className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-accent font-medium">{exp.aiReason}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExperience(exp);
                        }}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                      >
                        Teret Teret
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      {joinedExperiences.has(exp.id) ? (
                        <button
                          disabled
                          className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-lg cursor-default text-sm flex items-center justify-center gap-2"
                        >
                          Joined
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleParticipate(exp.id, exp.title, e)}
                          className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                        >
                          Participate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Section B: Explore More */}
        <section ref={exploreRef} className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              Explore More
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover all the cultural experiences waiting for you
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card hover:bg-muted text-foreground border border-border'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Experience Grid */}
          {filteredExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => {
                const isSaved = savedExperiences.has(exp.id);
                return (
                  <div
                    key={exp.id}
                    className="glass rounded-2xl overflow-hidden shadow-warm hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
                    onClick={() => setSelectedExperience(exp)}
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Type Badge */}
                      <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(exp.type)}`}>
                        {exp.type}
                      </span>

                      {/* Price Badge */}
                      <span className="absolute bottom-3 right-3 px-3 py-1.5 text-sm font-bold rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm">
                        {exp.price}
                      </span>

                      {/* Save Button */}
                      <button
                        onClick={(e) => toggleSave(exp.id, e)}
                        className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-all backdrop-blur-sm z-10"
                        aria-label="Save experience"
                      >
                        <Heart
                          className={`w-5 h-5 ${isSaved ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                        />
                      </button>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-semibold text-lg text-primary line-clamp-1">{exp.title}</h3>
                      <p className="text-sm text-foreground/70 line-clamp-2">{exp.shortDescription}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" />
                          {exp.time}
                        </span>
                        <span className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                          <Users className="w-3 h-3" />
                          {exp.guests} guests
                        </span>
                        <span className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExperience(exp);
                          }}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                        >
                          Teret Teret
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        {joinedExperiences.has(exp.id) ? (
                          <button
                            disabled
                            className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-lg cursor-default text-sm flex items-center justify-center gap-2"
                          >
                            Joined
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleParticipate(exp.id, exp.title, e)}
                            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                          >
                            Participate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No experiences found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                className="mt-4 text-accent hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Emama Zinashe Floating AI Assistant - positioned left to not cover chatbot */}
      {!emamaDismissed && (
        <div className="fixed bottom-6 left-6 md:left-28 z-40">
          {showEmamaChat && (
            <div className="absolute bottom-16 left-0 w-80 glass rounded-2xl shadow-warm p-5 space-y-4 animate-in slide-in-from-bottom-2 fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  👵🏾
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Emama Zinashe</p>
                  <p className="text-sm text-foreground/80 mt-1">
                    Would you like me to recommend the perfect cultural moment for you today? I know just the experience that will warm your heart.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEmamaYes}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-medium rounded-lg text-sm transition-all"
                >
                  Yes please
                </button>
                <button
                  onClick={handleEmamaLater}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg text-sm transition-all"
                >
                  Later
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowEmamaChat(!showEmamaChat)}
            className="w-14 h-14 bg-accent hover:bg-accent/90 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          >
            <span className="text-2xl">👵🏾</span>
          </button>
        </div>
      )}

      {/* Emama Recommendation Modal */}
      {emamaRecommendation && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={emamaRecommendation.image}
                alt={emamaRecommendation.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={() => setEmamaRecommendation(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border mb-2 ${getTypeColor(emamaRecommendation.type)}`}>
                  {emamaRecommendation.type}
                </span>
                <h3 className="text-white font-serif text-xl font-bold">{emamaRecommendation.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  👵🏾
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Emama Zinashe recommends:</p>
                  <p className="text-sm text-foreground/80 mt-1">
                    &quot;My dear, I think you would absolutely love {emamaRecommendation.title}. {emamaRecommendation.aiReason ? `${emamaRecommendation.aiReason} - this is exactly what your soul needs.` : emamaRecommendation.shortDescription} It starts at {emamaRecommendation.time} at the {emamaRecommendation.location}. Trust me, you won&apos;t regret it!&quot;
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {emamaRecommendation.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {emamaRecommendation.guests} guests</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {emamaRecommendation.location}</span>
              </div>
              <div className="flex gap-3 pt-2">
                {joinedExperiences.has(emamaRecommendation.id) ? (
                  <button
                    disabled
                    className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg cursor-default"
                  >
                    Joined
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      handleParticipate(emamaRecommendation.id, emamaRecommendation.title, e);
                    }}
                    className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold py-3 rounded-lg transition-all"
                  >
                    Join This Experience
                  </button>
                )}
                <button
                  onClick={() => setEmamaRecommendation(null)}
                  className="px-6 bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 rounded-lg transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experience Detail Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header with Image */}
            <div className="relative h-56 md:h-72 w-full overflow-hidden rounded-t-3xl">
              <Image
                src={selectedExperience.image}
                alt={selectedExperience.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              <button
                onClick={() => setSelectedExperience(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border mb-3 ${getTypeColor(selectedExperience.type)}`}>
                  {selectedExperience.type}
                </span>
                <h2 className="text-white font-serif text-2xl md:text-3xl font-bold drop-shadow-lg">
                  {selectedExperience.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* About Section */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">About This Experience</h3>
                <p className="text-foreground/80 leading-relaxed">{selectedExperience.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/10 rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold text-foreground">{selectedExperience.duration}</p>
                </div>
                <div className="bg-secondary/10 rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Group Size</p>
                  <p className="text-sm font-semibold text-foreground">Up to {selectedExperience.guests}</p>
                </div>
                <div className="bg-secondary/10 rounded-xl p-4 text-center">
                  <MapPin className="w-5 h-5 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-foreground">{selectedExperience.location}</p>
                </div>
                <div className="bg-accent/10 rounded-xl p-4 text-center border border-accent/30">
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-xl font-bold text-accent">{selectedExperience.price}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                {joinedExperiences.has(selectedExperience.id) ? (
                  <button
                    disabled
                    className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg cursor-default text-center"
                  >
                    Joined
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleParticipate(selectedExperience.id, selectedExperience.title, e)}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 rounded-lg transition-all text-center"
                  >
                    Participate Now
                  </button>
                )}
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 rounded-lg transition-all"
                >
                  Close & Explore More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Emama Zinashe Floating AI Assistant */}
      <EmamaAssistant
        page="little-ethiopia"
        onRecommend={() => {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />
    </div>
  );
}