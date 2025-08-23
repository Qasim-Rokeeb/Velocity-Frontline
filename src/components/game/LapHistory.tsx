// src/components/game/LapHistory.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface LapHistoryProps {
  lapTimes: number[];
}

const formatTime = (time: number) => {
  if (time === Infinity || time === 0) return '00:00.000';
  const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
  const milliseconds = (time % 1000).toString().padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
};

export default function LapHistory({ lapTimes }: LapHistoryProps) {
  if (lapTimes.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Lap History</CardTitle>
            <CardDescription>Your times for each completed lap.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {lapTimes.map((time, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-2 bg-background/50 rounded-lg shadow-inner text-center border border-border/20">
              <span className="text-xs text-muted-foreground">Lap {index + 1}</span>
              <span className="font-mono font-bold text-foreground">{formatTime(time)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
