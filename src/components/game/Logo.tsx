
import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center justify-center" style={{ textShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))' }}>
      <svg width="400" height="80" viewBox="0 0 400 80">
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
          </linearGradient>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');
            `}
          </style>
        </defs>
        
        {/* Background shape */}
        <path d="M0 10 L15 0 L385 0 L400 10 L400 70 L385 80 L15 80 L0 70 Z" fill="url(#logo-gradient)" opacity="0.1" />
        <path d="M2 11 L16 2 L384 2 L398 11 L398 69 L384 78 L16 78 L2 69 Z" stroke="hsl(var(--primary) / 0.5)" fill="transparent" strokeWidth="2" />
        
        {/* Text */}
        <text 
          x="50%" 
          y="50%" 
          dy=".3em"
          textAnchor="middle"
          fill="hsl(var(--primary-foreground))" 
          fontSize="48" 
          fontFamily="'Orbitron', sans-serif"
          fontWeight="900"
          letterSpacing="2"
          className="uppercase"
        >
          Nitro Rush
        </text>
      </svg>
    </div>
  );
}
