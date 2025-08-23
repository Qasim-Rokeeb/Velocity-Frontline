// src/components/game/Leaderboard.tsx
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const leaderboardData = [
  { rank: 1, name: 'Player 1', time: '00:58.123' },
  { rank: 2, name: 'AI Opponent 1', time: '00:59.456' },
  { rank: 3, name: 'Player 2', time: '01:01.789' },
  { rank: 4, name: 'AI Opponent 2', time: '01:02.345' },
  { rank: 5, name: 'Player 3', time: '01:03.678' },
];

const Leaderboard = () => {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>Top 5 Lap Times</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry, index) => (
              <TableRow 
                key={entry.rank}
                className={cn(
                  "animate-fade-in-down transition-all duration-200 hover:bg-primary/10 hover:scale-[1.02]",
                  {
                    'bg-primary/20': entry.rank === 1
                  }
                )}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <TableCell className="font-medium">{entry.rank}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right font-mono">{entry.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
