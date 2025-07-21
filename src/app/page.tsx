import GameController from '@/components/game/GameController';
import DifficultyPanel from '@/components/game/DifficultyPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 lg:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-5xl lg:text-7xl font-headline font-bold text-primary tracking-wider uppercase">
          Velocity Frontline
        </h1>
        <p className="text-muted-foreground mt-2 font-body max-w-2xl">
          A sleek, browser-based racing game. Use your arrow keys to steer, accelerate, and brake. See if you can set the fastest lap!
        </p>
      </header>
      
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <GameController />
        </div>
        <div className="lg:col-span-1 space-y-8 order-1 lg:order-2">
          <DifficultyPanel />
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Use your keyboard to navigate the track.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <span className="font-medium">Accelerate</span>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4" /> Up Arrow
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <span className="font-medium">Brake / Reverse</span>
                 <Badge variant="secondary" className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4" /> Down Arrow
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <span className="font-medium">Steer Left</span>
                 <Badge variant="secondary" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Left Arrow
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <span className="font-medium">Steer Right</span>
                 <Badge variant="secondary" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Right Arrow
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <span className="font-medium">Restart Race</span>
                 <Badge variant="secondary" className="flex items-center gap-2">
                  <Key className="h-4 w-4" /> R Key
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
