// src/components/game/DifficultySelector.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Shield, ShieldHalf, ShieldAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export type Difficulty = 'easy' | 'medium' | 'hard';

const difficulties: { id: Difficulty; name: string; icon: React.ReactNode; description: string; }[] = [
  { id: 'easy', name: 'Easy', icon: <Shield className="h-4 w-4" />, description: 'Less damage from collisions. Great for learning.' },
  { id: 'medium', name: 'Medium', icon: <ShieldHalf className="h-4 w-4" />, description: 'Standard damage. A balanced challenge.' },
  { id: 'hard', name: 'Hard', icon: <ShieldAlert className="h-4 w-4" />, description: 'High damage from collisions. For expert drivers.' },
];

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ selectedDifficulty, onDifficultyChange }: DifficultySelectorProps) {
  return (
    <TooltipProvider>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
          Difficulty
        </Label>
        <div className="flex justify-center rounded-md border border-input p-1 bg-background">
          {difficulties.map((d) => (
             <Tooltip key={d.id}>
                <TooltipTrigger asChild>
                    <Button
                    variant={selectedDifficulty === d.id ? 'default' : 'ghost'}
                    size="sm"
                    className={cn("flex-1", selectedDifficulty === d.id && 'text-primary-foreground')}
                    onClick={() => onDifficultyChange(d.id)}
                    >
                    {d.icon}
                    <span className="ml-2">{d.name}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{d.description}</p>
                </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
