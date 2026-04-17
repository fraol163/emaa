import { NextRequest, NextResponse } from 'next/server';

// ===== Types =====

interface AIRequestBody {
  message: string;
  settings?: {
    roomTemperature?: number;
    lightingPreference?: string;
    language?: string;
    dietaryRestrictions?: string[];
  };
  context?: {
    guestName?: string;
    previousMood?: string;
  };
}

interface AIResponsePayload {
  mood: 'happy' | 'tired' | 'stressed' | 'cold' | 'hot' | 'relaxed' | 'neutral';
  intent: 'change_temperature' | 'change_lighting' | 'request_item' | 'general_chat';
  confidence: number;
  message: string;
  actions: {
    type: 'set_temperature' | 'set_lighting' | 'request_item' | 'none';
    value?: string | number;
    label: string;
    icon: string;
  }[];
  reasoning?: string;
}

// ===== Keyword-based fallback analyzer =====

function analyzeWithKeywords(text: string, settings?: AIRequestBody['settings']): AIResponsePayload {
  const lower = text.toLowerCase();
  const currentTemp = settings?.roomTemperature ?? 22;

  // === EXPLICIT TEMPERATURE COMMANDS (e.g. "set temp to 20", "make it 0 degrees", "temperature 24") ===
  const tempMatch = lower.match(/(?:set|make|change|turn|put|adjust)?\s*(?:the\s+)?(?:temp(?:erature)?|room)\s*(?:to|at|=)?\s*(\d+)\s*(?:degree|°|c)?/i)
    || lower.match(/(\d+)\s*(?:degree|°)\s*/i);
  if (tempMatch) {
    const requestedTemp = Math.max(16, Math.min(28, parseInt(tempMatch[1])));
    return {
      mood: requestedTemp < currentTemp ? 'cold' : 'hot',
      intent: 'change_temperature',
      confidence: 0.9,
      message: `Right away, my dear! I've set the room temperature to ${requestedTemp}°C for you.`,
      actions: [
        { type: 'set_temperature', value: requestedTemp, label: `Set to ${requestedTemp}°C`, icon: '🌡️' },
      ],
    };
  }

  // === EXPLICIT LIGHTING COMMANDS (e.g. "change light to night", "switch to day mode", "set lighting ambient") ===
  const lightMatch = lower.match(/(?:set|make|change|switch|turn|put)?\s*(?:the\s+)?(?:light(?:s|ing)?|mode)\s*(?:to|on)?\s*(day|night|ambient)/i)
    || lower.match(/(day|night|ambient)\s*(?:light(?:s|ing)?|mode)/i);
  if (lightMatch) {
    const mode = lightMatch[1].toLowerCase();
    const modeLabels: Record<string, string> = { day: 'Day', night: 'Night', ambient: 'Ambient' };
    return {
      mood: mode === 'night' ? 'tired' : 'relaxed',
      intent: 'change_lighting',
      confidence: 0.9,
      message: `Of course! I've changed the lighting to ${modeLabels[mode]} mode for you.`,
      actions: [
        { type: 'set_lighting', value: mode, label: `Set to ${modeLabels[mode]} Lighting`, icon: mode === 'night' ? '🕯️' : mode === 'day' ? '💡' : '🌙' },
      ],
    };
  }

  // === TEMPERATURE (mood-based) ===
  if (/\b(cold|freezing|chilly|warm(?!ed)|frost|shiver)\b/.test(lower)) {
    const newTemp = Math.min(currentTemp + 2, 28);
    return {
      mood: 'cold', intent: 'change_temperature', confidence: 0.85,
      message: `I sensed you're feeling a bit cold. I suggest warming your room to ${newTemp}°C.`,
      actions: [
        { type: 'set_temperature', value: newTemp, label: `Set to ${newTemp}°C`, icon: '🌡️' },
        { type: 'set_lighting', value: 'night', label: 'Switch to Night lighting', icon: '🕯️' },
      ],
    };
  }
  if (/\b(hot|warm|sweating|humid|heat)\b/.test(lower)) {
    const newTemp = Math.max(currentTemp - 2, 16);
    return {
      mood: 'hot', intent: 'change_temperature', confidence: 0.85,
      message: `It sounds like it's a bit warm. I suggest lowering the temperature to ${newTemp}°C.`,
      actions: [{ type: 'set_temperature', value: newTemp, label: `Set to ${newTemp}°C`, icon: '❄️' }],
    };
  }

  // === LIGHTING ===
  if (/\b(tired|sleepy|exhausted|rest|relax|sleep|nap)\b/.test(lower)) {
    return {
      mood: 'tired', intent: 'change_lighting', confidence: 0.82,
      message: "You sound a bit tired, my dear. I suggest setting the lights to 'Night' to help you relax.",
      actions: [{ type: 'set_lighting', value: 'night', label: 'Set to Night Lighting', icon: '🕯️' }],
    };
  }
  if (/\b(bright|read|light|see|focus|lamp)\b/.test(lower)) {
    return {
      mood: 'relaxed', intent: 'change_lighting', confidence: 0.80,
      message: "Of course! I've set the room to day lighting so you can see better.",
      actions: [{ type: 'set_lighting', value: 'day', label: 'Set to Day Lighting', icon: '💡' }],
    };
  }
  if (/\b(soft|mood|romantic|dim|ambient|evening|cozy)\b/.test(lower)) {
    return {
      mood: 'relaxed', intent: 'change_lighting', confidence: 0.78,
      message: 'Setting an ambient mood for you now.',
      actions: [{ type: 'set_lighting', value: 'ambient', label: 'Set to Ambient Lighting', icon: '🌙' }],
    };
  }

  // === SERVICE REQUESTS ===
  if (/\b(pillow|towel|water|blanket|sheet|soap|shampoo|toiletries)\b/.test(lower)) {
    return {
      mood: 'neutral', intent: 'request_item', confidence: 0.88,
      message: "I've noted your request. Someone will bring that to your room right away.",
      actions: [{ type: 'request_item', label: 'Confirm request', icon: '✅' }],
    };
  }

  // === FOOD & DINING ===
  if (/\b(dinner|breakfast|lunch|food|eat|restaurant|meal|menu|hungry|diet|vegan|vegetarian)\b/.test(lower)) {
    return {
      mood: 'happy', intent: 'general_chat', confidence: 0.80,
      message: "Our restaurant serves authentic Ethiopian cuisine — from Doro Wat to Kitfo and fresh Beyaynetu. The Buna ceremony is a must-try! Head to Gebeta to see the full menu and reserve your table.",
      actions: [],
    };
  }

  // === WORK / STUDY ===
  if (/\b(work|study|office|desk|laptop|computer|business|meeting|print)\b/.test(lower)) {
    return {
      mood: 'relaxed', intent: 'general_chat', confidence: 0.75,
      message: "We have a quiet workspace in the lobby with free WiFi and power outlets. The garden area is also lovely for reading or working — just ask for a table setup and we'll bring you some coffee!",
      actions: [{ type: 'set_lighting', value: 'day', label: 'Brighten Room for Work', icon: '💡' }],
    };
  }

  // === WIFI & TECH ===
  if (/\b(wifi|internet|connection|network|charge|outlet|usb|bluetooth)\b/.test(lower)) {
    return {
      mood: 'relaxed', intent: 'general_chat', confidence: 0.75,
      message: "High-speed WiFi is available throughout the resort. Network: 'EndeBete-Guest'. Your room also has USB outlets near the bed and desk. Let me know if you need help!",
      actions: [],
    };
  }

  // === SPA & WELLNESS ===
  if (/\b(spa|massage|wellness|treatment|aromatherapy|hot.?stone|yoga|meditation)\b/.test(lower)) {
    return {
      mood: 'stressed', intent: 'general_chat', confidence: 0.80,
      message: "Our African Village Spa offers traditional treatments — hot stone massage, aromatherapy, and herbal rituals. I'd love to help you book a session!",
      actions: [{ type: 'set_lighting', value: 'night', label: 'Set Relaxing Lighting', icon: '🕯️' }],
    };
  }

  // === ACTIVITIES & EXPERIENCES ===
  if (/\b(activity|thing|do|fun|explore|suggest|recommend|experience|adventure)\b/.test(lower)) {
    return {
      mood: 'happy', intent: 'general_chat', confidence: 0.80,
      message: "So much to enjoy! Try our cultural tours, garden walks, coffee ceremonies, or the African Village Spa. The sunset from the terrace is magical. Want me to check what's happening today?",
      actions: [],
    };
  }

  // === CULTURE & HISTORY ===
  if (/\b(story|tell|history|culture|tradition|heritage|ethiopian|african|gursha)\b/.test(lower)) {
    return {
      mood: 'happy', intent: 'general_chat', confidence: 0.78,
      message: "Our resort celebrates Ethiopian hospitality. The 'gursha' tradition — hand-feeding loved ones — represents the warmth we bring to every guest. Visit Little Ethiopia to explore our culture!",
      actions: [],
    };
  }

  // === WEATHER & OUTDOORS ===
  if (/\b(weather|rain|sun|outside|outdoor|garden|pool|terrace|view|sunset|sunrise)\b/.test(lower)) {
    return {
      mood: 'relaxed', intent: 'general_chat', confidence: 0.75,
      message: "The weather is lovely today! Our garden terrace and poolside are perfect for relaxing. The sunset is especially beautiful — I'd suggest heading there around 5:30 PM.",
      actions: [],
    };
  }

  // === GREETINGS ===
  if (/\b(hello|hi|hey|selam|good morning|good evening|good night|greetings)\b/.test(lower)) {
    return {
      mood: 'happy', intent: 'general_chat', confidence: 0.95,
      message: "Selam, my dear! Welcome home. I'm so happy to have you here. What can I help you with today?",
      actions: [],
    };
  }

  // === GRATITUDE ===
  if (/\b(thank|thanks|appreciate|grateful|wonderful|amazing|love)\b/.test(lower)) {
    return {
      mood: 'happy', intent: 'general_chat', confidence: 0.95,
      message: "You're so welcome, my dear. It's my greatest pleasure to make your stay perfect. You're family here ❤️",
      actions: [],
    };
  }

  // === CHECK-IN / ROOM ===
  if (/\b(check.?in|check.?out|arrival|departure|key|card|room|suite|villa|upgrade)\b/.test(lower)) {
    return {
      mood: 'relaxed', intent: 'general_chat', confidence: 0.75,
      message: "Check-in is from 2 PM and check-out is at 11 AM. If you need an early arrival or late departure, just let me know and I'll arrange it for you!",
      actions: [],
    };
  }

  // === FAMILY & CHILDREN ===
  if (/\b(child|kid|baby|family|play|game|children|young)\b/.test(lower)) {
    return {
      mood: 'happy', intent: 'general_chat', confidence: 0.75,
      message: "We love families here! Our garden is safe for children to explore, and we have board games, a kids' menu, and babysitting services available. Just ask!",
      actions: [],
    };
  }

  // === TRANSPORTATION ===
  if (/\b(transport|car|driver|airport|shuttle|taxi|parking|pickup)\b/.test(lower)) {
    return {
      mood: 'relaxed', intent: 'general_chat', confidence: 0.75,
      message: "We offer airport pickup and shuttle services. Free parking is available for all guests. Would you like me to arrange a driver for you?",
      actions: [],
    };
  }

  // === PAYMENT & BILLING ===
  if (/\b(bill|pay|price|cost|charge|refund|receipt|invoice)\b/.test(lower)) {
    return {
      mood: 'neutral', intent: 'general_chat', confidence: 0.70,
      message: "Our front desk handles all billing. You can settle your bill at check-out or request an itemized receipt anytime. We accept cash, cards, and mobile payments.",
      actions: [],
    };
  }

  // === SAFETY & SECURITY ===
  if (/\b(safe|security|emergency|doctor|medical|help|urgent|problem|issue|complaint)\b/.test(lower)) {
    return {
      mood: 'stressed', intent: 'general_chat', confidence: 0.85,
      message: "Your safety is our priority. We have 24/7 security, a first-aid station, and emergency contacts on file. I'll alert our team right away if something is wrong. Please don't worry — you're in good hands.",
      actions: [],
    };
  }

  // === EVENTS & SCHEDULE ===
  if (/\b(event|schedule|today|tomorrow|tonight|program|ceremony|performance|music|dance)\b/.test(lower)) {
    return {
      mood: 'happy', intent: 'general_chat', confidence: 0.78,
      message: "Check the Events section for today's activities! We have coffee ceremonies, traditional music, cultural experiences, and spa sessions throughout the day. Let me know what interests you!",
      actions: [],
    };
  }

  // === COMFORT & ROOM SETTINGS ===
  if (/\b(comfortable|comfort|adjust|change|setting|customize|personal)\b/.test(lower)) {
    return {
      mood: 'neutral', intent: 'general_chat', confidence: 0.70,
      message: "I can adjust your room's temperature, lighting, and more — just tell me what you need. Or tap the mic to talk to me directly!",
      actions: [],
    };
  }

  // === GENERAL HELP ===
  if (/\b(help|need|can you|please|want|would like|how do|how can|what is|where is|who is)\b/.test(lower)) {
    return {
      mood: 'neutral', intent: 'general_chat', confidence: 0.65,
      message: "Of course, my dear. I'm here to make your stay perfect. Tell me what you need — whether it's adjusting your room, ordering something, suggesting an activity, or just chatting. I'm all ears!",
      actions: [],
    };
  }

  // === CATCH-ALL ===
  return {
    mood: 'neutral', intent: 'general_chat', confidence: 0.50,
    message: "Thank you for sharing that, my dear. Is there anything I can do to make your stay more comfortable? I can adjust your room, suggest an activity, or bring you something you need.",
    actions: [],
  };
}

// ===== AI API call using Groq (Llama 3.3 70B) =====

async function analyzeWithGroq(
  text: string,
  settings: AIRequestBody['settings'],
  context: AIRequestBody['context']
): Promise<AIResponsePayload> {
  const systemInstruction = `You are Emama Zinashe, a warm and caring Ethiopian hospitality AI concierge for a luxury resort called "Ende Bete". You analyze guest messages to understand their mood, intent, and needs.

Current room settings:
- Temperature: ${settings?.roomTemperature ?? 22}°C
- Lighting: ${settings?.lightingPreference ?? 'ambient'}
- Guest name: ${context?.guestName ?? 'Guest'}

Respond ONLY with valid JSON matching this exact schema:
{
  "mood": "happy" | "tired" | "stressed" | "cold" | "hot" | "relaxed" | "neutral",
  "intent": "change_temperature" | "change_lighting" | "request_item" | "general_chat",
  "confidence": <number 0-1>,
  "message": "<warm, caring response in character>",
  "actions": [
    {
      "type": "set_temperature" | "set_lighting" | "request_item" | "none",
      "value": "<new value if applicable (number for temp, string for lighting)>",
      "label": "<button label>",
      "icon": "<emoji>"
    }
  ],
  "reasoning": "<brief internal reasoning>"
}

Rules:
- Be warm, caring, and speak like a loving Ethiopian grandmother
- Use confidence scores honestly. If you provide an action based on a clear explicit intent OR a clear mood (e.g. cold, hot, tired, bright), assign a confidence >= 0.85 so the system will auto-apply it.
- If the user explicitly mentions feeling a certain mood (e.g., "I'm tired", "I am freezing", "It's so bright", "I feel stressed"), ALWAYS provide a relevant set_lighting or set_temperature action to improve their comfort. Do not just chat; take action.
- If the user asks a general question (about food, wifi, activities, weather, culture), give a SPECIFIC, HELPFUL response with real details about the resort. Never give a generic "I understand" response.
- For temperature changes, suggest increments of 2°C, clamped to 16-28°C
- Valid lighting: "day" | "night" | "ambient"
- Always provide at least one action when intent is not "general_chat" or when improving a mood.
- Keep messages concise but heartfelt. Respond like a caring grandmother who knows everything about the resort.`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: text }
        ],
        temperature: 0.4,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`Groq API returned ${response.status}: ${errData}`);
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content;

    if (!contentText) throw new Error('Groq API returned empty content');

    const parsed = JSON.parse(contentText) as AIResponsePayload;

    if (!parsed.mood || !parsed.intent || typeof parsed.confidence !== 'number') {
      throw new Error('AI response missing required fields');
    }

    parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));

    return parsed;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ===== Route handler =====

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AIRequestBody;

    if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string' }, { status: 400 });
    }

    if (body.message.length > 2000) {
      return NextResponse.json({ error: 'Message must be under 2000 characters' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;

    let result: AIResponsePayload;

    // Try Groq AI first
    if (groqKey) {
      try {
        result = await analyzeWithGroq(body.message, body.settings, body.context);
      } catch (aiError) {
        // Groq failed — use keyword result as fallback
        console.warn('Groq API unavailable, using keyword analysis');
        result = analyzeWithKeywords(body.message, body.settings);
        result.reasoning = 'Fallback: Groq API unavailable, used keyword matching';
      }
    } else {
      // No API key — use keywords
      result = analyzeWithKeywords(body.message, body.settings);
      result.reasoning = 'No GROQ_API_KEY, used keyword matching';
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI route error:', error);
    return NextResponse.json(
      {
        mood: 'neutral' as const,
        intent: 'general_chat' as const,
        confidence: 0,
        message: "I'm sorry, something went wrong. Please try again.",
        actions: [],
        reasoning: 'Error processing request',
      },
      { status: 500 }
    );
  }
}
