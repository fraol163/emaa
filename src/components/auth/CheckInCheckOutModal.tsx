'use client';

import React, { useState } from 'react';
import { X, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckInCheckOutModalProps {
  onSave: (checkIn: string, checkOut: string) => void;
  onClose: () => void;
}

export default function CheckInCheckOutModal({ onSave, onClose }: CheckInCheckOutModalProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleContinue = () => {
    setError('');

    if (!checkIn) {
      setError('Please select a check-in date');
      return;
    }
    if (!checkOut) {
      setError('Please select a check-out date');
      return;
    }
    if (new Date(checkIn) < new Date(today)) {
      setError('Check-in date cannot be in the past');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out must be after check-in');
      return;
    }

    setSaving(true);
    onSave(checkIn, checkOut);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeSlideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-serif font-semibold text-primary">Your Stay</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-8 space-y-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-primary mb-2">When are you visiting?</h2>
            <p className="text-muted-foreground text-sm">Set your check-in and check-out dates</p>
          </div>

          <div className="space-y-4">
            {/* Check-in */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Check-in Date</label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={e => {
                  setCheckIn(e.target.value);
                  setError('');
                  // Reset checkout if it's before new checkin
                  if (checkOut && e.target.value >= checkOut) {
                    setCheckOut('');
                  }
                }}
                className="w-full p-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={e => {
                  setCheckOut(e.target.value);
                  setError('');
                }}
                disabled={!checkIn}
                className="w-full p-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {checkIn && checkOut && (
              <div className="text-center p-3 bg-primary/5 rounded-xl">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} night{Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}</span>
                  {' '}at Kuriftu African Village
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center px-5 py-4 border-t border-border">
          <Button
            onClick={handleContinue}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : <><span>Continue</span><ArrowRight className="w-3 h-3 ml-1" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
