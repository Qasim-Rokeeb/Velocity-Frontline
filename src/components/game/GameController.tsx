
// src/components/game/GameController.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import RaceTrack from './RaceTrack';
import Dashboard from './Dashboard';
import { Button } from '@/components/ui/button';
import { Play, RotateCw, Flag, Trophy, CarIcon, Pause, PlayCircle, LocateFixed, Film, StopCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import CarSelection from './CarSelection';
import { Car, cars as carData } from '@/components/game/CarSprites';
import RacingLights from './RacingLights';
import { motion, AnimatePresence } from 'framer-motion';
import LapHistory from './LapHistory';
import { Keybindings } from './SettingsPanel';
import { Difficulty } from './DifficultySelector';
import { Weather } from './WeatherToggle';
import { CameraMode } from './CameraToggle';
import { TireMark } from './TireMarks';
import GhostCar from './GhostCar';


type GameState = 'idle' | 'countdown' | 'racing' | 'finished' | 'paused' | 'replaying';
type CarState = { x: number; y: number; speed: number; angle: number; isSkidding: boolean };
type LapData = { time: number; states: CarState[] };
type CameraState = { x: number; y: number; angle: number };
type Spark = { id: number; x: number; y: number };

const INITIAL_CAR_STATE: CarState = {
  x: 525,
  y: 400,
  speed: 0,
  angle: -90,
  isSkidding: false,
};

// Track dimensions (must match RaceTrack.tsx)
const TRACK_CENTER = { x: 400, y: 250 };
const TRACK_OUTER = { rx: 350, ry: 200 };
const TRACK_INNER = { rx: 250, ry: 100 };
const FINISH_LINE = { x: 525, y_start: 150, y_end: 350 };
const TOTAL_LAPS = 3;
const MAX_INTERNAL_SPEED = 5;


interface GameControllerProps {
    steeringSensitivity: number;
    accelerationSensitivity: number;
    brakeStrength: number;
    autoAccelerate: boolean;
    steeringAssist: boolean;
    keybindings: Keybindings;
    carColor: string;
    onCarColorChange: (color: string) => void;
    playerName: string;
    onPlayerNameChange: (name: string) => void;
    difficulty: Difficulty;
    onDifficultyChange: (difficulty: Difficulty) => void;
    maxSpeed: number;
    tireGrip: number;
    weather: Weather;
    fog: boolean;
    zoomLevel: number;
    cameraMode: CameraMode;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => {
    const delta = b - a;
    if (delta > 180) b -= 360;
    else if (delta < -180) b += 360;
    return a + (b - a) * t;
};


export default function GameController({ 
    steeringSensitivity, 
    accelerationSensitivity, 
    brakeStrength, 
    autoAccelerate, 
    steeringAssist,
    keybindings,
    carColor,
    onCarColorChange,
    playerName,
    onPlayerNameChange,
    difficulty,
    onDifficultyChange,
    maxSpeed,
    tireGrip,
    weather,
    fog,
    zoomLevel,
    cameraMode,
}: GameControllerProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [carState, setCarState] = useState<CarState>(INITIAL_CAR_STATE);
  const [cameraState, setCameraState] = useState<CameraState>({ x: INITIAL_CAR_STATE.x, y: INITIAL_CAR_STATE.y, angle: INITIAL_CAR_STATE.angle });
  const [lapTime, setLapTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [lapHistory, setLapHistory] = useState<LapData[]>([]);
  const [currentLap, setCurrentLap] = useState(0);
  const [bestLap, setBestLap] = useState(Infinity);
  const [collisions, setCollisions] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [selectedCar, setSelectedCar] = useState<Car | null>(carData[0]);
  const [lapProgress, setLapProgress] = useState(0);
  const [carHealth, setCarHealth] = useState(100);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [tireMarks, setTireMarks] = useState<TireMark[]>([]);
  const [isColliding, setIsColliding] = useState(false);
  const [ghostCarState, setGhostCarState] = useState<CarState | null>(null);
  const [replayData, setReplayData] = useState<CarState[] | null>(null);
  const [replayFrame, setReplayFrame] = useState(0);
  const [bestLapData, setBestLapData] = useState<CarState[] | null>(null);
  const [gameFrame, setGameFrame] = useState(0);
  const [hideHud, setHideHud] = useState(false);
  const [maxSpeedReached, setMaxSpeedReached] = useState(0);

  const keys = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<number>();
  const lapStartTimeRef = useRef<number>(0);
  const raceStartTimeRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>();
  const passedCheckpoint = useRef(false);
  const sparkIdCounter = useRef(0);
  const joystickDataRef = useRef({ angle: 0, distance: 0 });
  const skidTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skidAudioRef = useRef<HTMLAudioElement>(null);
  const lastCollisionTime = useRef(0);
  const collisionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lapRecordingRef = useRef<CarState[]>([]);
  const replayLoopRef = useRef<number>();


  const formatTime = (time: number) => {
    if (time === Infinity || time === 0) return '00:00.000';
    const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = (time % 1000).toString().padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  const stopReplay = useCallback(() => {
      setGameState('idle');
      setReplayData(null);
      setReplayFrame(0);
      setGhostCarState(null);
      if (replayLoopRef.current) cancelAnimationFrame(replayLoopRef.current);
  }, []);

  const resetGame = useCallback((isRestart = false) => {
    setGameState('idle');
    setCarState(INITIAL_CAR_STATE);
    setCameraState({ x: INITIAL_CAR_STATE.x, y: INITIAL_CAR_STATE.y, angle: INITIAL_CAR_STATE.angle });
    setCurrentLap(0);
    setLapTime(0);
    setTotalTime(0);
    setCollisions(0);
    setLapProgress(0);
    setCarHealth(100);
    setSparks([]);
    setTireMarks([]);
    setMaxSpeedReached(0);
    if (isRestart) {
        if(gameState === 'replaying') stopReplay();
        setLapHistory([]);
        setBestLap(Infinity);
        setBestLapData(null);
    }
    setGameFrame(0);
    passedCheckpoint.current = false;
    if (lapStartTimeRef.current) lapStartTimeRef.current = 0;
    if (raceStartTimeRef.current) raceStartTimeRef.current = 0;
    if (skidTimeoutRef.current) clearTimeout(skidTimeoutRef.current);
    if (collisionTimeoutRef.current) clearTimeout(collisionTimeoutRef.current);
  }, [stopReplay, gameState]);

  const resetCarPosition = useCallback(() => {
    setCarState(INITIAL_CAR_STATE);
    setCameraState({ x: INITIAL_CAR_STATE.x, y: INITIAL_CAR_STATE.y, angle: INITIAL_CAR_STATE.angle });
    passedCheckpoint.current = false;
  }, []);
  
  const startGame = () => {
    if (!selectedCar) return;
    resetGame(true);
    setCarState(INITIAL_CAR_STATE);
    setCameraState({ x: INITIAL_CAR_STATE.x, y: INITIAL_CAR_STATE.y, angle: INITIAL_CAR_STATE.angle });
    setCurrentLap(0);
    setLapTime(0);
    setTotalTime(0);
    setCollisions(0);
    setLapProgress(0);
    setLapHistory([]);
    setCarHealth(100);
    setSparks([]);
    setTireMarks([]);
    setGameState('countdown');
    setCountdown(3);
  };

  const togglePause = () => {
      if (gameState === 'racing') {
          setGameState('paused');
      } else if (gameState === 'paused') {
          setGameState('racing');
          const now = performance.now();
          lapStartTimeRef.current = now - lapTime; // Recalibrate start time
          if (raceStartTimeRef.current > 0) {
            raceStartTimeRef.current = now - totalTime;
          }
      }
  }

  const handleLapCompletion = useCallback(() => {
    if (currentLap > 0 && lapTime > 0) {
      const finalLapTime = performance.now() - lapStartTimeRef.current;
      const newLapData: LapData = {
          time: finalLapTime,
          states: lapRecordingRef.current,
      };
      setLapHistory(prev => [...prev, newLapData]);

      if (finalLapTime < bestLap) {
        setBestLap(finalLapTime);
        setBestLapData(lapRecordingRef.current);
      }
    }
    lapRecordingRef.current = [];

    if (currentLap + 1 > TOTAL_LAPS) {
      setGameState('finished');
      return;
    }

    setCurrentLap(prev => prev + 1);
    setLapTime(0);
    lapStartTimeRef.current = performance.now();
  }, [currentLap, lapTime, bestLap]);

  const calculateLapProgress = useCallback((carX: number, carY: number) => {
    // Calculate angle of car relative to track center
    const angleRad = Math.atan2(carY - TRACK_CENTER.y, carX - TRACK_CENTER.x);
    let angleDeg = angleRad * (180 / Math.PI);

    // Normalize angle to be 0-360, where 0 is at the finish line (3 o'clock)
    if (angleDeg < 0) {
      angleDeg += 360;
    }
    
    // A simpler approach:
    // start angle is -90 (270). We want this to be 0.
    // So we add 90 degrees.
    let adjustedAngle = angleDeg + 90;
    if (adjustedAngle >= 360) {
        adjustedAngle -= 360;
    }
    // Now angle is 0 to 360, starting from bottom.
    setLapProgress(adjustedAngle / 3.6);

  }, []);

  const handleRemoveSpark = useCallback((id: number) => {
    setSparks(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleCollision = useCallback(() => {
    const now = Date.now();
    if (now - lastCollisionTime.current > 100) { // 100ms cooldown
        if (skidAudioRef.current) {
            skidAudioRef.current.currentTime = 0;
            skidAudioRef.current.play().catch(console.error);
        }
        lastCollisionTime.current = now;
    }

    setIsColliding(true);
    if (collisionTimeoutRef.current) clearTimeout(collisionTimeoutRef.current);
    collisionTimeoutRef.current = setTimeout(() => setIsColliding(false), 200);

    let damage = 15; // Medium difficulty
    if (difficulty === 'easy') {
        damage = 10;
    } else if (difficulty === 'hard') {
        damage = 25;
    }
    setCarHealth(h => Math.max(0, h - damage));
  }, [difficulty]);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimestampRef.current === undefined) {
      lastTimestampRef.current = timestamp;
    }
    const deltaTime = (timestamp - lastTimestampRef.current) / 16.67; // Normalize to 60fps
    lastTimestampRef.current = timestamp;
    
    if (gameState === 'racing') {
        if (lapStartTimeRef.current > 0) {
            setLapTime(timestamp - lapStartTimeRef.current);
        }
        if (raceStartTimeRef.current > 0) {
            setTotalTime(timestamp - raceStartTimeRef.current);
        }
    }

    let newCarState = { ...carState };
    setCarState(prev => {
      let { x, y, speed, angle, isSkidding } = prev;

      // --- Controls ---
      const turnSpeed = steeringSensitivity;
      const friction = 0.97;
      const maxInternalSpeed = (maxSpeed / 240) * MAX_INTERNAL_SPEED;
      const maxReverseSpeed = -2;

      const { accelerate, brake, left, right } = keybindings;
      const joystick = joystickDataRef.current;
      let isAcceleratingInput = false;

      // --- Acceleration & Braking ---
      if (joystick.distance > 0) { // Joystick is active
        const joystickAngleRad = joystick.angle * (Math.PI / 180);
        const forwardComponent = Math.cos(joystickAngleRad); // -1 to 1, where 1 is up
        if (forwardComponent > 0) { // Moving joystick forward
          const acceleration = accelerationSensitivity * forwardComponent * (joystick.distance / 50);
          speed = Math.min(maxInternalSpeed, speed + acceleration);
          isAcceleratingInput = true;
        } else { // Moving joystick backward
          const braking = brakeStrength * -forwardComponent * (joystick.distance / 50);
          speed = Math.max(maxReverseSpeed, speed - braking);
        }
      } else { // Keyboard controls
        if (autoAccelerate || keys.current.arrowup || keys.current[accelerate]) {
            speed = Math.min(maxInternalSpeed, speed + accelerationSensitivity);
            isAcceleratingInput = true;
        }
        if (keys.current.arrowdown || keys.current[brake]) speed = Math.max(maxReverseSpeed, speed - brakeStrength);
      }
      
      setIsAccelerating(isAcceleratingInput && speed > 0);

      speed *= friction;
      if (Math.abs(speed) < 0.01) speed = 0;
      
      // Update Max Speed
      const currentKmh = Math.abs(speed * (maxSpeed / MAX_INTERNAL_SPEED));
      if (currentKmh > maxSpeedReached) {
          setMaxSpeedReached(currentKmh);
      }

      let isTurning = false;
      // --- Steering ---
      if (speed !== 0) {
          const flip = speed > 0 ? 1 : -1;
          
          if (joystick.distance > 0) { // Joystick steering
              const joystickAngleRad = joystick.angle * (Math.PI / 180);
              const turnComponent = Math.sin(joystickAngleRad); // -1 to 1, where 1 is right
              const turnAmount = turnComponent * (joystick.distance / 50);
              angle += turnSpeed * turnAmount * flip * 0.5; // Adjust multiplier as needed
              if (Math.abs(turnComponent) > 0.2) isTurning = true;
          } else { // Keyboard steering
              if (keys.current.arrowleft || keys.current[left]) {
                angle -= turnSpeed * flip;
                isTurning = true;
              }
              if (keys.current.arrowright || keys.current[right]) {
                angle += turnSpeed * flip;
                isTurning = true;
              }
          }
      }

      // --- Tire Grip & Skidding ---
      if (isTurning && Math.abs(speed) > maxInternalSpeed * 0.6 && !isSkidding) {
          const skidChance = (1 - tireGrip) * (Math.abs(speed) / maxInternalSpeed) * 0.1;
          if (Math.random() < skidChance) {
              isSkidding = true;
              if (skidTimeoutRef.current) clearTimeout(skidTimeoutRef.current);
              skidTimeoutRef.current = setTimeout(() => {
                  setCarState(s => ({...s, isSkidding: false}));
              }, 300); // Skid duration
          }
      }

      if (isSkidding) {
          // Reduce steering effectiveness during skid
          const skidSteerDampen = 0.5;
          if (keys.current.arrowleft || keys.current[left]) angle -= turnSpeed * (speed > 0 ? 1 : -1) * (1 - skidSteerDampen);
          if (keys.current.arrowright || keys.current[right]) angle += turnSpeed * (speed > 0 ? 1 : -1) * (1 - skidSteerDampen);
          // Add a little random angle wobble
          angle += (Math.random() - 0.5) * 2;

          // Add tire mark
          const rad = (angle - 90) * (Math.PI / 180);
          const wheelOffset = 5; // Distance of wheels from car center
          const rearWheelDist = 10;
          const rearLeft = {
              x: x - Math.cos(rad + Math.PI / 2) * wheelOffset - Math.cos(rad) * rearWheelDist,
              y: y - Math.sin(rad + Math.PI / 2) * wheelOffset - Math.sin(rad) * rearWheelDist,
          };
          const rearRight = {
              x: x + Math.cos(rad + Math.PI / 2) * wheelOffset - Math.cos(rad) * rearWheelDist,
              y: y + Math.sin(rad + Math.PI / 2) * wheelOffset - Math.sin(rad) * rearWheelDist,
          };
          setTireMarks(marks => [...marks, {x: rearLeft.x, y: rearLeft.y}, {x: rearRight.x, y: rearRight.y}]);

      }
      
      // --- Steering Assist ---
      if (steeringAssist && speed > 0.5 && !isSkidding) {
        const dx = x - TRACK_CENTER.x;
        const dy = y - TRACK_CENTER.y;
        
        const avg_rx = (TRACK_OUTER.rx + TRACK_INNER.rx) / 2;
        const avg_ry = (TRACK_OUTER.ry + TRACK_INNER.ry) / 2;

        const tangentSlope = -(avg_ry ** 2 * dx) / (avg_rx ** 2 * dy);
        let targetAngle = Math.atan(tangentSlope) * (180 / Math.PI);
        
        if (dy > 0) {
            targetAngle += 180;
        }
        if (speed < 0) {
             targetAngle += 180;
        }

        const isCounterClockwise = speed > 0;
        if (!isCounterClockwise) {
            targetAngle += 180;
        }
        
        const normalizeAngle = (a:number) => (a + 180) % 360 - 180;
        const currentNormalizedAngle = normalizeAngle(angle);
        const targetNormalizedAngle = normalizeAngle(targetAngle);

        let angleDiff = targetNormalizedAngle - currentNormalizedAngle;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;

        const assistStrength = 0.03;
        angle += angleDiff * assistStrength * deltaTime;
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
        handleCollision();
        
        const newSparkId = sparkIdCounter.current++;
        setSparks(s => [...s, { id: newSparkId, x, y }]);

        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }

      // --- Lap Progress ---
      calculateLapProgress(x, y);


      // --- Lap Detection ---
      if (x < TRACK_CENTER.x - 50) {
        passedCheckpoint.current = true;
      }

      if (
        passedCheckpoint.current &&
        x > FINISH_LINE.x && x < FINISH_LINE.x + 20 &&
        y > FINISH_LINE.y_start && y < FINISH_LINE.y_end &&
        Math.abs(angle) > 80 && Math.abs(angle) < 100
      ) {
          handleLapCompletion();
          passedCheckpoint.current = false;
      }
      
      newCarState = { x, y, speed, angle, isSkidding };
      return newCarState;
    });
    
    lapRecordingRef.current.push(newCarState);

    // --- Ghost Car ---
    if (bestLapData && bestLapData[gameFrame]) {
        setGhostCarState(bestLapData[gameFrame]);
    }
    setGameFrame(f => f + 1);


    // --- Camera Smoothing ---
    setCameraState(prev => {
        const smoothingFactor = 0.08 * deltaTime;
        const newX = lerp(prev.x, newCarState.x, smoothingFactor);
        const newY = lerp(prev.y, newCarState.y, smoothingFactor);
        const newAngle = lerpAngle(prev.angle, newCarState.angle, smoothingFactor);
        return { x: newX, y: newY, angle: newAngle };
    });

  }, [carState, handleLapCompletion, calculateLapProgress, handleCollision, steeringSensitivity, accelerationSensitivity, brakeStrength, autoAccelerate, steeringAssist, keybindings, maxSpeed, tireGrip, bestLapData, gameFrame, gameState, maxSpeedReached]);


  const startReplay = useCallback((lapData: CarState[]) => {
      setGameState('replaying');
      setReplayData(lapData);
      setReplayFrame(0);
      setGhostCarState(lapData[0]);
      setHideHud(false);
  }, []);

  const replayLoop = useCallback(() => {
      if (!replayData) return;
      
      setReplayFrame(prevFrame => {
          const nextFrame = prevFrame + 1;
          if (nextFrame >= replayData.length) {
              // Replay finished
              stopReplay();
              return prevFrame;
          }
          setGhostCarState(replayData[nextFrame]);
          return nextFrame;
      });
  }, [replayData, stopReplay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
        keys.current[e.key.toLowerCase()] = true; 
        if(e.key.toLowerCase() === 'r') resetGame(true);
        if(e.key.toLowerCase() === 'p') togglePause();
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (replayLoopRef.current) cancelAnimationFrame(replayLoopRef.current);
    };
  }, [resetGame, togglePause]);

  useEffect(() => {
      if (gameState === 'countdown') {
          if (countdown > 0) {
              const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
              return () => clearTimeout(timer);
          } else {
              const goTimer = setTimeout(() => setGameState('racing'), 1000); // Show "Go" for 1 sec
              return () => clearTimeout(goTimer);
          }
      }
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'racing') {
      lastTimestampRef.current = performance.now();
      const runGameLoop = (timestamp: number) => {
          gameLoop(timestamp);
          gameLoopRef.current = requestAnimationFrame(runGameLoop);
      };
      gameLoopRef.current = requestAnimationFrame(runGameLoop);
      if (currentLap === 0) {
        setCurrentLap(1);
        const now = performance.now();
        lapStartTimeRef.current = now;
        raceStartTimeRef.current = now;
        lapRecordingRef.current = [];
        passedCheckpoint.current = false;
        setGameFrame(0);
      }
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
  }, [gameState, gameLoop, currentLap]);

  useEffect(() => {
      if (gameState === 'replaying') {
          const runReplayLoop = () => {
              replayLoop();
              replayLoopRef.current = requestAnimationFrame(runReplayLoop);
          }
          replayLoopRef.current = requestAnimationFrame(runReplayLoop);
      } else {
          if (replayLoopRef.current) cancelAnimationFrame(replayLoopRef.current);
      }
      return () => {
          if (replayLoopRef.current) cancelAnimationFrame(replayLoopRef.current);
      };
  }, [gameState, replayLoop]);

  return (
    <div className="space-y-4">
      <audio ref={skidAudioRef} src="/assets/skid.mp3" preload="auto" />
      <div className="relative aspect-[16/10] bg-blue-900/50 rounded-xl shadow-2xl overflow-hidden border-4 border-card">
        <AnimatePresence>
            {isColliding && (
                <motion.div
                    className="absolute inset-0 bg-red-500/50 z-50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.1 } }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {(gameState !== 'racing' && gameState !== 'finished') && (
            <motion.div
                className="absolute inset-0 bg-black/70 z-10 flex flex-col items-center justify-center text-white backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {gameState === 'idle' && (
                <div className="flex flex-col items-center gap-8">
                    <CarSelection 
                        onSelectCar={setSelectedCar} 
                        selectedCar={selectedCar} 
                        carColor={carColor}
                        onCarColorChange={onCarColorChange}
                        playerName={playerName}
                        onPlayerNameChange={onPlayerNameChange}
                        difficulty={difficulty}
                        onDifficultyChange={onDifficultyChange}
                    />
                    <Button onClick={startGame} size="lg" className="animate-pulse-strong" disabled={!selectedCar || !playerName}>
                        <Play className="mr-2 h-5 w-5" /> Start Race
                    </Button>
                </div>
                )}
                {gameState === 'countdown' && (
                    <RacingLights countdown={countdown} />
                )}
                {gameState === 'paused' && (
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-5xl font-headline text-primary animate-pulse">Paused</h2>
                        <Button onClick={togglePause} size="lg">
                            <PlayCircle className="mr-2 h-5 w-5" /> Resume
                        </Button>
                    </div>
                )}
                 {gameState === 'replaying' && (
                    <div className="absolute top-4 right-4 flex gap-2">
                         <Button onClick={() => setHideHud(h => !h)} variant="outline">
                            <Film className="mr-2 h-5 w-5" />
                            Toggle HUD
                        </Button>
                        <Button onClick={stopReplay} variant="destructive">
                            <StopCircle className="mr-2 h-5 w-5" />
                            Stop Replay
                        </Button>
                    </div>
                )}
            </motion.div>
            )}
        </AnimatePresence>
         <AlertDialog open={gameState === 'finished'}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center justify-center gap-2 text-3xl font-headline">
                <svg
                    className="w-10 h-10 animate-pulse-strong"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                >
                    <defs>
                        <pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="10" height="10" fill="white" />
                        <rect x="10" y="0" width="10" height="10" fill="black" />
                        <rect x="0" y="10" width="10" height="10" fill="black" />
                        <rect x="10" y="10" width="10" height="10" fill="white" />
                        </pattern>
                    </defs>
                    <path
                        d="M10,10 C15,0 20,0 25,10 S35,20 40,10 S50,0 55,10 S65,20 70,10 S80,0 85,10 S95,20 100,10 L100,90 C95,80 90,80 85,90 S75,100 70,90 S60,80 55,90 S45,100 40,90 S30,80 25,90 S15,100 10,90 Z"
                        fill="url(#checker)"
                        stroke="black"
                        strokeWidth="2"
                    />
                    <rect x="0" y="10" width="10" height="80" fill="currentColor" />
                </svg>
                Race Finished!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-center">
                Congratulations, {playerName}! You completed all {TOTAL_LAPS} laps.
                <div className="font-mono text-xl text-foreground my-4">
                    Total Time: {formatTime(totalTime)}
                </div>
                <div className="font-mono text-xl text-foreground my-4">
                    Best Lap: {formatTime(bestLap)}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => resetGame(true)} className="w-full">
                <RotateCw className="mr-2 h-5 w-5" /> Race Again
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <RaceTrack 
            carState={carState} 
            cameraState={cameraState}
            selectedCar={selectedCar} 
            carColor={carColor}
            sparks={sparks}
            onSparkAnimationComplete={handleRemoveSpark}
            touchControlsRef={keys}
            joystickDataRef={joystickDataRef}
            weather={weather}
            fog={fog}
            zoomLevel={zoomLevel}
            cameraMode={cameraMode}
            isAccelerating={isAccelerating}
            tireMarks={tireMarks}
            isColliding={isColliding}
        >
            {ghostCarState && (gameState === 'replaying' || (gameState === 'racing' && bestLapData)) && (
                <GhostCar carState={ghostCarState} selectedCar={selectedCar} carColor={carColor} weather={weather} />
            )}
        </RaceTrack>
      </div>

      <AnimatePresence>
      {!(gameState === 'replaying' && hideHud) && (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            <div className="flex items-start gap-4 flex-col lg:flex-row">
                <Dashboard
                    speed={Math.abs(carState.speed * (maxSpeed / MAX_INTERNAL_SPEED))}
                    maxSpeed={maxSpeed}
                    lapTime={lapTime}
                    totalTime={totalTime}
                    currentLap={Math.min(currentLap, TOTAL_LAPS)}
                    totalLaps={TOTAL_LAPS}
                    bestLap={bestLap}
                    collisions={collisions}
                    lapProgress={lapProgress}
                    carHealth={carHealth}
                    maxSpeedReached={maxSpeedReached}
                />
                <div className="flex flex-col gap-2 w-full lg:w-auto">
                    {gameState === 'replaying' ? (
                        <>
                           <Button onClick={() => setHideHud(h => !h)} variant="outline" className="h-full">
                                <Film className="mr-2 h-5 w-5"/>
                                {hideHud ? 'Show HUD' : 'Hide HUD'}
                            </Button>
                            <Button onClick={stopReplay} variant="destructive" className="h-full">
                                <StopCircle className="mr-2 h-5 w-5"/>
                                Stop Replay
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={togglePause} variant="outline" className="h-full" disabled={gameState !== 'racing' && gameState !== 'paused'}>
                                {gameState === 'paused' ? <PlayCircle className="mr-2 h-5 w-5"/> : <Pause className="mr-2 h-5 w-5"/>}
                                {gameState === 'paused' ? 'Resume' : 'Pause'}
                            </Button>
                            <Button onClick={resetCarPosition} variant="outline" className="h-full" disabled={gameState === 'idle' || gameState === 'countdown'}>
                                <LocateFixed className="mr-2 h-5 w-5"/>
                                Reset Car
                            </Button>
                            <Button onClick={() => resetGame(true)} variant="outline" className="h-full">
                                <RotateCw className="mr-2 h-5 w-5"/>
                                Restart
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <LapHistory lapData={lapHistory} onReplayLap={startReplay} />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

    
