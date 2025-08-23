// src/components/game/FogToggle.tsx
'use client';

import React from 'react';
import { Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface FogToggleProps {
  isFoggy: boolean;
  onFogChange: (isFoggy: boolean) => void;
}

export default function FogToggle({ isFoggy, onFogChange }: FogToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onFogChange(!isFoggy)}
            className={cn(isFoggy && 'bg-accent text-accent-foreground')}
          >
            <Cloud className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Fog: {isFoggy ? 'On' : 'Off'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
