// src/components/game/DamageIndicator.tsx
'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HeartCrack, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DamageIndicatorProps {
  health: number;
}

export default function DamageIndicator({ health }: DamageIndicatorProps) {
  const clampedHealth = Math.max(0, Math.min(health, 100));

  const getHealthColor = () => {
    if (clampedHealth > 60) return 'bg-green-500';
    if (clampedHealth > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const healthColorClass = getHealthColor();

  return (
    <Tooltip>
        <TooltipTrigger asChild>
            <div className="w-full">
            <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
                <div className='flex items-center gap-1'>
                    <Shield className="h-3 w-3" />
                    <span>Car Health</span>
                </div>
                <span>{Math.round(clampedHealth)}%</span>
            </div>
            <div className="relative w-full">
                <Progress
                    value={clampedHealth}
                    className="h-2"
                    // Override the default gradient with a solid color based on health
                    style={{
                        '--progress-gradient-from': 'transparent',
                        '--progress-gradient-to': 'transparent',
                    } as React.CSSProperties}
                >
                    {/* Custom indicator with color logic */}
                    <div
                        className={cn("h-full w-full flex-1 transition-all", healthColorClass)}
                        style={{ transform: `translateX(-${100 - (clampedHealth || 0)}%)` }}
                    />
                </Progress>
                {clampedHealth < 30 && (
                    <HeartCrack className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 text-red-500 animate-pulse" style={{ left: `${clampedHealth}%` }}/>
                )}
            </div>
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>Your car&apos;s health. Collisions will damage it!</p>
        </TooltipContent>
    </Tooltip>

  );
}
