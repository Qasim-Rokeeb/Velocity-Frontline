// src/components/game/WeatherToggle.tsx
'use client';

import React from 'react';
import { Sun, CloudRain, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type Weather = 'sunny' | 'rainy' | 'night';

const weatherOptions: { id: Weather; name: string; icon: React.ReactNode }[] = [
  { id: 'sunny', name: 'Sunny', icon: <Sun className="h-5 w-5" /> },
  { id: 'rainy', name: 'Rainy', icon: <CloudRain className="h-5 w-5" /> },
  { id: 'night', name: 'Night', icon: <Moon className="h-5 w-5" /> },
];

interface WeatherToggleProps {
  weather: Weather;
  onWeatherChange: (weather: Weather) => void;
}

export default function WeatherToggle({ weather, onWeatherChange }: WeatherToggleProps) {
  const currentIndex = weatherOptions.findIndex((w) => w.id === weather);
  const nextIndex = (currentIndex + 1) % weatherOptions.length;
  const nextWeather = weatherOptions[nextIndex];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => onWeatherChange(nextWeather.id)}>
            {weatherOptions[currentIndex].icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Weather: {weatherOptions[currentIndex].name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
