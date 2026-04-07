'use client';

import React, { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  condition: string;
  next_event: { label: string; time: number };
}

export default function QuickStats() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.json())
      .then(data => setWeather(data))
      .catch(() => {});
  }, []);

  const sunsetLabel = () => {
    if (!weather?.next_event) return '—';
    if (weather.next_event.label === 'sunset') {
      const diff = weather.next_event.time - Math.floor(Date.now() / 1000);
      const hrs = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      return `${hrs}h ${mins}m`;
    }
    return `Tomorrow ${new Date(weather.next_event.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const weatherEmoji = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('clear') || c.includes('mainly clear')) return '☀️';
    if (c.includes('partly cloudy')) return '⛅';
    if (c.includes('overcast') || c.includes('cloud')) return '☁️';
    if (c.includes('rain') || c.includes('shower')) return '🌧';
    if (c.includes('thunder')) return '⛈️';
    if (c.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Weather Card */}
      <div className="glass p-4 rounded-2xl flex items-center gap-4 shadow-warm-md">
        <div className="text-3xl">{weather ? weatherEmoji(weather.condition) : '🌤️'}</div>
        <div>
          <div className="text-xs text-muted-foreground">Now</div>
          <div className="text-sm font-semibold text-foreground">
            {weather ? `${weather.temp}°C, ${weather.condition}` : 'Loading...'}
          </div>
        </div>
      </div>

      {/* Sunset Card */}
      <div className="glass p-4 rounded-2xl flex items-center gap-4 shadow-warm-md">
        <div className="text-3xl">🌅</div>
        <div>
          <div className="text-xs text-muted-foreground">
            {weather?.next_event?.label === 'sunset' ? 'Sunset in' : 'Sunrise at'}
          </div>
          <div className="text-sm font-semibold text-foreground">{sunsetLabel()}</div>
        </div>
      </div>
    </div>
  );
}
