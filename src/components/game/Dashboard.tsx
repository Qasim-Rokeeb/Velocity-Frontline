
// src/components/game/Dashboard.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Timer, ChevronsRight, ShieldAlert, Trophy } from 'lucide-react';
import Speedometer from "./Speedometer";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import LapProgress from "./LapProgress";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DamageIndicator from "./DamageIndicator";


interface DashboardProps {
  speed: number;
  lapTime: number;
  currentLap: number;
  totalLaps: number;
  bestLap: number;
  collisions: number;
  maxSpeed: number;
  lapProgress: number;
  carHealth: number;
}

const formatTime = (time: number) => {
  if (time === Infinity || time === 0) return '00:00.000';
  const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
  const milliseconds = (time % 1000).toString().padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
};

const StatCard = ({ icon, title, value, unit, className }: { icon: React.ReactNode, title: string, value: string, unit?: string, className?: string }) => (
  <div className={cn("flex flex-col items-center justify-center p-4 bg-background/50 rounded-xl shadow-inner text-center h-full border border-border/20", className)}>
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className="mt-1">
      <span className="text-3xl font-bold font-headline text-primary tracking-tighter transition-all duration-200">{value}</span>
      {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
    </div>
  </div>
);

export default function Dashboard({ speed, lapTime, currentLap, totalLaps, bestLap, collisions, maxSpeed, lapProgress, carHealth }: DashboardProps) {
  const [isNewBestLap, setIsNewBestLap] = useState(false);
  const [prevBestLap, setPrevBestLap] = useState(bestLap);

  useEffect(() => {
    if (bestLap < prevBestLap && bestLap !== Infinity) {
      setIsNewBestLap(true);
      const timer = setTimeout(() => setIsNewBestLap(false), 3000); // Banner display duration
      return () => clearTimeout(timer);
    }
    if(bestLap !== Infinity) {
      setPrevBestLap(bestLap);
    }
  }, [bestLap, prevBestLap]);

  return (
    <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50 rounded-xl overflow-hidden relative">
      <AnimatePresence>
        {isNewBestLap && (
            <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0 left-0 right-0 bg-primary/80 text-primary-foreground text-center p-2 z-10 font-headline text-lg"
            >
                New Record!
            </motion.div>
        )}
      </AnimatePresence>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1 sm:col-span-3 flex items-center justify-center">
            <Speedometer speed={speed} maxSpeed={maxSpeed} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 col-span-1 sm:col-span-3 lg:col-span-4 gap-4">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <StatCard icon={<Timer className="h-5 w-5" />} title="Lap Time" value={formatTime(lapTime)} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Time for the current lap.</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <StatCard icon={<ChevronsRight className="h-5 w-5" />} title="Lap" value={`${currentLap} / ${totalLaps}`} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Your current lap number.</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <StatCard
                            icon={<Trophy className="h-5 w-5" />}
                            title="Best Lap"
                            value={formatTime(bestLap)}
                            className={cn(isNewBestLap && 'animate-pulse-strong')}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Your fastest lap time in this session.</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <StatCard icon={<ShieldAlert className="h-5 w-5" />} title="Collisions" value={collisions.toString()} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Number of times you've hit a wall.</p>
                </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="space-y-2">
            <LapProgress progress={lapProgress} />
            <DamageIndicator health={carHealth} />
        </div>
      </CardContent>
    </Card>
  );
}
