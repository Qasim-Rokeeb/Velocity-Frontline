// src/components/game/ThrottleSlider.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ThrottleSliderProps {
  value: number; // 0 to 1
}

export default function ThrottleSlider({ value }: ThrottleSliderProps) {
  const height = value * 100;

  return (
    <div className="relative h-48 w-16 rounded-lg bg-black/30 border-2 border-primary/50 p-2 backdrop-blur-sm">
      {/* Track */}
      <div className="relative h-full w-full rounded-sm bg-gray-900/50 overflow-hidden">
        {/* Fill */}
        <motion.div
          className="absolute bottom-0 w-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
      {/* Ticks */}
      <div className="absolute inset-y-0 right-full mr-2 w-px bg-primary/30">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute right-0 h-px w-2 bg-primary/50"
            style={{ top: `${i * 25}%` }}
          />
        ))}
      </div>
       <div className="absolute -right-4 top-0 -translate-y-4 text-xs font-code uppercase text-primary/80">
        THR
      </div>
    </div>
  );
}
