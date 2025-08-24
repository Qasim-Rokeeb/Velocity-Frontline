
// src/components/game/CameraToggle.tsx
'use client';

import React from 'react';
import { Camera, User, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type CameraMode = 'top-down' | 'first-person' | 'chase';

const cameraOptions: { id: CameraMode; name: string; icon: React.ReactNode }[] = [
    { id: 'top-down', name: 'Top-Down', icon: <Camera className="h-5 w-5" /> },
    { id: 'first-person', name: 'First-Person', icon: <User className="h-5 w-5" /> },
    { id: 'chase', name: 'Chase', icon: <Video className="h-5 w-5" /> },
];

interface CameraToggleProps {
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
}

export default function CameraToggle({ cameraMode, onCameraModeChange }: CameraToggleProps) {
  const currentIndex = cameraOptions.findIndex((c) => c.id === cameraMode);
  const nextIndex = (currentIndex + 1) % cameraOptions.length;
  const nextCamera = cameraOptions[nextIndex];
  
  const currentOption = cameraOptions[currentIndex];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => onCameraModeChange(nextCamera.id)}>
            {currentOption.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Camera: {currentOption.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
