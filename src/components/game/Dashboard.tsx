// src/components/game/Dashboard.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Timer, ChevronsRight, ShieldAlert, Trophy } from 'lucide-react';

interface DashboardProps {
  speed: number;
  lapTime: number;
  currentLap: number;
  bestLap: number;
  collisions: number;
}

const formatTime = (time: number) => {
  if (time === Infinity || time === 0) return '00:00.000';
  const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
  const milliseconds = (time % 1000).toString().padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
};

const StatCard = ({ icon, title, value, unit }: { icon: React.ReactNode, title: string, value: string, unit?: string }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-xl shadow-inner text-center h-full border border-border/20">
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

export default function Dashboard({ speed, lapTime, currentLap, bestLap, collisions }: DashboardProps) {
  return (
    <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50 rounded-xl">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={<Gauge className="h-5 w-5" />} title="Speed" value={speed.toFixed(0)} unit="km/h" />
          <StatCard icon={<Timer className="h-5 w-5" />} title="Lap Time" value={formatTime(lapTime)} />
          <StatCard icon={<ChevronsRight className="h-5 w-5" />} title="Lap" value={currentLap.toString()} />
          <StatCard icon={<Trophy className="h-5 w-5" />} title="Best Lap" value={formatTime(bestLap)} />
          <StatCard icon={<ShieldAlert className="h-5 w-5" />} title="Collisions" value={collisions.toString()} />
        </div>
      </CardContent>
    </Card>
  );
}
