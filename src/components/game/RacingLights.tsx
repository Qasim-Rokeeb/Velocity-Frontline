// src/components/game/RacingLights.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RacingLightsProps {
  countdown: number;
}

const Light = ({ color, active, lit }: { color: string; active: boolean; lit: boolean }) => (
  <div className={cn("w-16 h-16 rounded-full border-4 border-gray-600 bg-gray-800 transition-all duration-200", 
    active && lit && "shadow-2xl",
    {
      'bg-red-900': color === 'red' && !active,
      'bg-green-900': color === 'green' && !active,
      'bg-red-500 animate-glow [box-shadow:0_0_20px_5px_theme(colors.red.500/0.7)]': color === 'red' && active && lit,
      'bg-green-400 animate-glow [box-shadow:0_0_30px_10px_theme(colors.green.400/0.7)]': color === 'green' && active && lit,
    }
  )}>
  </div>
);

export default function RacingLights({ countdown }: RacingLightsProps) {
    const isGo = countdown === 0;

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex space-x-4">
            <Light color="red" active={countdown <= 3} lit={!isGo} />
            <Light color="red" active={countdown <= 2} lit={!isGo} />
            <Light color="red" active={countdown <= 1} lit={!isGo} />
        </div>
        <Light color="green" active={isGo} lit={isGo} />
    </div>
  );
}
