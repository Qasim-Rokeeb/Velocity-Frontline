
// src/app/page.tsx
'use client';

import { useState } from 'react';
import GameController from '@/components/game/GameController';
import DifficultyPanel from '@/components/game/DifficultyPanel';
import Leaderboard from '@/components/game/Leaderboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Keyboard, SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/game/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import MusicToggle from '@/components/MusicToggle';
import { Separator } from '@/components/ui/separator';
import SettingsPanel, { Keybindings } from '@/components/game/SettingsPanel';
import { Difficulty } from '@/components/game/DifficultySelector';
import WeatherToggle, { Weather } from '@/components/game/WeatherToggle';
import FogToggle from '@/components/game/FogToggle';
import ZoomToggle from '@/components/game/ZoomToggle';
import CameraToggle, { CameraMode } from '@/components/game/CameraToggle';
import Footer from '@/components/game/Footer';
import { Button } from '@/components/ui/button';

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
  const [steeringSensitivity, setSteeringSensitivity] = useState(2.5);
  const [accelerationSensitivity, setAccelerationSensitivity] = useState(0.1);
  const [brakeStrength, setBrakeStrength] = useState(0.1);
  const [autoAccelerate, setAutoAccelerate] = useState(false);
  const [steeringAssist, setSteeringAssist] = useState(false);
  const [keybindings, setKeybindings] = useState<Keybindings>({
    accelerate: 'w',
    brake: 's',
    left: 'a',
    right: 'd',
  });
  const [carColor, setCarColor] = useState('hsl(var(--primary))');
  const [playerName, setPlayerName] = useState('Player 1');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [maxSpeed, setMaxSpeed] = useState(240);
  const [tireGrip, setTireGrip] = useState(0.5);
  const [weather, setWeather] = useState<Weather>('sunny');
  const [fog, setFog] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraMode, setCameraMode] = useState<CameraMode>('top-down');
  const { toggleSidebar } = useSidebar();


  return (
    <div className="flex">
      <Sidebar collapsible="offcanvas">
        <SidebarContent className="space-y-4">
            <SettingsPanel 
                steeringSensitivity={steeringSensitivity}
                onSteeringSensitivityChange={setSteeringSensitivity}
                accelerationSensitivity={accelerationSensitivity}
                onAccelerationSensitivityChange={setAccelerationSensitivity}
                brakeStrength={brakeStrength}
                onBrakeStrengthChange={setBrakeStrength}
                autoAccelerate={autoAccelerate}
                onAutoAccelerateChange={setAutoAccelerate}
                steeringAssist={steeringAssist}
                onSteeringAssistChange={setSteeringAssist}
                keybindings={keybindings}
                onKeybindingsChange={setKeybindings}
                maxSpeed={maxSpeed}
                onMaxSpeedChange={setMaxSpeed}
                tireGrip={tireGrip}
                onTireGripChange={setTireGrip}
            />
            <DifficultyPanel />
            <Leaderboard playerName={playerName} />
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
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="flex gap-4">
                    {/* WASD Controls */}
                    <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-col items-center space-y-1">
                            <KeyDisplay>{keybindings.accelerate.toUpperCase()}</KeyDisplay>
                            <span className="text-xs text-muted-foreground">Accelerate</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center space-y-1">
                                <KeyDisplay>{keybindings.left.toUpperCase()}</KeyDisplay>
                                <span className="text-xs text-muted-foreground">Steer L</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                                <KeyDisplay>{keybindings.brake.toUpperCase()}</KeyDisplay>
                                <span className="text-xs text-muted-foreground">Brake</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                                <KeyDisplay>{keybindings.right.toUpperCase()}</KeyDisplay>
                                <span className="text-xs text-muted-foreground">Steer R</span>
                            </div>
                        </div>
                    </div>
                     {/* Arrow Key Controls */}
                    <div className="flex flex-col items-center space-y-2">
                        <div className="flex flex-col items-center space-y-1">
                            <KeyDisplay><ArrowUp className="h-6 w-6" /></KeyDisplay>
                             <span className="text-xs text-muted-foreground">Accelerate</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center space-y-1">
                                <KeyDisplay><ArrowLeft className="h-6 w-6" /></KeyDisplay>
                                <span className="text-xs text-muted-foreground">Steer L</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                                <KeyDisplay><ArrowDown className="h-6 w-6" /></KeyDisplay>
                                <span className="text-xs text-muted-foreground">Brake</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                                <KeyDisplay><ArrowRight className="h-6 w-6" /></KeyDisplay>
                                <span className="text-xs text-muted-foreground">Steer R</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />
                
                <div className="flex gap-4">
                    <div className="flex flex-col items-center space-y-1">
                        <KeyDisplay className="w-20">P</KeyDisplay>
                        <span className="text-xs text-muted-foreground">Pause / Resume</span>
                    </div>
                     <div className="flex flex-col items-center space-y-1">
                        <KeyDisplay className="w-20">R</KeyDisplay>
                        <span className="text-xs text-muted-foreground">Restart Race</span>
                    </div>
                </div>
              </CardContent>
            </Card>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/30 to-background overflow-x-hidden">
          <div className="w-full mx-auto max-w-7xl px-4 lg:px-8">
            <header className="w-full flex justify-between items-center text-center py-4">
                <div className="flex items-center gap-4">
                  <Logo />
                </div>
              
              <div className="flex items-center gap-2">
                <CameraToggle cameraMode={cameraMode} onCameraModeChange={setCameraMode} />
                <ZoomToggle zoomLevel={zoomLevel} onZoomChange={setZoomLevel} />
                <FogToggle isFoggy={fog} onFogChange={setFog} />
                <WeatherToggle weather={weather} onWeatherChange={setWeather} />
                <MusicToggle />
                <ThemeToggle />
                <Button variant="outline" size="icon" onClick={toggleSidebar}>
                  <SettingsIcon />
                </Button>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center w-full mx-auto my-8">
                <GameController 
                  steeringSensitivity={steeringSensitivity} 
                  accelerationSensitivity={accelerationSensitivity}
                  brakeStrength={brakeStrength}
                  autoAccelerate={autoAccelerate}
                  steeringAssist={steeringAssist}
                  keybindings={keybindings}
                  carColor={carColor}
                  onCarColorChange={setCarColor}
                  playerName={playerName}
                  onPlayerNameChange={setPlayerName}
                  difficulty={difficulty}
                  onDifficultyChange={setDifficulty}
                  maxSpeed={maxSpeed}
                  tireGrip={tireGrip}
                  weather={weather}
                  fog={fog}
                  zoomLevel={zoomLevel}
                  cameraMode={cameraMode}
                />
            </main>
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </div>
  );
}
