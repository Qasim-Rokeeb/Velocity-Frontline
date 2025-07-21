// src/components/game/RaceTrack.tsx
'use client';

import React from 'react';

interface RaceTrackProps {
  carPosition: { x: number; y: number };
  carAngle: number;
}

const Car = React.memo(({ angle }: { angle: number }) => (
    <div className="absolute w-4 h-8 transition-transform duration-75 ease-linear" style={{ transform: `rotate(${angle + 90}deg)` }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0
        border-l-[6px] border-l-transparent
        border-b-[10px] border-b-primary
        border-r-[6px] border-r-transparent">
      </div>
      <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-4 h-6 bg-primary rounded-sm shadow-md"></div>
       <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-2 h-4 bg-black/30 rounded-t-sm"></div>
    </div>
));
Car.displayName = 'Car';


export default function RaceTrack({ carPosition, carAngle }: RaceTrackProps) {
  return (
    <div className="w-full h-full bg-green-900/50 flex items-center justify-center overflow-hidden">
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
          filter: "url(#shadow)"
        }}
      >
        <Car angle={carAngle} />
      </div>
    </div>
  );
}
