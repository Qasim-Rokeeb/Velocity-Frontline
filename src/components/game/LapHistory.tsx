
// src/components/game/LapHistory.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Film, Medal } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface CarState {
    x: number;
    y: number;
    speed: number;
    angle: number;
    isSkidding: boolean;
}

interface LapData {
  time: number;
  states: CarState[];
}

interface LapHistoryProps {
  lapData: LapData[];
  onReplayLap: (states: CarState[]) => void;
}

const formatTime = (time: number) => {
  if (time === Infinity || time === 0) return '00:00.000';
  const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
  const milliseconds = (time % 1000).toString().padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
};

const getMedalForTime = (time: number): { type: 'gold' | 'silver' | 'bronze' | null, tooltip: string } => {
    if (time < 60000) return { type: 'gold', tooltip: 'Gold! (Sub 1:00)' };
    if (time < 65000) return { type: 'silver', tooltip: 'Silver! (Sub 1:05)' };
    if (time < 70000) return { type: 'bronze', tooltip: 'Bronze! (Sub 1:10)' };
    return { type: null, tooltip: 'No medal for this lap.' };
};

export default function LapHistory({ lapData, onReplayLap }: LapHistoryProps) {
  if (lapData.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {lapData.map((lap, index) => {
                const medal = getMedalForTime(lap.time);
                return (
                <div key={index} className="flex flex-col items-center justify-center p-2 bg-background/50 rounded-lg shadow-inner text-center border border-border/20 space-y-2">
                    <span className="text-xs text-muted-foreground">Lap {index + 1}</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{formatTime(lap.time)}</span>
                        {medal.type && (
                             <Tooltip>
                                <TooltipTrigger>
                                    <Medal className={cn("h-5 w-5", {
                                        'text-yellow-400': medal.type === 'gold',
                                        'text-gray-400': medal.type === 'silver',
                                        'text-orange-400': medal.type === 'bronze',
                                    })} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{medal.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReplayLap(lap.states)}
                    >
                    <Film className="mr-2 h-4 w-4" />
                    Replay
                    </Button>
                </div>
                )
            })}
            </div>
        </CardContent>
        </Card>
    </TooltipProvider>
  );
}
