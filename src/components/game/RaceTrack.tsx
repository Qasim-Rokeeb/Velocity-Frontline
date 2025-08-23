
// src/components/game/RaceTrack.tsx
'use client';

import React from 'react';
import { Car, ViperCar, ChallengerCar, PorscheCar, LamboCar } from '@/components/game/CarSprites';
import MiniMap from './MiniMap';
import Sparks from './Sparks';
import TouchControls from './TouchControls';
import { cn } from '@/lib/utils';
import { Weather } from './WeatherToggle';
import RainEffect from './RainEffect';

interface Spark {
    id: number;
    x: number;
    y: number;
}

interface CarState {
    x: number;
    y: number;
    speed: number;
    angle: number;
    isSkidding: boolean;
}

interface RaceTrackProps {
  carState: CarState,
  selectedCar: Car | null;
  carColor: string;
  sparks: Spark[];
  onSparkAnimationComplete: (id: number) => void;
  touchControlsRef: React.MutableRefObject<{ [key: string]: boolean }>;
  joystickDataRef: React.MutableRefObject<{ angle: number; distance: number }>;
  weather: Weather;
}

const CarSprite = ({ selectedCar, angle, speed, color, weather }: { selectedCar: Car | null, angle: number, speed: number, color: string, weather: Weather }) => {
    if (!selectedCar) return null;

    switch(selectedCar.id) {
        case 'viper': return <ViperCar angle={angle} speed={speed} color={color} weather={weather} />;
        case 'challenger': return <ChallengerCar angle={angle} speed={speed} color={color} weather={weather} />;
        case 'porsche': return <PorscheCar angle={angle} speed={speed} color={color} weather={weather} />;
        case 'lambo': return <LamboCar angle={angle} speed={speed} color={color} weather={weather} />;
        default: return <ViperCar angle={angle} speed={speed} color={color} weather={weather} />;
    }
}


export default function RaceTrack({ carState, selectedCar, carColor, sparks, onSparkAnimationComplete, touchControlsRef, joystickDataRef, weather }: RaceTrackProps) {
  return (
    <div className="w-full h-full bg-blue-900/50 flex items-center justify-center overflow-hidden relative">
        <MiniMap carPosition={carState} />
        <TouchControls keysRef={touchControlsRef} joystickDataRef={joystickDataRef} />
        {weather === 'rainy' && <RainEffect />}
        {weather === 'night' && <div className="absolute inset-0 bg-black/70 z-0" />}
        {weather === 'rainy' && <div className="absolute inset-0 bg-blue-900/40 z-0" />}

        <svg width="100%" height="100%" viewBox="0 0 800 500" className="relative z-10">
            <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                <feMerge>
                <feMergeNode in="offsetBlur"/>
                <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            </defs>
            
            {/* Track path: A compound path creating an oval shape */}
            <path
            d="M 400,50 
                A 350,200 0 1,1 400,450 
                A 350,200 0 1,1 400,50 Z
                M 400,150
                A 250,100 0 1,0 400,350
                A 250,100 0 1,0 400,150 Z"
            fill="hsl(var(--secondary))"
            fillRule="evenodd"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
            />
            
            {/* Start/Finish Line */}
            <line
            x1="525" y1="150"
            x2="525" y2="350"
            stroke="hsl(var(--accent))"
            strokeWidth="5"
            strokeDasharray="10, 10"
            />

            {/* Inner and Outer kerbs */}
            <path
            d="M 400,150 A 250,100 0 1,0 400,350 A 250,100 0 1,0 400,150 Z"
            fill="none"
            stroke="url(#kerb)"
            strokeWidth="6"
            />
            <path
            d="M 400,50 A 350,200 0 1,1 400,450 A 350,200 0 1,1 400,50 Z"
            fill="none"
            stroke="url(#kerb)"
            strokeWidth="6"
            />
            <defs>
            <linearGradient id="kerb" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
            </linearGradient>
            <pattern id="kerb-pattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="10" height="20" fill="hsl(var(--primary))"/>
                <rect x="10" width="10" height="20" fill="white"/>
            </pattern>
            </defs>

        </svg>
        <div
            className={cn(
                "absolute transition-transform duration-75 z-20",
                carState.isSkidding && 'animate-shake'
            )}
            style={{
            left: `${carState.x}px`,
            top: `${carState.y}px`,
            transform: `translate(-50%, -50%)`,
            }}
        >
            <CarSprite selectedCar={selectedCar} angle={carState.angle} speed={carState.speed} color={carColor} weather={weather} />
        </div>

        {sparks.map(spark => (
            <Sparks
            key={spark.id}
            x={spark.x}
            y={spark.y}
            onAnimationComplete={() => onSparkAnimationComplete(spark.id)}
            />
        ))}
    </div>
  );
}
