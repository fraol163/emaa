import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { upsertUser, deleteUser } from '@/src/lib/db';

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Webhook not configured', { status: 400 });
  }

  const payload = await req.json();
  const headersList = await headers();
  const headerPayload = Object.fromEntries(headersList.entries());

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), headerPayload) as WebhookEvent;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address || '';

    await upsertUser({
      clerk_id: id,
      username: username || '',
      email: primaryEmail,
      first_name: first_name || '',
      last_name: last_name || '',
      image_url: image_url || '',
    });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (id) {
      await deleteUser(id);
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
