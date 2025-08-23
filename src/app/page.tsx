
import GameController from '@/components/game/GameController';
import DifficultyPanel from '@/components/game/DifficultyPanel';
import Leaderboard from '@/components/game/Leaderboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/game/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import MusicToggle from '@/components/MusicToggle';

const KeyDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn(
        "bg-gray-900/50 border border-gray-600 rounded-md w-12 h-12 flex items-center justify-center text-xl font-bold text-primary shadow-lg",
        "transform transition-all duration-100 active:scale-90 active:bg-primary active:text-white",
        className
    )}>
        {children}
    </div>
);


export default function Home() {
  return (
    <div className="flex">
      <Sidebar collapsible="icon">
        <SidebarContent className="space-y-4">
            <DifficultyPanel />
            <Leaderboard />
            <Card className="bg-card/50">
              <CardHeader>
                  <div className="flex items-center gap-3">
                      <Keyboard className="h-8 w-8 text-primary" />
                      <div>
                          <CardTitle>Controls</CardTitle>
                          <CardDescription>Master your machine.</CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col items-center space-y-1">
                      <KeyDisplay><ArrowUp className="h-6 w-6" /></KeyDisplay>
                      <span className="text-xs text-muted-foreground">Accelerate</span>
                  </div>
                  <div className="flex gap-2">
                      <div className="flex flex-col items-center space-y-1">
                          <KeyDisplay><ArrowLeft className="h-6 w-6" /></KeyDisplay>
                          <span className="text-xs text-muted-foreground">Steer Left</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                          <KeyDisplay><ArrowDown className="h-6 w-6" /></KeyDisplay>
                          <span className="text-xs text-muted-foreground">Brake</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                          <KeyDisplay><ArrowRight className="h-6 w-6" /></KeyDisplay>
                          <span className="text-xs text-muted-foreground">Steer Right</span>
                      </div>
                  </div>
                   <div className="flex flex-col items-center space-y-1 pt-2">
                      <KeyDisplay className="w-20">R</KeyDisplay>
                      <span className="text-xs text-muted-foreground">Restart Race</span>
                  </div>
              </CardContent>
            </Card>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 lg:p-8 space-y-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/30 to-background">
          <header className="w-full max-w-7xl flex justify-between items-center text-center space-y-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Logo />
              </div>
            <p className="text-muted-foreground font-body max-w-2xl text-lg hidden md:block">
              The ultimate browser-based racing challenge. Master the controls, perfect your line, and dominate the leaderboard.
            </p>
            <div className="flex items-center gap-2">
              <MusicToggle />
              <ThemeToggle />
            </div>
          </header>
          
          <div className="w-full max-w-7xl">
              <GameController />
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
