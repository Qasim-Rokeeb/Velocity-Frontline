// src/components/game/RaceTrack.tsx
'use client';

import React from 'react';

interface RaceTrackProps {
  carPosition: { x: number; y: number };
  carAngle: number;
}

const Car = React.memo(({ angle }: { angle: number }) => (
    <div className="absolute w-8 h-12 transition-transform duration-75 ease-linear" style={{ transform: `rotate(${angle + 90}deg) scale(0.8)` }}>
      {/* Base car SVG */}
      <svg viewBox="0 0 100 200" className="w-full h-full" style={{filter: 'drop-shadow(2px 4px 6px black)'}}>
        {/* Body */}
        <path d="M20,10 L80,10 C90,10 100,20 100,30 L100,170 C100,180 90,190 80,190 L20,190 C10,190 0,180 0,170 L0,30 C0,20 10,10 20,10 Z" fill="hsl(var(--primary))" />
        
        {/* Windshield */}
        <path d="M10,60 L90,60 L80,90 L20,90 Z" fill="rgba(0,0,0,0.5)" />
        
        {/* Hood lines */}
        <line x1="30" y1="15" x2="40" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        <line x1="70" y1="15" x2="60" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        
        {/* Headlights */}
        <circle cx="20" cy="25" r="8" fill="yellow" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        <circle cx="80" cy="25" r="8" fill="yellow" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />

        {/* Spoiler */}
        <path d="M5,180 L95,180 L100,200 L0,200 Z" fill="hsl(var(--accent))" stroke="black" strokeWidth="2"/>
      </svg>
    </div>
));
Car.displayName = 'Car';


export default function RaceTrack({ carPosition, carAngle }: RaceTrackProps) {
  return (
    <div className="w-full h-full bg-blue-900/50 flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 800 500">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
            <feMerge>
              <feMergeNode in="offsetBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Track path: A compound path creating an oval shape */}
        <path
          d="M 400,50 
             A 350,200 0 1,1 400,450 
             A 350,200 0 1,1 400,50 Z
             M 400,150
             A 250,100 0 1,0 400,350
             A 250,100 0 1,0 400,150 Z"
          fill="hsl(var(--secondary))"
          fillRule="evenodd"
          stroke="hsl(var(--muted))"
          strokeWidth="3"
        />
        
        {/* Start/Finish Line */}
        <line
          x1="525" y1="150"
          x2="525" y2="350"
          stroke="hsl(var(--accent))"
          strokeWidth="5"
          strokeDasharray="10, 10"
        />

        {/* Inner and Outer kerbs */}
        <path
          d="M 400,150 A 250,100 0 1,0 400,350 A 250,100 0 1,0 400,150 Z"
          fill="none"
          stroke="url(#kerb)"
          strokeWidth="6"
        />
         <path
          d="M 400,50 A 350,200 0 1,1 400,450 A 350,200 0 1,1 400,50 Z"
          fill="none"
          stroke="url(#kerb)"
          strokeWidth="6"
        />
        <defs>
          <linearGradient id="kerb" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
          </linearGradient>
           <pattern id="kerb-pattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="20" fill="hsl(var(--primary))"/>
            <rect x="10" width="10" height="20" fill="white"/>
          </pattern>
        </defs>

      </svg>
      <div
        className="absolute"
        style={{
          left: `${carPosition.x}px`,
          top: `${carPosition.y}px`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <Car angle={carAngle} />
      </div>
    </div>
  );
}
