// src/components/game/TouchControls.tsx
'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Joystick from './Joystick';

interface TouchControlsProps {
  keysRef: React.MutableRefObject<{ [key: string]: boolean }>;
  joystickDataRef: React.MutableRefObject<{ angle: number; distance: number }>;
}

export default function TouchControls({ keysRef, joystickDataRef }: TouchControlsProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 pointer-events-none md:hidden">
      <div className="absolute bottom-10 left-10 pointer-events-auto">
        <Joystick onMove={(data) => {
          joystickDataRef.current = data;
        }} />
      </div>
    </div>
  );
}
