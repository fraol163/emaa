import { NextResponse } from 'next/server';
import { getWeather } from '@/src/lib/aiService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const weather = await getWeather();
  if (!weather) return NextResponse.json({ error: 'Weather unavailable' }, { status: 500 });
  return NextResponse.json(weather);
}
