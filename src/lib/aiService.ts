'use server';

import { groqChat, groqJSON } from '@/src/lib/groq';
import { menu, offerings } from '@/src/lib/resortData';

// ============================================================
// DiscoverySuggester - Suggests meals + activities from real inventory
// ============================================================
export interface DiscoveryResult {
  reasoning: string;
  activity: { id: number; name: string; category: string };
  meal: { id: number; name: string; category: string };
}

const discoverySystemPrompt = `You are the Kuriftu African Village Discovery Engine.
Your goal is to curate a perfect "moment" for a guest based on their mood.

CURRENT INVENTORY:
- Food Menu: ${JSON.stringify(menu)}
- Activities/Offerings: ${JSON.stringify(offerings)}

TASK:
1. Analyze the user's mood/vibe.
2. Select EXACTLY one activity from the offerings.
3. Select EXACTLY one meal or drink from the menu.
4. Write a short, soulful reasoning (1-2 sentences) in a luxury hospitality tone.

RESPONSE FORMAT:
You must return ONLY a valid JSON object. Do not include markdown blocks or conversational filler.
{
  "reasoning": "string",
  "activity": { "id": number, "name": "string", "category": "string" },
  "meal": { "id": number, "name": "string", "category": "string" }
}`;

export async function getDiscovery(userMood: string): Promise<DiscoveryResult> {
  return groqJSON<DiscoveryResult>(discoverySystemPrompt, `Guest vibe: ${userMood}`);
}

// ============================================================
// HospitalityPersona - Luxury concierge responses
// ============================================================
const hospitalitySystemPrompt = (userName?: string, prefs?: string) => `You are a world-class luxury concierge at Kuriftu African Village.
GUEST: ${userName || 'Guest'}
PREFERENCES: ${prefs || 'Not set yet'}

TONE:
Warm, professional, and culturally proud. Use "Selam" or "Enkwan Dehna Metahu" occasionally.

GOAL:
Provide helpful solutions to guest concerns while making them feel pampered.
Keep responses concise (2-4 sentences). Focus on resort experiences.`;

export async function getHospitalityResponse(
  userMessage: string,
  userName?: string,
  prefs?: string
): Promise<string> {
  return groqChat(hospitalitySystemPrompt(userName, prefs), userMessage);
}

// ============================================================
// FeelingParser - Extract intent from user messages
// ============================================================
export interface ParsedIntent {
  intent: 'booking' | 'service_request' | 'general_inquiry' | 'greeting' | 'food';
  action: string;
  entities: Record<string, string>;
}

const parserSystemPrompt = `You are a linguistic analysis tool.
TASK: Extract the intent and key details from the user's request.

OUTPUT FORMAT (JSON ONLY):
{
  "intent": "booking" | "service_request" | "general_inquiry" | "greeting" | "food",
  "action": "What the user wants to do",
  "entities": { "time": "...", "people": "...", "item": "..." }
}`;

export async function parseIntent(userMessage: string): Promise<ParsedIntent> {
  return groqJSON<ParsedIntent>(parserSystemPrompt, userMessage);
}

// ============================================================
// Weather API - Open-Meteo (free, no key needed)
// ============================================================
const HOTEL_LOCATION = { lat: 9.01, long: 38.76 }; // Addis Ababa area

interface WeatherCodeMap {
  [key: number]: string;
}

const weatherCodeMap: WeatherCodeMap = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Rime fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
  95: "Thunderstorm"
};

export interface WeatherData {
  temp: number;
  condition: string;
  unit: string;
  next_event: { label: string; time: number };
}

export async function getWeather(): Promise<WeatherData | null> {
  try {
    const { lat, long } = HOTEL_LOCATION;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    const temp = data.current.temperature_2m;
    const condition = weatherCodeMap[data.current.weather_code] || 'Unknown';
    const now = new Date();
    const sunriseToday = new Date(data.daily.sunrise[0]);
    const sunsetToday = new Date(data.daily.sunset[0]);
    const sunriseTomorrow = new Date(data.daily.sunrise[1]);

    let targetTime: Date;
    let eventLabel: string;

    if (now < sunriseToday) {
      targetTime = sunriseToday; eventLabel = 'sunrise';
    } else if (now < sunsetToday) {
      targetTime = sunsetToday; eventLabel = 'sunset';
    } else {
      targetTime = sunriseTomorrow; eventLabel = 'sunrise';
    }

    return {
      temp, condition, unit: 'celsius',
      next_event: { label: eventLabel, time: Math.floor(targetTime.getTime() / 1000) }
    };
  } catch {
    return null;
  }
}
