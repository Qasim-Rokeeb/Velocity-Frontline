
// src/components/game/CameraToggle.tsx
'use client';

import React from 'react';
import { Camera, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type CameraMode = 'top-down' | 'first-person';

interface CameraToggleProps {
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
}

export default function CameraToggle({ cameraMode, onCameraModeChange }: CameraToggleProps) {
  const toggleMode = () => {
    onCameraModeChange(cameraMode === 'top-down' ? 'first-person' : 'top-down');
  };

  const isTopDown = cameraMode === 'top-down';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={toggleMode}>
            {isTopDown ? <Camera className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Camera: {isTopDown ? 'Top-Down' : 'First-Person'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
