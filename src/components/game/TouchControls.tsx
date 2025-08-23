// src/components/game/TouchControls.tsx
'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SteeringWheel from './SteeringWheel';

interface TouchControlsProps {
  keysRef: React.MutableRefObject<{ [key: string]: boolean }>;
  steeringWheelAngleRef: React.MutableRefObject<number>;
}

const TouchButton = ({ onTouchStart, onTouchEnd, className, children }: {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    onTouchStart={(e) => { e.preventDefault(); onTouchStart(); }}
    onTouchEnd={(e) => { e.preventDefault(); onTouchEnd(); }}
    onMouseDown={(e) => { e.preventDefault(); onTouchStart(); }} // Also handle mouse for testing
    onMouseUp={(e) => { e.preventDefault(); onTouchEnd(); }}
    className={cn(
      "w-16 h-16 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center select-none active:bg-primary/50 transition-colors",
      className
    )}
  >
    {children}
  </div>
);

export default function TouchControls({ keysRef, steeringWheelAngleRef }: TouchControlsProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return null;
  }

  const handleTouch = (key: string, pressed: boolean) => {
    keysRef.current[key] = pressed;
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none md:hidden">
      {/* Steering Controls */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <SteeringWheel onAngleChange={(angle) => steeringWheelAngleRef.current = angle} />
      </div>

      {/* Gas and Brake Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-4 pointer-events-auto">
        <TouchButton
          onTouchStart={() => handleTouch('arrowup', true)}
          onTouchEnd={() => handleTouch('arrowup', false)}
          className="w-20 h-20 bg-green-500/50 active:bg-green-400/50"
        >
          <ArrowUp className="w-10 h-10" />
        </TouchButton>
        <TouchButton
          onTouchStart={() => handleTouch('arrowdown', true)}
          onTouchEnd={() => handleTouch('arrowdown', false)}
          className="bg-red-500/50 active:bg-red-400/50"
        >
          <ArrowDown className="w-8 h-8" />
        </TouchButton>
      </div>
    </div>
  );
}
