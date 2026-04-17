import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { savePreferences, getPreferences, initDb } from '@/src/lib/db';

// Ensure tables exist
let dbReady: Promise<void> | null = null;
function ensureDb() {
  if (!dbReady) {
    dbReady = initDb();
  }
  return dbReady;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await ensureDb();
    const prefs = await getPreferences(userId);
    return NextResponse.json(prefs || {});
  } catch (err) {
    console.error('GET /api/preferences error:', err);
    return NextResponse.json({ error: 'DB error', details: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await ensureDb();
    const body = await req.json();
    console.log('[POST /api/preferences] userId:', userId, 'body keys:', Object.keys(body));
    await savePreferences(userId, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/preferences error:', err);
    return NextResponse.json({ error: 'DB error', details: String(err) }, { status: 500 });
  }
}
