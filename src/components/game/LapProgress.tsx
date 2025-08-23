// src/components/game/LapProgress.tsx
'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Flag } from 'lucide-react';

interface LapProgressProps {
  progress: number;
}

export default function LapProgress({ progress }: LapProgressProps) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
        <span>Lap Progress</span>
        <span>{Math.round(clampedProgress)}%</span>
      </div>
      <div className="relative w-full">
        <Progress value={clampedProgress} className="h-2" />
        <Flag className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 text-primary" style={{ left: `${clampedProgress}%` }}/>
      </div>
    </div>
  );
}
