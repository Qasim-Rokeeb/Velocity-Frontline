// src/components/game/CarSprites.tsx
import React from 'react';

export const cars = [
  {
    id: 'viper',
    name: 'Viper SRT',
  },
  {
    id: 'challenger',
    name: 'Challenger Hellcat',
  },
  {
    id: 'porsche',
    name: 'Porsche 911',
  },
  {
    id: 'lambo',
    name: 'Lamborghini Huracan',
  },
];

export type Car = (typeof cars)[number];


export const ViperCar = React.memo(({ angle }: { angle: number }) => (
    <div className="absolute w-6 h-10 md:w-8 md:h-12 transition-transform duration-75 ease-linear" style={{ transform: `rotate(${angle + 90}deg) scale(0.8)` }}>
      <svg viewBox="0 0 100 200" className="w-full h-full" style={{filter: 'drop-shadow(2px 4px 6px black)'}}>
        <path d="M20,10 L80,10 C90,10 100,20 100,30 L100,170 C100,180 90,190 80,190 L20,190 C10,190 0,180 0,170 L0,30 C0,20 10,10 20,10 Z" fill="hsl(var(--primary))" />
        <path d="M10,60 L90,60 L80,90 L20,90 Z" fill="rgba(0,0,0,0.5)" />
        <line x1="30" y1="15" x2="40" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        <line x1="70" y1="15" x2="60" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        <circle cx="20" cy="25" r="8" fill="yellow" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        <circle cx="80" cy="25" r="8" fill="yellow" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        <path d="M5,180 L95,180 L100,200 L0,200 Z" fill="hsl(var(--accent))" stroke="black" strokeWidth="2"/>
      </svg>
    </div>
));
ViperCar.displayName = 'ViperCar';

export const ChallengerCar = React.memo(({ angle }: { angle: number }) => (
    <div className="absolute w-6 h-10 md:w-8 md:h-12 transition-transform duration-75 ease-linear" style={{ transform: `rotate(${angle + 90}deg) scale(0.8)` }}>
        <svg viewBox="0 0 100 200" className="w-full h-full" style={{filter: 'drop-shadow(2px 4px 6px black)'}}>
            <path d="M10,20 L90,20 C95,20 100,25 100,30 L100,180 L0,180 L0,30 C0,25 5,20 10,20 Z" fill="#005A9C" />
            <path d="M10,70 L90,70 L80,100 L20,100 Z" fill="rgba(0,0,0,0.6)" />
            <rect x="0" y="80" width="100" height="5" fill="white" />
            <circle cx="25" cy="45" r="10" fill="white" /><circle cx="75" cy="45" r="10" fill="white" />
            <circle cx="25" cy="45" r="5" fill="black" /><circle cx="75" cy="45" r="5" fill="black" />
        </svg>
    </div>
));
ChallengerCar.displayName = 'ChallengerCar';


export const PorscheCar = React.memo(({ angle }: { angle: number }) => (
    <div className="absolute w-6 h-10 md:w-8 md:h-12 transition-transform duration-75 ease-linear" style={{ transform: `rotate(${angle + 90}deg) scale(0.8)` }}>
        <svg viewBox="0 0 100 200" className="w-full h-full" style={{filter: 'drop-shadow(2px 4px 6px black)'}}>
            <path d="M50,10 C10,30 0,80 0,120 L0,180 L100,180 L100,120 C100,80 90,30 50,10 Z" fill="#FFC700" />
            <path d="M20,80 C30,70 70,70 80,80 L70,110 L30,110 Z" fill="rgba(0,0,0,0.6)" />
            <circle cx="30" cy="60" r="12" fill="white" /><circle cx="70" cy="60" r="12" fill="white" />
            <circle cx="30" cy="60" r="6" fill="black" /><circle cx="70" cy="60" r="6" fill="black" />
        </svg>
    </div>
));
PorscheCar.displayName = 'PorscheCar';


export const LamboCar = React.memo(({ angle }: { angle: number }) => (
    <div className="absolute w-6 h-10 md:w-8 md:h-12 transition-transform duration-75 ease-linear" style={{ transform: `rotate(${angle + 90}deg) scale(0.8)` }}>
        <svg viewBox="0 0 100 200" className="w-full h-full" style={{filter: 'drop-shadow(2px 4px 6px black)'}}>
            <path d="M0,50 L50,10 L100,50 L100,180 L0,180 Z" fill="#00A651" />
            <path d="M20,60 L80,60 L70,80 L30,80 Z" fill="rgba(0,0,0,0.7)" />
            <path d="M0,50 L20,30 L80,30 L100,50" stroke="black" strokeWidth="4" fill="none" />
            <path d="M5,180 L95,180 L100,195 L0,195 Z" fill="#333" />
        </svg>
    </div>
));
LamboCar.displayName = 'LamboCar';
