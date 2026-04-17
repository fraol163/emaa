'use client';
import EmamaAssistant from '@/src/components/shared/EmamaAssistant';

import { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  Search,
  X,
  Clock,
  Users,
  MapPin,
  Sparkles,
  Calendar,
  Wifi,
  Monitor,
  Volume2,
  ChevronRight,
  PartyPopper,
  Building2,
  PenLine,
  Gift,
  Cake,
  Check,
  Loader2,
} from 'lucide-react';

// Types
interface CelebrationPackage {
  id: string;
  title: string;
  image: string;
  description: string;
  priceRange: string;
  guests: string;
  includes: string[];
}

interface MeetingHall {
  id: string;
  name: string;
  image: string;
  capacity: string;
  features: string[];
  description: string;
  pricePerHour: string;
}

interface MyMoment {
  id: string;
  title: string;
  date: string;
  type: 'Celebration' | 'Corporate';
  status: 'Upcoming' | 'Pending' | 'Completed';
  guests: number;
  location: string;
  packageName?: string;
  notes?: string;
}

interface AISuggestion {
  id: string;
  title: string;
  reason: string;
  aiInsight: string;
  image: string;
  urgency?: 'high' | 'medium' | 'low';
  matchScore: number;
  linkType: 'package' | 'hall';
  linkId: string;
}

interface AIRecommendation {
  suggestedPackage: CelebrationPackage | null;
  suggestedHall: MeetingHall | null;
  estimatedCost: string;
  recommendedAddons: string[];
  bestDate: string;
  aiMessage: string;
}

// Mock data
const celebrationPackages: CelebrationPackage[] = [
  {
    id: 'pkg1', title: 'Birthday Celebration',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_1_2026-04-05_21-36-42-8TiIhuWppsEFSyDKkcYx90LGo6oww9.jpg',
    description: 'Make your special day unforgettable with our birthday package. Includes decoration, cake, traditional coffee ceremony, and a private dining experience.',
    priceRange: '$150 - $500', guests: '10-50 guests',
    includes: ['Custom decoration', 'Birthday cake', 'Coffee ceremony', 'Private dining', 'Live music option'],
  },
  {
    id: 'pkg2', title: 'Anniversary Dinner',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2_2026-04-05_21-36-42-85R2j1DVTptAuwb9CrsCXCy6ewZamE.jpg',
    description: 'Celebrate your love story with an intimate anniversary dinner featuring traditional Ethiopian cuisine, romantic ambiance, and personalized service.',
    priceRange: '$200 - $400', guests: '2-20 guests',
    includes: ['Romantic setup', 'Multi-course dinner', 'Champagne toast', 'Live traditional music', 'Photo session'],
  },
  {
    id: 'pkg3', title: 'Wedding Reception',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_3_2026-04-05_21-36-42-6275S8upcViWadpo9NbLRvhCQpLsjr.jpg',
    description: 'Host your dream wedding reception at Kuriftu African Village. Our team will create a magical celebration blending Ethiopian traditions with your vision.',
    priceRange: '$2,000 - $10,000', guests: '50-300 guests',
    includes: ['Full venue decoration', 'Catering', 'Traditional ceremony', 'Entertainment', 'Coordination team'],
  },
  {
    id: 'pkg4', title: 'Family Reunion',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_4_2026-04-05_21-36-42-7tAKyJhcvcVQT3yH1MnXMNooKNdvkC.jpg',
    description: 'Bring your family together for a heartwarming reunion. Enjoy shared meals, games, and create lasting memories in our beautiful grounds.',
    priceRange: '$300 - $1,500', guests: '20-100 guests',
    includes: ['Group activities', 'Family-style dining', 'Games & entertainment', 'Photo booth', 'Custom menu'],
  },
  {
    id: 'pkg5', title: 'Graduation Party',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_5_2026-04-05_21-36-42-m5eOSxoXYxvC7P8RgKM2ynyYrVTkSg.jpg',
    description: 'Celebrate academic achievements with a memorable graduation party. Honor the graduate with a special ceremony and feast.',
    priceRange: '$200 - $800', guests: '15-75 guests',
    includes: ['Achievement ceremony', 'Buffet dining', 'Decoration', 'DJ services', 'Gift table setup'],
  },
  {
    id: 'pkg6', title: 'Baby Shower',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_6_2026-04-05_21-36-42-xJfbJsF34V1lVlBhFwHQyWbPEhfNiq.jpg',
    description: 'Welcome your little one with a beautiful baby shower celebration. Gentle, joyful, and filled with blessings for the parents-to-be.',
    priceRange: '$150 - $600', guests: '10-40 guests',
    includes: ['Theme decoration', 'Games & activities', 'Refreshments', 'Gift area', 'Memory book station'],
  },
];

const meetingHalls: MeetingHall[] = [
  { id: 'hall1', name: 'Haile Selassie Hall', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80', capacity: '200 guests', features: ['WiFi', 'Projector', 'Sound System', 'Stage'], description: 'Our grandest hall, perfect for large conferences and gala events.', pricePerHour: '$150/hour' },
  { id: 'hall2', name: 'Kwame Nkrumah Hall', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', capacity: '150 guests', features: ['WiFi', 'Projector', 'Sound System', 'Breakout rooms'], description: 'Ideal for corporate retreats and workshops.', pricePerHour: '$120/hour' },
  { id: 'hall3', name: 'Jomo Kenyatta Hall', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', capacity: '100 guests', features: ['WiFi', 'Projector', 'Video conferencing', 'Catering area'], description: 'A versatile space for seminars and training sessions.', pricePerHour: '$100/hour' },
  { id: 'hall4', name: 'Gamal Abdel Nasser Hall', image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80', capacity: '95 sqm', features: ['WiFi', 'Smart TV', 'Sound System', 'Recording equipment'], description: 'A serene environment for meaningful exchanges.', pricePerHour: '$80/hour' },
  { id: 'hall5', name: 'Julius Nyerere Hall', image: 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800&q=80', capacity: '88 sqm', features: ['WiFi', 'Projector', 'Whiteboard', 'Coffee station'], description: 'An intimate space for contemplation and connection.', pricePerHour: '$60/hour' },
  { id: 'hall6', name: 'Modibo Keita Hall', image: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&q=80', capacity: '61 sqm', features: ['WiFi', 'TV Screen', 'Conference phone', 'Natural lighting'], description: 'An elegant space designed for intimate meetings.', pricePerHour: '$50/hour' },
  { id: 'hall7', name: 'Pan-African Hall', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', capacity: '300 guests', features: ['WiFi', 'Multiple projectors', 'Stage', 'Translation booths'], description: 'Our largest venue for international conferences.', pricePerHour: '$200/hour' },
];

const emamasSuggestions: AISuggestion[] = [
  {
    id: 'sug1', title: 'Your Birthday is Coming Up!', reason: 'April 18th is just around the corner',
    aiInsight: 'Based on your profile, you love intimate gatherings. How about a beautiful birthday brunch with 15-20 close friends?',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_1_2026-04-05_22-49-49-o2hZUexeLafcPjuvwkATt8amcJ4LOp.jpg', urgency: 'high', matchScore: 95, linkType: 'package', linkId: 'pkg1',
  },
  {
    id: 'sug2', title: 'Team Offsite Retreat', reason: 'You mentioned work stress during your last visit',
    aiInsight: 'I noticed you lead a team of 12. Our Nyerere Hall would be perfect for a rejuvenating team retreat.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2_2026-04-05_22-49-49-kK0wmItYngAYsKPXe25v2sDaYMTd0q.jpg', urgency: 'medium', matchScore: 88, linkType: 'hall', linkId: 'hall5',
  },
  {
    id: 'sug3', title: 'Family Reunion Getaway', reason: "Your parents' anniversary is in May",
    aiInsight: "Combine a family reunion with celebrating your parents' 35th anniversary - we can create a beautiful multi-generational celebration!",
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_3_2026-04-05_22-49-49-HJIM1AjzVUWLLvWW66NbhVtsWcYjui.jpg', urgency: 'medium', matchScore: 82, linkType: 'package', linkId: 'pkg4',
  },
];

export default function EventsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<CelebrationPackage | null>(null);
  const [selectedHall, setSelectedHall] = useState<MeetingHall | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<MyMoment | null>(null);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showEmamaChat, setShowEmamaChat] = useState(true);
  const [emamaDismissed, setEmamaDismissed] = useState(false);
  const [showEmamaSuggestions, setShowEmamaSuggestions] = useState(false);
  const [directSubmitted, setDirectSubmitted] = useState(false);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [bookedItems, setBookedItems] = useState<Set<string>>(new Set());
  const [moments, setMoments] = useState<MyMoment[]>([
    { id: 'mom1', title: 'Abebe\'s Birthday Party', date: 'April 15, 2026', type: 'Celebration', status: 'Upcoming', guests: 25, location: 'Garden Pavilion', packageName: 'Birthday Celebration', notes: 'Surprise party - please coordinate with family members' },
    { id: 'mom2', title: 'Q2 Team Planning', date: 'April 20, 2026', type: 'Corporate', status: 'Pending', guests: 15, location: 'Nyerere Hall', notes: 'Waiting for venue confirmation' },
  ]);

  const [eventForm, setEventForm] = useState({ title: '', date: '', guests: '', type: 'Celebration' as 'Celebration' | 'Corporate' | 'Other', specialRequests: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAIRecommendation] = useState<AIRecommendation | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItems(prev => { const u = new Set(prev); u.has(id) ? u.delete(id) : u.add(id); return u; });
  };

  const handleBook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookedItems(prev => new Set(prev).add(id));
    // Add to My Moments
    const pkg = celebrationPackages.find(p => p.id === id);
    const hall = meetingHalls.find(h => h.id === id);
    if (pkg || hall) {
      const newMoment: MyMoment = {
        id: `moment-${Date.now()}`,
        title: pkg?.title || hall?.name || 'Event',
        date: 'TBD',
        type: pkg ? 'Celebration' : 'Corporate',
        status: 'Pending',
        guests: 20,
        location: 'TBD',
        packageName: pkg?.title,
        notes: 'Requested via Host Your Moment',
      };
      setMoments(prev => [newMoment, ...prev]);
    }
    setTimeout(() => { setSelectedPackage(null); setSelectedHall(null); }, 1200);
  };

  const handleCancelRequest = (momentId: string) => { setMoments(prev => prev.filter(m => m.id !== momentId)); setSelectedMoment(null); };

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    setShowEmamaSuggestions(false);
    if (suggestion.linkType === 'package') {
      const pkg = celebrationPackages.find(p => p.id === suggestion.linkId);
      if (pkg) setSelectedPackage(pkg);
    } else {
      const hall = meetingHalls.find(h => h.id === suggestion.linkId);
      if (hall) setSelectedHall(hall);
    }
  };

  const analyzeEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.guests) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const guestCount = parseInt(eventForm.guests) || 20;
      const isCorporate = eventForm.type === 'Corporate';
      let suggestedPackage: CelebrationPackage | null = null;
      let suggestedHall: MeetingHall | null = null;
      if (isCorporate) {
        suggestedHall = meetingHalls.find(h => { const cap = parseInt(h.capacity); return cap >= guestCount && cap <= guestCount * 2; }) || meetingHalls[4];
      } else {
        const t = eventForm.title.toLowerCase();
        if (t.includes('birthday')) suggestedPackage = celebrationPackages[0];
        else if (t.includes('anniversary') || t.includes('wedding')) suggestedPackage = celebrationPackages[1];
        else if (t.includes('family') || t.includes('reunion')) suggestedPackage = celebrationPackages[3];
        else if (t.includes('graduation')) suggestedPackage = celebrationPackages[4];
        else if (t.includes('baby') || t.includes('shower')) suggestedPackage = celebrationPackages[5];
        else suggestedPackage = celebrationPackages[0];
        if (guestCount > 50) suggestedHall = meetingHalls.find(h => parseInt(h.capacity) >= guestCount) || meetingHalls[0];
      }
      let estimatedCost = '';
      if (suggestedPackage) { const b = guestCount * 15; estimatedCost = `$${b} - $${b * 2}`; }
      else if (suggestedHall) { const h = parseInt(suggestedHall.pricePerHour.replace(/\D/g, '')); estimatedCost = `$${h * 4} (4 hours)`; }
      setAIRecommendation({
        suggestedPackage, suggestedHall, estimatedCost,
        recommendedAddons: ['Traditional coffee ceremony', 'Live Ethiopian music', 'Photography package', 'Custom decoration upgrade'],
        bestDate: eventForm.date,
        aiMessage: isCorporate
          ? `For your ${guestCount}-person ${eventForm.title}, I recommend the ${suggestedHall?.name || 'Nyerere Hall'}. It has the perfect setup for productive meetings.`
          : `What a wonderful celebration! For "${eventForm.title}" with ${guestCount} guests, our ${suggestedPackage?.title || 'Birthday Celebration'} package would be perfect.`,
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmitRequest = () => {
    const newMoment: MyMoment = {
      id: `moment-${Date.now()}`, title: eventForm.title, date: eventForm.date,
      type: eventForm.type === 'Corporate' ? 'Corporate' : 'Celebration',
      status: 'Pending', guests: parseInt(eventForm.guests) || 20, location: 'TBD',
      packageName: aiRecommendation?.suggestedPackage?.title,
      notes: eventForm.specialRequests || 'Built with AI recommendations',
    };
    setMoments(prev => [newMoment, ...prev]);
    setRequestSubmitted(true);
  };

  const resetBuildModal = () => { setShowBuildModal(false); setEventForm({ title: '', date: '', guests: '', type: 'Celebration', specialRequests: '' }); setAIRecommendation(null); setRequestSubmitted(false); setIsAnalyzing(false); };
  const handleDirectSubmit = () => {
    const newMoment: MyMoment = { id: `moment-${Date.now()}`, title: eventForm.title, date: eventForm.date, type: eventForm.type === 'Corporate' ? 'Corporate' : 'Celebration', status: 'Pending', guests: parseInt(eventForm.guests) || 20, location: 'TBD', notes: eventForm.specialRequests || 'Direct submission' };
    setMoments(prev => [newMoment, ...prev]);
    setDirectSubmitted(true);
    setTimeout(() => { setShowBuildModal(false); setDirectSubmitted(false); setEventForm({ title: '', date: '', guests: '', type: 'Celebration', specialRequests: '' }); }, 2000);
  };

  const handleEmamaYes = () => { setShowEmamaChat(false); setShowEmamaSuggestions(true); };
  const handleEmamaLater = () => { setShowEmamaChat(false); setEmamaDismissed(true); };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (feature.toLowerCase().includes('projector') || feature.toLowerCase().includes('tv') || feature.toLowerCase().includes('screen')) return <Monitor className="w-4 h-4" />;
    if (feature.toLowerCase().includes('sound')) return <Volume2 className="w-4 h-4" />;
    return <ChevronRight className="w-4 h-4" />;
  };

  const getUrgencyColor = (urgency?: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const filteredPackages = celebrationPackages.filter(pkg => !searchQuery || pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredHalls = meetingHalls.filter(hall => !searchQuery || hall.name.toLowerCase().includes(searchQuery.toLowerCase()) || hall.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-80 md:h-96 lg:h-[500px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&auto=format&fit=crop" alt="Celebration at Kuriftu" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-5">
          <h1 className="text-white font-serif text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">Host Your Moment</h1>
          <p className="text-white/95 text-base md:text-lg lg:text-xl font-light drop-shadow-lg max-w-2xl leading-relaxed">Celebrate, gather, and create your own special moments — in your home</p>
          <button onClick={() => setShowBuildModal(true)} className="mt-4 px-8 py-4 bg-accent hover:bg-accent/90 text-primary font-semibold rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 active:scale-[0.97]">
            <PenLine className="w-5 h-5" /> Build Your Own Event
          </button>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Search celebrations, meetings, or halls..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"><X className="w-4 h-4 text-muted-foreground" /></button>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-16">
        {/* Section 1: Emama's AI Suggestions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-2xl">👵🏾</div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Emama&apos;s Suggestions for You</h2>
              <p className="text-muted-foreground text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" /> AI-personalized event ideas based on your profile</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {emamasSuggestions.map(sug => (
              <div key={sug.id} className="flex-shrink-0 w-80 glass rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all cursor-pointer group" onClick={() => handleSuggestionClick(sug)}>
                <div className="relative h-44">
                  <Image src={sug.image} alt={sug.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(sug.urgency)}`}>{sug.urgency === 'high' ? 'Act Soon' : sug.urgency === 'medium' ? 'Recommended' : 'Suggestion'}</span>
                    <span className="px-2 py-1 bg-accent/90 rounded-full text-xs font-semibold text-primary flex items-center gap-1"><Sparkles className="w-3 h-3" />{sug.matchScore}% Match</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-lg">{sug.title}</h3>
                    <p className="text-white/80 text-sm">{sug.reason}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-2"><span className="text-lg flex-shrink-0">👵🏾</span><p className="text-sm text-foreground/80 italic">&quot;{sug.aiInsight}&quot;</p></div>
                  <button className="w-full mt-3 py-2 bg-accent/20 hover:bg-accent/30 text-accent font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.97]"><Gift className="w-4 h-4" /> Plan This Event</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4"><div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" /><PartyPopper className="w-5 h-5 text-accent" /><div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" /></div>

        {/* Section 2: Celebration Packages */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Celebration Packages</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Ready-made packages for life&apos;s most precious moments</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <div key={pkg.id} className="glass rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all cursor-pointer group" onClick={() => setSelectedPackage(pkg)}>
                <div className="relative h-48">
                  <Image src={pkg.image} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button onClick={e => toggleSave(pkg.id, e)} className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all active:scale-[0.97]">
                    <Heart className={`w-5 h-5 ${savedItems.has(pkg.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3"><h3 className="text-white font-semibold text-lg">{pkg.title}</h3></div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-accent font-semibold">{pkg.priceRange}</span>
                    <span className="text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" />{pkg.guests}</span>
                  </div>
                  <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all text-sm active:scale-[0.97]">See Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4"><div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" /><Building2 className="w-5 h-5 text-accent" /><div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" /></div>

        {/* Section 3: Corporate & Meeting Halls */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Corporate & Meeting Halls</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Professional spaces named after Pan-African leaders</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHalls.map(hall => (
              <div key={hall.id} className="glass rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all cursor-pointer group" onClick={() => setSelectedHall(hall)}>
                <div className="relative h-40">
                  <Image src={hall.image} alt={hall.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold">{hall.name}</h3>
                    <div className="flex items-center justify-between text-white/80 text-sm mt-1">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{hall.capacity}</span>
                      <span className="text-accent font-medium">{hall.pricePerHour}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {hall.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">{getFeatureIcon(feature)}{feature}</span>
                    ))}
                  </div>
                  <button className="w-full py-2.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg transition-all text-sm active:scale-[0.97]">See Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4"><div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" /><Calendar className="w-5 h-5 text-accent" /><div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" /></div>

        {/* Section 4: My Moments */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">My Moments</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Events you&apos;re hosting or have requested</p>
          </div>
          {moments.length > 0 ? (
            <div className="space-y-4">
              {moments.map(moment => (
                <div key={moment.id} className="glass rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-warm hover:shadow-warm-lg transition-all cursor-pointer" onClick={() => setSelectedMoment(moment)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${moment.type === 'Celebration' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                      {moment.type === 'Celebration' ? <PartyPopper className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{moment.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{moment.date}</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{moment.guests} guests</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{moment.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${moment.status === 'Upcoming' ? 'bg-green-100 text-green-800' : moment.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'}`}>
                      {moment.status === 'Pending' ? 'Awaiting Confirmation' : moment.status}
                    </span>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg text-sm transition-all active:scale-[0.97]">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl">
              <PartyPopper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No events yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Start planning your special moment!</p>
              <button onClick={() => setShowBuildModal(true)} className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-primary font-semibold rounded-lg transition-all active:scale-[0.97]">Create Your First Event</button>
            </div>
          )}
        </section>
      </div>

      {/* Package Detail Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative h-56 md:h-72 w-full">
              <Image src={selectedPackage.image} alt={selectedPackage.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelectedPackage(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all"><X className="w-5 h-5 text-white" /></button>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white font-serif text-2xl md:text-3xl font-bold">{selectedPackage.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-white/90 text-sm">
                  <span className="font-semibold text-accent">{selectedPackage.priceRange}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{selectedPackage.guests}</span>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <p className="text-foreground/80 leading-relaxed">{selectedPackage.description}</p>
              <div>
                <h3 className="font-semibold text-foreground mb-3">What&apos;s Included:</h3>
                <ul className="space-y-2">{selectedPackage.includes.map((item, idx) => <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-accent" />{item}</li>)}</ul>
              </div>
              <div className="flex gap-4 pt-2">
                {bookedItems.has(selectedPackage.id) ? (
                  <button disabled className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg cursor-default flex items-center justify-center gap-2"><Check className="w-5 h-5" /> Request Submitted</button>
                ) : (
                  <button onClick={e => handleBook(selectedPackage.id, e)} className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold py-3 rounded-lg transition-all active:scale-[0.97]">Request This Package</button>
                )}
                <button onClick={() => setSelectedPackage(null)} className="px-6 bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 rounded-lg transition-all">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hall Detail Modal */}
      {selectedHall && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative h-56 md:h-72 w-full">
              <Image src={selectedHall.image} alt={selectedHall.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelectedHall(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all"><X className="w-5 h-5 text-white" /></button>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white font-serif text-2xl md:text-3xl font-bold">{selectedHall.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-white/90 text-sm">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{selectedHall.capacity}</span>
                  <span className="text-accent font-semibold">{selectedHall.pricePerHour}</span>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <p className="text-foreground/80 leading-relaxed">{selectedHall.description}</p>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Features:</h3>
                <div className="flex flex-wrap gap-2">{selectedHall.features.map((feature, idx) => <span key={idx} className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm text-foreground">{getFeatureIcon(feature)}{feature}</span>)}</div>
              </div>
              <div className="flex gap-4 pt-2">
                {bookedItems.has(selectedHall.id) ? (
                  <button disabled className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg cursor-default flex items-center justify-center gap-2"><Check className="w-5 h-5" /> Request Submitted</button>
                ) : (
                  <button onClick={e => handleBook(selectedHall.id, e)} className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 rounded-lg transition-all active:scale-[0.97]">Book This Hall</button>
                )}
                <button onClick={() => setSelectedHall(null)} className="px-6 bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 rounded-lg transition-all">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Moment Detail Modal */}
      {selectedMoment && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMoment.type === 'Celebration' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                    {selectedMoment.type === 'Celebration' ? <PartyPopper className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-primary">{selectedMoment.title}</h2>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${selectedMoment.status === 'Upcoming' ? 'bg-green-100 text-green-800' : selectedMoment.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'}`}>
                      {selectedMoment.status === 'Pending' ? 'Request Submitted - Awaiting Confirmation' : selectedMoment.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedMoment(null)} className="p-2 hover:bg-muted rounded-full transition-all"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Date</p><p className="font-semibold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />{selectedMoment.date}</p></div>
                  <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Guests</p><p className="font-semibold text-foreground flex items-center gap-2"><Users className="w-4 h-4 text-accent" />{selectedMoment.guests} guests</p></div>
                </div>
                <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Location</p><p className="font-semibold text-foreground flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" />{selectedMoment.location}</p></div>
                {selectedMoment.packageName && <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Package</p><p className="font-semibold text-foreground flex items-center gap-2"><Gift className="w-4 h-4 text-accent" />{selectedMoment.packageName}</p></div>}
                {selectedMoment.notes && <div className="glass rounded-xl p-4 bg-accent/10"><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm text-foreground/80">{selectedMoment.notes}</p></div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelectedMoment(null)} className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all active:scale-[0.97]">Close</button>
                {selectedMoment.status === 'Pending' && <button onClick={() => handleCancelRequest(selectedMoment.id)} className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-all active:scale-[0.97]">Cancel Request</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Build Your Own Event Modal */}
      {showBuildModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-xl">👵🏾</div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-primary">Build Your Own Event</h2>
                    <p className="text-sm text-muted-foreground">Emama will analyze and suggest the perfect setup</p>
                  </div>
                </div>
                <button onClick={resetBuildModal} className="p-2 hover:bg-muted rounded-full transition-all"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              {!requestSubmitted ? (<>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">What are you celebrating or planning?</label>
                    <input type="text" placeholder="e.g., My daughter's birthday, Team retreat..." value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Preferred Date</label>
                      <input type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Number of Guests</label>
                      <input type="number" placeholder="e.g., 50" value={eventForm.guests} onChange={e => setEventForm({ ...eventForm, guests: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Event Type</label>
                    <div className="flex gap-3">
                      {(['Celebration', 'Corporate', 'Other'] as const).map(type => (
                        <button key={type} onClick={() => setEventForm({ ...eventForm, type })} className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-medium active:scale-[0.97] ${eventForm.type === type ? 'bg-accent text-primary border-accent' : 'bg-card border-border text-foreground hover:border-accent/50'}`}>{type}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Special Requests (optional)</label>
                    <textarea placeholder="Any special requirements, dietary needs, or preferences..." value={eventForm.specialRequests} onChange={e => setEventForm({ ...eventForm, specialRequests: e.target.value })} rows={3} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
                  </div>
                </div>
                {!aiRecommendation && !directSubmitted && (
                  <div className="flex flex-col gap-3">
                    <button onClick={analyzeEvent} disabled={!eventForm.title || !eventForm.date || !eventForm.guests || isAnalyzing} className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.97]">
                      {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Emama is analyzing...</> : <><Sparkles className="w-5 h-5" /> Get AI Recommendations</>}
                    </button>
                    <button onClick={handleDirectSubmit} disabled={!eventForm.title || !eventForm.date || !eventForm.guests || isAnalyzing} className="w-full py-3 bg-secondary hover:bg-secondary/90 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.97]">Submit Request</button>
                    <p className="text-xs text-center text-muted-foreground">Get AI recommendations for the best package and venue, or submit directly</p>
                  </div>
                )}
                {directSubmitted && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-green-600" /></div>
                    <h3 className="text-xl font-bold text-primary">Request Submitted!</h3>
                    <div className="flex items-start gap-3 text-left glass rounded-xl p-4">
                      <span className="text-2xl">👵🏾</span>
                      <p className="text-sm text-foreground/80">&quot;Wonderful, my dear! Your request for &apos;{eventForm.title}&apos; has been submitted. Our team will review it and get back to you soon.&quot;</p>
                    </div>
                  </div>
                )}
                {aiRecommendation && (
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4 bg-accent/10 border border-accent/30">
                      <div className="flex items-start gap-3"><span className="text-2xl">👵🏾</span><div><p className="text-sm font-semibold text-primary mb-1">Emama&apos;s Recommendation</p><p className="text-sm text-foreground/80">{aiRecommendation.aiMessage}</p></div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {aiRecommendation.suggestedPackage && <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Suggested Package</p><p className="font-semibold text-foreground flex items-center gap-2"><Cake className="w-4 h-4 text-accent" />{aiRecommendation.suggestedPackage.title}</p></div>}
                      {aiRecommendation.suggestedHall && <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Suggested Hall</p><p className="font-semibold text-foreground flex items-center gap-2"><Building2 className="w-4 h-4 text-accent" />{aiRecommendation.suggestedHall.name}</p></div>}
                      <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Estimated Cost</p><p className="font-semibold text-accent">{aiRecommendation.estimatedCost}</p></div>
                      <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Best Date</p><p className="font-semibold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />{new Date(aiRecommendation.bestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-2">Recommended Add-ons</p>
                      <div className="flex flex-wrap gap-2">{aiRecommendation.recommendedAddons.map((addon, idx) => <span key={idx} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">{addon}</span>)}</div>
                    </div>
                    <button onClick={handleSubmitRequest} className="w-full py-3 bg-accent hover:bg-accent/90 text-primary font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.97]"><Check className="w-5 h-5" /> Submit Request</button>
                  </div>
                )}
              </>) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-green-600" /></div>
                  <h3 className="font-serif text-xl font-bold text-primary">Request Submitted!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">Thank you! Our team will review your event details and contact you within 24 hours.</p>
                  <div className="glass rounded-xl p-4 bg-accent/10 text-left"><div className="flex items-start gap-3"><span className="text-xl">👵🏾</span><p className="text-sm text-foreground/80">&quot;I&apos;ve sent your request to our wonderful team. They&apos;ll take good care of you.&quot;</p></div></div>
                  <button onClick={resetBuildModal} className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all active:scale-[0.97]">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emama Zinashe Floating Assistant */}
      {!emamaDismissed && (
        <div className="fixed bottom-6 left-6 md:left-28 z-40">
          {showEmamaChat && (
            <div className="absolute bottom-16 left-0 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 space-y-4 border border-border animate-in slide-in-from-bottom-2 fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-xl flex-shrink-0">👵🏾</div>
                <div>
                  <p className="text-sm font-semibold text-primary">Emama Zinashe</p>
                  <p className="text-sm text-foreground/80 mt-1">Would you like help planning your special moment? I can suggest the perfect celebration or meeting space!</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleEmamaYes} className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-medium rounded-lg text-sm transition-all active:scale-[0.97]">Yes please</button>
                <button onClick={handleEmamaLater} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg text-sm transition-all active:scale-[0.97]">Later</button>
              </div>
            </div>
          )}
          <button onClick={() => setShowEmamaChat(!showEmamaChat)} className="w-14 h-14 bg-accent hover:bg-accent/90 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-[0.97]">
            <span className="text-2xl">👵🏾</span>
          </button>
        </div>
      )}

      {/* Emama's Personalized Suggestions Modal */}
      {showEmamaSuggestions && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-2xl">👵🏾</div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-primary">Emama&apos;s Suggestions For You</h2>
                    <p className="text-sm text-muted-foreground">Personalized event ideas based on your profile</p>
                  </div>
                </div>
                <button onClick={() => setShowEmamaSuggestions(false)} className="p-2 hover:bg-muted rounded-full transition-all"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="glass rounded-xl p-4 bg-accent/10 border border-accent/30">
                <p className="text-sm text-foreground/80">&quot;Based on your previous visits and preferences, here are some special moments I think you would absolutely love to host.&quot;</p>
              </div>
              <div className="space-y-4">
                {emamasSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => handleSuggestionClick(suggestion)}>
                    <div className="flex gap-4 p-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={suggestion.image} alt={suggestion.title} fill className="object-cover" />
                        {suggestion.urgency === 'high' && <div className="absolute top-1 right-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">Act Soon</div>}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-primary">{suggestion.title}</h3>
                          <div className="flex items-center gap-1 text-accent"><Sparkles className="w-4 h-4" /><span className="text-sm font-bold">{suggestion.matchScore}% match</span></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        <div className="glass rounded-lg px-3 py-2 bg-accent/5 border border-accent/20">
                          <p className="text-xs text-foreground/70 flex items-start gap-2"><span className="text-lg">👵🏾</span><span>{suggestion.aiInsight}</span></p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground self-center flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowEmamaSuggestions(false); setShowBuildModal(true); }} className="flex-1 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.97]"><PenLine className="w-5 h-5" /> Build My Own Instead</button>
                <button onClick={() => setShowEmamaSuggestions(false)} className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-all active:scale-[0.97]">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Emama Zinashe Floating AI Assistant */}
      <EmamaAssistant
        page="events"
        onRecommend={() => setShowEmamaSuggestions(true)}
      />
    </div>
  );
}