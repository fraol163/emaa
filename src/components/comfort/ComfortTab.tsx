'use client';
import EmamaAssistant from '@/src/components/shared/EmamaAssistant';
import EmamaResultDisplay from '@/src/components/shared/EmamaResultDisplay';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, AlertCircle, Sun, Moon, Sunset, Lightbulb, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { analyzeMoodAndIntent, EmamaAnalysis } from '@/src/lib/aiAnalysis';

type LightingMode = 'day' | 'night' | 'ambient';

interface LightingOption {
  mode: LightingMode;
  label: string;
  icon: React.ElementType;
  description: string;
}

const lightingOptions: LightingOption[] = [
  {
    mode: 'day',
    label: 'Day Mode',
    icon: Sun,
    description: 'Bright, energizing light',
  },
  {
    mode: 'night',
    label: 'Night Mode',
    icon: Moon,
    description: 'Dim, restful glow',
  },
  {
    mode: 'ambient',
    label: 'Ambient',
    icon: Sunset,
    description: 'Warm, relaxing tones',
  },
];

export default function ComfortTab() {
  const { toast } = useToast();
  const [temperature, setTemperature] = useState(22);
  const [lighting, setLighting] = useState<LightingMode>('ambient');
  const [weather, setWeather] = useState<{ temp: number; condition: string; next_event: { label: string } } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data.temp === 'number' && typeof data.condition === 'string') {
          setWeather(data);
        }
      })
      .catch(() => {});
  }, []);

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<EmamaAnalysis | null>(null);

  const isProcessingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setAnalysis(null);
        };

        recognition.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          setIsProcessing(true);
          isProcessingRef.current = true;

          try {
            const result = await analyzeMoodAndIntent(
              transcript,
              { roomTemperature: temperature, lightingPreference: lighting as 'day' | 'night' | 'ambient', language: 'en', dietaryRestrictions: [], coffeeType: 'medium', favoriteSeating: '' },
              {
                setTemperature,
                setLighting: (l: string) => setLighting(l as LightingMode),
                showToast: (title, description) => toast({ title, description })
              }
            );
            setAnalysis(result);
          } catch (error) {
            console.error(error);
            toast({
              title: "Emama couldn't analyze that",
              description: "Please try again.",
              variant: "destructive"
            });
          } finally {
            setIsProcessing(false);
            isProcessingRef.current = false;
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          const error = event.error;
          if (error === 'no-speech') return;

          if (error === 'network') {
            toast({
              title: "Network Error",
              description: "Speech recognition needs an internet connection.",
              variant: "destructive"
            });
            return;
          }

          const messages: Record<string, string> = {
            'not-allowed': 'Microphone access denied.',
            'audio-capture': 'No microphone detected.',
            'service-not-allowed': 'Speech service not available.',
          };
          toast({
            title: "Voice Input Error",
            description: messages[error] || "Couldn't hear you clearly. Please try again.",
            variant: "destructive"
          });
        };

        recognition.onend = () => {
          if (!isProcessingRef.current) {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [toast, temperature, lighting]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Browser Not Supported",
        description: "Use Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    if (isListening || isProcessingRef.current) return;

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      if (!e.message?.includes('already started')) throw e;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="px-4 py-6 md:px-8 border-b border-border bg-white sticky top-0 z-10">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-1">
          Your Comfort
        </h1>
        <p className="text-muted-foreground text-sm">
          Personalize your room environment with Emama AI
        </p>
      </div>

      {/* Weather Card */}
      {weather && (
        <div className="px-4 md:px-8 pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">
                {(weather.condition || '')?.toLowerCase().includes('rain') ? '🌧' : (weather.condition || '')?.toLowerCase().includes('cloud') ? '☁' : (weather.condition || '')?.toLowerCase().includes('clear') ? '☀' : '🌤'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">{weather.temp}°C</p>
              <p className="text-sm text-muted-foreground">{weather.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">Next</p>
              <p className="text-sm font-medium text-foreground capitalize">{weather.next_event?.label || '—'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto space-y-8">
        
        {/* VOICE INTERACTION SECTION */}
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="font-serif text-xl font-bold text-primary mb-1">Voice Control</h2>
            <p className="text-sm text-muted-foreground">Speak naturally to adjust your room</p>
          </div>

          <div
            className={`w-full rounded-3xl p-8 md:p-12 transition-all duration-700 ease-in-out relative overflow-hidden ${
              isListening
                ? 'bg-gradient-to-br from-accent to-accent/90 shadow-2xl scale-[1.02]'
                : isProcessing
                ? 'bg-gradient-to-br from-primary/90 to-primary shadow-xl'
                : 'bg-gradient-to-br from-primary to-primary/90 hover:shadow-2xl hover:scale-[1.01]'
            }`}
          >
            {/* Visual concentric rings if listening */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[180px] h-[180px] rounded-full border-4 border-white/20 animate-ripple"></div>
                <div className="absolute w-[180px] h-[180px] rounded-full border-4 border-white/10 animate-ripple" style={{ animationDelay: '0.6s' }}></div>
              </div>
            )}

            <div className="flex flex-col items-center gap-6 relative z-10">
              {/* Central Mic/Processing Button */}
              <button
                onClick={handleVoiceInput}
                disabled={isProcessing}
                className={`relative group focus:outline-none ${isProcessing ? 'cursor-wait opacity-80' : ''}`}
              >
                <div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isListening
                      ? 'bg-white text-accent animate-breathe shadow-[0_0_40px_rgba(255,255,255,0.6)]'
                      : isProcessing
                      ? 'bg-white/10 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-8 bg-white rounded-full animate-waveform"></div>
                      <div className="w-2 h-12 bg-white rounded-full animate-waveform" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-8 bg-white rounded-full animate-waveform" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <Mic className={`w-12 h-12 md:w-16 md:h-16 transition-all ${isListening ? 'scale-110' : 'group-hover:scale-105'}`} />
                  )}
                </div>
              </button>

              {/* Status Text */}
              <div className="text-center h-16 flex flex-col justify-center">
                <h3 className="text-white font-serif text-2xl md:text-3xl font-bold mb-1">
                  {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tell us what you need'}
                </h3>
                <p className="text-white/80 text-sm md:text-base h-6">
                  {isListening
                    ? "I'm listening carefully..."
                    : isProcessing
                    ? 'Wait a moment...'
                    : 'Tap the mic to talk to Emama'}
                </p>
              </div>

              {/* Example commands */}
              {!isListening && !isProcessing && (
                <div className="flex flex-wrap justify-center gap-2 mt-4 transition-opacity">
                  {['"Make it warmer"', '"Dim the lights"', '"I need more pillows"'].map((cmd, i) => (
                    <span key={i} className="text-white/70 text-xs bg-white/10 px-3 py-1.5 rounded-full font-medium">
                      {cmd}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Response Card */}
          {analysis && (
            <div className="mt-8 glass p-5 md:p-6 rounded-2xl border-2 border-accent/30 bg-accent/5 animate-fadeSlideIn shadow-warm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xl shadow-inner">
                    👵🏾
                  </div>
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                      Emama Analysis <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
                    </span>
                    <p className="text-sm font-medium italic text-foreground mt-0.5">&quot;{analysis.transcript}&quot;</p>
                  </div>
                </div>
                <button onClick={() => setAnalysis(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1 bg-white/50 rounded-full hover:bg-white/80">
                  <AlertCircle className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-accent/15">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold shadow-sm">
                    Mood Detected: {analysis.mood.charAt(0).toUpperCase() + analysis.mood.slice(1)}
                  </span>
                  {analysis.confidence >= 0.8 && (
                    <span className="text-[10px] uppercase text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-bold">
                      High Confidence
                    </span>
                  )}
                </div>
                
                <p className="text-[15px] text-foreground leading-relaxed font-medium bg-white/40 p-4 rounded-xl border border-white/50 shadow-sm">
                  {analysis.message}
                </p>
                
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          suggestion.action();
                          setAnalysis(null);
                        }}
                        className="text-sm flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-smooth shadow-sm hover:shadow-md"
                      >
                        <span className="text-lg leading-none">{suggestion.icon}</span>
                        <span>{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold bg-background px-2">Manual Settings</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Temperature Control */}
        <div className="glass p-6 md:p-8 rounded-3xl shadow-warm">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
            <span className="text-2xl p-2 bg-secondary/10 rounded-xl">🌡️</span> Room Temperature
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Current Setpoint</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-accent">{temperature}</span>
                <span className="text-xl font-medium text-muted-foreground">°C</span>
              </div>
            </div>

            <div className="relative pt-2">
              <input
                type="range"
                min="16"
                max="28"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-3 bg-secondary/30 rounded-full appearance-none cursor-pointer accent-accent"
              />
            </div>

            <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
              <span>Cool <br/><span className="text-[10px] opacity-70">16°C</span></span>
              <span className="text-center">Perfect <br/><span className="text-[10px] opacity-70">22°C</span></span>
              <span className="text-right">Warm <br/><span className="text-[10px] opacity-70">28°C</span></span>
            </div>

            <div className="bg-muted/30 p-4 rounded-2xl flex gap-3 text-sm mt-4">
              <User className="w-5 h-5 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground leading-relaxed">
                Adjust the slider to your preferred room temperature.
              </p>
            </div>
          </div>
        </div>

        {/* Lighting Control */}
        <div className="glass p-6 md:p-8 rounded-3xl shadow-warm">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
            <span className="p-2 bg-accent/10 rounded-xl"><Lightbulb className="w-6 h-6 text-accent" /></span> Light Mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lightingOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive = lighting === option.mode;
              const activeStyles = {
                day: 'bg-sky-100 border-sky-300 shadow-sky-200',
                night: 'bg-indigo-900/10 border-indigo-300 shadow-indigo-200',
                ambient: 'bg-amber-100 border-amber-300 shadow-amber-200',
              };
              return (
                <button
                  key={option.mode}
                  onClick={() => setLighting(option.mode)}
                  className={`p-6 rounded-2xl transition-all duration-300 text-center flex flex-col items-center justify-center gap-3 ${
                    isActive
                      ? `${activeStyles[option.mode]} border-2 shadow-md scale-[1.02]`
                      : 'bg-white hover:bg-muted/30 border-2 border-transparent shadow-sm'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-accent text-white shadow-warm' : 'bg-muted text-muted-foreground'
                  }`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">
                      {option.label}
                    </div>
                    <div className="text-xs text-muted-foreground leading-snug">
                      {option.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Requests */}
        <div className="glass p-6 md:p-8 rounded-3xl shadow-warm">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Quick Requests
          </h3>

          <div className="grid grid-cols-2 mt-2 gap-4">
            {[
              { icon: '🛏️', label: 'Extra pillows', action: 'pillows' },
              { icon: '🧴', label: 'More towels', action: 'towels' },
              { icon: '🔇', label: 'Quieter room', action: 'quiet' },
              { icon: '❄️', label: 'Extra blankets', action: 'blankets' },
            ].map((item) => {
              const isSent = sentRequests.has(item.action);
              return (
               <button
                 key={item.action}
                 onClick={() => {
                   if (isSent) return;
                   setSentRequests(prev => new Set(prev).add(item.action));
                   fetch('/api/service-request', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ type: item.action }),
                   }).catch(() => {});
                   toast({
                     title: "Request Sent! ✓",
                     description: `We will bring ${item.label.toLowerCase()} to your room instantly.`
                   });
                 }}
                 className={`flex flex-col sm:flex-row items-center sm:justify-start justify-center gap-3 p-4 sm:p-5 rounded-2xl transition-all border shadow-sm ${
                   isSent
                     ? 'bg-green-50 border-green-300 text-green-700'
                     : 'bg-white hover:bg-accent/10 border-border/50 hover:shadow-warm hover:border-accent/40'
                 }`}
               >
                 <span className={`text-3xl sm:text-2xl ${isSent ? 'scale-110' : 'drop-shadow-sm'} transition-transform`}>{isSent ? '✓' : item.icon}</span>
                 <span className={`font-semibold text-[13px] sm:text-sm text-center sm:text-left leading-tight ${isSent ? 'text-green-700' : 'text-foreground'}`}>
                   {isSent ? 'Sent!' : item.label}
                 </span>
               </button>
              );
            })}
          </div>
        </div>

      </div>
      {/* Emama Zinashe Floating AI Assistant */}
      <EmamaAssistant
        page="comfort"
        onRecommend={() => setShowResult(true)}
      />

      {/* Emama Result Display */}
      {showResult && (
        <EmamaResultDisplay
          title="Perfect Room Settings"
          message="I have adjusted everything for your comfort, my dear!"
          items={[
            { icon: '🌡️', label: 'Temperature Set to 24°C', description: 'Warm and cozy for relaxation' },
            { icon: '💡', label: 'Ambient Lighting', description: 'Soft, warm tones for a peaceful mood' },
            { icon: '🛏️', label: 'Extra Blankets Ready', description: 'Placed in your room for your comfort' },
          ]}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}