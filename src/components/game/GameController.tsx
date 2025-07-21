// src/components/game/GameController.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import RaceTrack from './RaceTrack';
import Dashboard from './Dashboard';
import { Button } from '@/components/ui/button';
import { Play, RotateCw, Flag } from 'lucide-react';

type GameState = 'idle' | 'countdown' | 'racing' | 'finished';
type CarState = { x: number; y: number; speed: number; angle: number; };

const INITIAL_CAR_STATE: CarState = {
  x: 525,
  y: 400,
  speed: 0,
  angle: -90,
};

// Track dimensions (must match RaceTrack.tsx)
const TRACK_CENTER = { x: 400, y: 250 };
const TRACK_OUTER = { rx: 350, ry: 200 };
const TRACK_INNER = { rx: 250, ry: 100 };
const FINISH_LINE = { x: 525, y_start: 150, y_end: 350 };


export default function GameController() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [carState, setCarState] = useState<CarState>(INITIAL_CAR_STATE);
  const [lapTime, setLapTime] = useState(0);
  const [currentLap, setCurrentLap] = useState(0);
  const [bestLap, setBestLap] = useState(Infinity);
  const [collisions, setCollisions] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const keys = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<number>();
  const lapTimerRef = useRef<number>();
  const lastTimestampRef = useRef<number>();
  const passedCheckpoint = useRef(false);

  const formatTime = (time: number) => {
    if (time === Infinity || time === 0) return '00:00.000';
    const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = (time % 1000).toString().padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  const resetGame = useCallback(() => {
    setGameState('idle');
    setCarState(INITIAL_CAR_STATE);
    setCurrentLap(0);
    setLapTime(0);
    setCollisions(0);
    passedCheckpoint.current = false;
    if (lapTimerRef.current) clearInterval(lapTimerRef.current);
  }, []);
  
  const startGame = () => {
    resetGame();
    setGameState('countdown');
    setCountdown(3);
  };

  const handleLapCompletion = useCallback(() => {
    if (currentLap > 0) {
      if (lapTime < bestLap) {
        setBestLap(lapTime);
      }
    }
    setCurrentLap(prev => prev + 1);
    setLapTime(0);
  }, [currentLap, lapTime, bestLap]);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimestampRef.current === undefined) {
      lastTimestampRef.current = timestamp;
    }
    const deltaTime = (timestamp - lastTimestampRef.current) / 16.67; // Normalize to 60fps
    lastTimestampRef.current = timestamp;

    setCarState(prev => {
      let { x, y, speed, angle } = prev;

      // --- Controls ---
      const acceleration = 0.1;
      const turnSpeed = 2.5;
      const friction = 0.97;
      const maxSpeed = 5;
      const maxReverseSpeed = -2;

      if (keys.current.ArrowUp) speed = Math.min(maxSpeed, speed + acceleration);
      if (keys.current.ArrowDown) speed = Math.max(maxReverseSpeed, speed - acceleration);
      
      speed *= friction;
      if (Math.abs(speed) < 0.01) speed = 0;

      if (speed !== 0) {
          const flip = speed > 0 ? 1 : -1;
          if (keys.current.ArrowLeft) angle -= turnSpeed * flip;
          if (keys.current.ArrowRight) angle += turnSpeed * flip;
      }
      
      const rad = angle * (Math.PI / 180);
      x += Math.cos(rad) * speed * deltaTime;
      y += Math.sin(rad) * speed * deltaTime;

      // --- Collision Detection ---
      const isOutOfBounds =
        ((x - TRACK_CENTER.x) ** 2) / (TRACK_OUTER.rx ** 2) +
        ((y - TRACK_CENTER.y) ** 2) / (TRACK_OUTER.ry ** 2) > 1;
      const isInfield =
        ((x - TRACK_CENTER.x) ** 2) / (TRACK_INNER.rx ** 2) +
        ((y - TRACK_CENTER.y) ** 2) / (TRACK_INNER.ry ** 2) < 1;

      if (isOutOfBounds || isInfield) {
        speed = -speed * 0.5; // Bounce back
        setCollisions(c => c + 1);
      }

      // --- Lap Detection ---
      // Checkpoint on the left side
      if (x < TRACK_CENTER.x - 50) {
        passedCheckpoint.current = true;
      }

      // Finish line on the right side
      if (
        passedCheckpoint.current &&
        x > FINISH_LINE.x && x < FINISH_LINE.x + 20 && // In a vertical band
        y > FINISH_LINE.y_start && y < FINISH_LINE.y_end && // Crossing the line
        Math.abs(angle) > 80 && Math.abs(angle) < 100 // Roughly horizontal
      ) {
          handleLapCompletion();
          passedCheckpoint.current = false;
      }

      return { x, y, speed, angle };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [handleLapCompletion]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key] = true; if(e.key.toLowerCase() === 'r') resetGame() };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (lapTimerRef.current) clearInterval(lapTimerRef.current);
    };
  }, [resetGame]);

  useEffect(() => {
      if (gameState === 'countdown') {
          if (countdown > 0) {
              const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
              return () => clearTimeout(timer);
          } else {
              setGameState('racing');
          }
      }
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'racing') {
      lastTimestampRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      lapTimerRef.current = window.setInterval(() => {
        setLapTime(t => t + 10);
      }, 10);
      if (currentLap === 0) {
        handleLapCompletion();
      }
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (lapTimerRef.current) clearInterval(lapTimerRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (lapTimerRef.current) clearInterval(lapTimerRef.current);
    }
  }, [gameState, gameLoop, handleLapCompletion, currentLap]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-4 border-card">
        {gameState !== 'racing' && (
          <div className="absolute inset-0 bg-black/70 z-10 flex flex-col items-center justify-center text-white backdrop-blur-sm">
            {gameState === 'idle' && (
              <>
                <h2 className="text-6xl font-headline font-bold">Ready to Race?</h2>
                <Button onClick={startGame} size="lg" className="mt-8">
                  <Play className="mr-2 h-5 w-5" /> Start Race
                </Button>
              </>
            )}
            {gameState === 'countdown' && (
              <div className="text-9xl font-headline font-bold text-primary animate-ping">
                {countdown > 0 ? countdown : <Flag />}
              </div>
            )}
            {gameState === 'finished' && (
               <>
                <h2 className="text-6xl font-headline font-bold">Finished!</h2>
                <p className="text-xl mt-4">Your best lap was {formatTime(bestLap)}</p>
                <Button onClick={startGame} size="lg" className="mt-8">
                  <RotateCw className="mr-2 h-5 w-5" /> Race Again
                </Button>
              </>
            )}
          </div>
        )}
        <RaceTrack carPosition={carState} carAngle={carState.angle} />
      </div>
      <Dashboard
        speed={Math.abs(carState.speed * 20)}
        lapTime={lapTime}
        currentLap={currentLap}
        bestLap={bestLap}
        collisions={collisions}
      />
    </div>
  );
}
