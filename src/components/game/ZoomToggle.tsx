// src/components/game/ZoomToggle.tsx
'use client';

import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ZOOM_LEVELS = [1, 1.25, 1.5];

interface ZoomToggleProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

export default function ZoomToggle({ zoomLevel, onZoomChange }: ZoomToggleProps) {
  const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
  const nextIndex = (currentIndex + 1) % ZOOM_LEVELS.length;
  const nextZoomLevel = ZOOM_LEVELS[nextIndex];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => onZoomChange(nextZoomLevel)}>
            {zoomLevel > 1 ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Zoom: {zoomLevel * 100}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
