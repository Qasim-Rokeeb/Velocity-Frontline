// src/components/game/MiniMap.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MiniMapProps {
  carPosition: { x: number; y: number };
}

export default function MiniMap({ carPosition }: MiniMapProps) {
  return (
    <div className="absolute top-4 left-4 w-48 h-32 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg p-2 z-20">
      <svg width="100%" height="100%" viewBox="0 0 800 500" className="opacity-80">
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
        />
        {/* Start/Finish Line */}
        <line
          x1="525" y1="150"
          x2="525" y2="350"
          stroke="hsl(var(--accent))"
          strokeWidth="15"
        />
      </svg>
      {/* Car marker */}
      <div
        className="absolute w-2 h-2 rounded-full bg-primary ring-2 ring-primary-foreground"
        style={{
          left: `${(carPosition.x / 800) * 100}%`,
          top: `${(carPosition.y / 500) * 100}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.016s linear, top 0.016s linear' // Smoothen the movement a bit
        }}
      ></div>
    </div>
  );
}
