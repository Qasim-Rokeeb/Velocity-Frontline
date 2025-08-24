// src/components/game/GhostCar.tsx
'use client';

import React from 'react';
import { Car, ViperCar, ChallengerCar, PorscheCar, LamboCar } from './CarSprites';
import { cn } from '@/lib/utils';
import { Weather } from './WeatherToggle';

interface CarState {
    x: number;
    y: number;
    speed: number;
    angle: number;
    isSkidding: boolean;
}

interface GhostCarProps {
    carState: CarState;
    selectedCar: Car | null;
    carColor: string;
    weather: Weather;
}

const CarSprite = ({ selectedCar, angle, speed, color, weather }: { selectedCar: Car | null, angle: number, speed: number, color: string, weather: Weather }) => {
    if (!selectedCar) return null;

    // Ghost car should not have exhaust flames, so isAccelerating is false
    switch(selectedCar.id) {
        case 'viper': return <ViperCar angle={angle} speed={speed} color={color} weather={weather} isAccelerating={false} />;
        case 'challenger': return <ChallengerCar angle={angle} speed={speed} color={color} weather={weather} isAccelerating={false} />;
        case 'porsche': return <PorscheCar angle={angle} speed={speed} color={color} weather={weather} isAccelerating={false} />;
        case 'lambo': return <LamboCar angle={angle} speed={speed} color={color} weather={weather} isAccelerating={false} />;
        default: return <ViperCar angle={angle} speed={speed} color={color} weather={weather} isAccelerating={false} />;
    }
}


export default function GhostCar({ carState, selectedCar, carColor, weather }: GhostCarProps) {
  return (
    <div
      className="absolute will-change-transform z-20 opacity-50"
      style={{
        left: `${carState.x}px`,
        top: `${carState.y}px`,
        transform: `translate(-50%, -50%)`,
        transition: 'left 0s, top 0s'
      }}
    >
      <CarSprite selectedCar={selectedCar} angle={carState.angle} speed={carState.speed} color={carColor} weather={weather} />
    </div>
  );
}
