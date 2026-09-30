import React, { useSyncExternalStore } from 'react';

interface EventCountdownProps {
  eventDate: Date;
  prefixText?: string;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

// A one-second clock exposed as an external store. The server snapshot is
// null, so the countdown renders nothing on the server and during hydration
// and only appears once React is running on the client. That avoids a
// server/client mismatch, which React 19 reports as a hydration error.
let now = Date.now();

function subscribe(onTick: () => void) {
  const interval = setInterval(() => {
    now = Date.now();
    onTick();
  }, 1000);
  return () => clearInterval(interval);
}

const getClientNow = () => now;
const getServerNow = () => null;

/**
 * Displays a friendly, celebratory countdown to the event date
 * Updates every second for a live countdown experience
 * Renders nothing on the server, and nothing once the event has passed
 */
export default function EventCountdown({ 
  eventDate, 
  prefixText,
  className 
}: EventCountdownProps) {
  const clientNow = useSyncExternalStore(subscribe, getClientNow, getServerNow);

  if (clientNow === null) {
    return null;
  }

  const timeRemaining = calculateTimeRemaining(eventDate, clientNow);

  // Hide entirely when event has passed
  if (timeRemaining.isPast) {
    return null;
  }

  const countdownText = formatCountdown(timeRemaining);
  const content = prefixText 
    ? `${prefixText} ${countdownText}`
    : countdownText;

  return <span className={className}>{content}</span>;
}

function calculateTimeRemaining(eventDate: Date, now: number): TimeRemaining {
  const diff = eventDate.getTime() - now;
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

function formatCountdown({ days, hours, minutes, seconds }: TimeRemaining): string {
  const parts: string[] = [];
  
  // Only show days if > 0
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  
  // Only show hours if > 0 (or if days = 0 and we're within the same day)
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  
  // Only show minutes if > 0 (or if we're within the same hour/day)
  if (minutes > 0 || hours > 0 || days > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  
  // Always show seconds for live countdown feel
  parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  
  return `${parts.join(', ')}! ⏳`;
}
