// src/components/game/RainEffect.tsx
'use client';

import React, { useMemo } from 'react';

const RainEffect = () => {
  const raindrops = useMemo(() => 
    Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${0.5 + Math.random() * 0.5}s`,
      animationDelay: `${Math.random() * 5}s`,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {raindrops.map(drop => (
        <div
          key={drop.id}
          className="absolute bg-gradient-to-b from-transparent to-blue-300/50 w-px animate-fall"
          style={{
            left: drop.left,
            height: `${60 + Math.random() * 60}px`,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// You need to add this animation to your tailwind.config.ts
// keyframes: {
//   fall: {
//     '0%': { transform: 'translateY(-100px)' },
//     '100%': { transform: 'translateY(100vh)' },
//   }
// },
// animation: {
//   'fall': 'fall linear infinite',
// }

export default RainEffect;
