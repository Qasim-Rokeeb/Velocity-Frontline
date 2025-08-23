// src/components/game/ColorPicker.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const availableColors = [
  { name: 'Vibrant Red', value: '#ef4444' },
  { name: 'Sunset Orange', value: '#f97316' },
  { name: 'Electric Yellow', value: '#eab308' },
  { name: 'Lime Green', value: '#84cc16' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Cyan Rush', value: '#06b6d4' },
  { name: 'Cobalt Blue', value: '#3b82f6' },
  { name: 'Indigo Violet', value: '#6366f1' },
  { name: 'Fuchsia Flash', value: '#d946ef' },
  { name: 'Hot Pink', value: '#ec4899' },
  { name: 'Classic Black', value: '#1a1a1a' },
  { name: 'Bright White', value: '#ffffff' },
];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Car Color</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {availableColors.map((color) => (
            <Tooltip key={color.value}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onColorChange(color.value)}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center',
                    selectedColor === color.value ? 'border-primary ring-2 ring-primary/50' : 'border-transparent',
                    color.value === '#ffffff' && 'border-gray-300'
                  )}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Select ${color.name}`}
                >
                  {selectedColor === color.value && (
                    <Check className={cn("h-5 w-5", color.value === '#ffffff' || color.value === '#eab308' || color.value === '#84cc16' ? 'text-black' : 'text-white')} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{color.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
