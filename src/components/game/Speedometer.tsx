// src/components/game/Speedometer.tsx
'use client';

import React from 'react';

interface SpeedometerProps {
  speed: number;
  maxSpeed: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed, maxSpeed }) => {
  const minAngle = -135; // Angle for 0 speed
  const maxAngle = 135;  // Angle for max speed
  
  // Clamp speed to be within the 0-maxSpeed range
  const clampedSpeed = Math.max(0, Math.min(speed, maxSpeed));
  
  // Calculate the rotation angle for the needle
  const speedFraction = clampedSpeed / maxSpeed;
  const angle = minAngle + (speedFraction * (maxAngle - minAngle));

  return (
    <div className="relative w-40 h-28 flex flex-col items-center justify-center">
      <svg viewBox="0 0 100 55" className="w-full h-full">
        {/* Gauge background arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Gauge foreground arc (the "filled" part) */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="125.6" // Circumference of half circle (pi * r)
          strokeDashoffset={125.6 * (1 - speedFraction)}
          style={{ transition: 'stroke-dashoffset 0.2s ease-out' }}
        />
        {/* Needle */}
        <g transform={`rotate(${angle} 50 50)`} style={{ transition: 'transform 0.2s ease-out' }}>
          <path d="M 50 50 L 50 15" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
           <circle cx="50" cy="50" r="3" fill="hsl(var(--foreground))" />
        </g>
      </svg>
      {/* Speed text */}
      <div className="absolute bottom-0 text-center">
        <span className="text-3xl font-bold font-headline text-primary tracking-tighter">
          {Math.round(clampedSpeed)}
        </span>
        <span className="text-sm text-muted-foreground ml-1">km/h</span>
      </div>
    </div>
  );
};

export default Speedometer;
