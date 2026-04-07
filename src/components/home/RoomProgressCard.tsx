'use client';

import React from 'react';
import { RoomStatus } from '@/src/lib/types';

interface RoomProgressCardProps {
  status: RoomStatus;
}

export default function RoomProgressCard({ status }: RoomProgressCardProps) {
  const [isSent, setIsSent] = React.useState(false);

  return (
    <button
      onClick={() => setIsSent(true)}
      className={`w-full glass p-4 rounded-xl text-center transition-smooth block border-2 ${
        isSent
          ? 'bg-green-50 border-green-400'
          : status.completed
          ? 'bg-secondary/10 border-secondary/30'
          : 'bg-background/50 border-border/50'
      }`}
    >
      <div className="text-2xl mb-2">{status.icon}</div>
      <p className="text-xs font-medium text-foreground leading-tight">
        {status.task}
      </p>
      {isSent ? (
        <div className="mt-2 text-green-600 text-xs font-semibold">✓ Sent</div>
      ) : status.completed ? (
        <div className="mt-2 text-accent text-xs font-semibold">✓ Ready</div>
      ) : null}
    </button>
  );
}
