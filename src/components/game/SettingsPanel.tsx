// src/components/game/SettingsPanel.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings, Gamepad2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export type KeyAction = 'accelerate' | 'brake' | 'left' | 'right';
export type Keybindings = Record<KeyAction, string>;

interface SettingsPanelProps {
    steeringSensitivity: number;
    onSteeringSensitivityChange: (value: number) => void;
    accelerationSensitivity: number;
    onAccelerationSensitivityChange: (value: number) => void;
    brakeStrength: number;
    onBrakeStrengthChange: (value: number) => void;
    autoAccelerate: boolean;
    onAutoAccelerateChange: (value: boolean) => void;
    steeringAssist: boolean;
    onSteeringAssistChange: (value: boolean) => void;
    keybindings: Keybindings;
    onKeybindingsChange: (keybindings: Keybindings) => void;
}

const KeybindingButton = ({ keyName, onSetKey, isBinding, action }: { keyName: string; onSetKey: () => void; isBinding: boolean, action: KeyAction }) => {
    const displayName = (action.charAt(0).toUpperCase() + action.slice(1)).replace(/([A-Z])/g, ' $1').trim();
    return (
        <div className="flex items-center justify-between">
            <Label htmlFor={`keybind-${action}`}>{displayName}</Label>
            <Button
                id={`keybind-${action}`}
                variant="outline"
                onClick={onSetKey}
                className={cn("w-24", isBinding && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
            >
                {isBinding ? "Press key..." : keyName.toUpperCase()}
            </Button>
        </div>
    );
};


export default function SettingsPanel({ 
    steeringSensitivity, onSteeringSensitivityChange,
    accelerationSensitivity, onAccelerationSensitivityChange,
    brakeStrength, onBrakeStrengthChange,
    autoAccelerate, onAutoAccelerateChange,
    steeringAssist, onSteeringAssistChange,
    keybindings, onKeybindingsChange,
}: SettingsPanelProps) {
  const [bindingAction, setBindingAction] = useState<KeyAction | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (bindingAction) {
      event.preventDefault();
      // Check if key is already bound
      if (Object.values(keybindings).includes(event.key.toLowerCase())) {
          console.warn("Key already bound");
          setBindingAction(null);
          return;
      }
      onKeybindingsChange({ ...keybindings, [bindingAction]: event.key.toLowerCase() });
      setBindingAction(null);
    }
  }, [bindingAction, keybindings, onKeybindingsChange]);

  useEffect(() => {
    if (bindingAction) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [bindingAction, handleKeyDown]);


  return (
    <Card className="bg-card/50">
        <CardHeader>
            <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Fine-tune your driving experience.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
                <Tooltip>
                    <TooltipTrigger className="w-full text-left">
                        <Label htmlFor="steering-assist">
                            Steering Assist
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>When enabled, your car will be gently guided along the track.</p>
                    </TooltipContent>
                </Tooltip>
                <Switch
                    id="steering-assist"
                    checked={steeringAssist}
                    onCheckedChange={onSteeringAssistChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <Tooltip>
                    <TooltipTrigger className="w-full text-left">
                        <Label htmlFor="auto-accelerate">
                            Auto-Accelerate
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>When enabled, your car will accelerate automatically.</p>
                    </TooltipContent>
                </Tooltip>
                <Switch
                    id="auto-accelerate"
                    checked={autoAccelerate}
                    onCheckedChange={onAutoAccelerateChange}
                />
            </div>
            <div className="space-y-2">
                <Tooltip>
                    <TooltipTrigger className="w-full">
                        <Label htmlFor="steering-sensitivity" className="flex justify-between items-center">
                            <span>Steering Sensitivity</span>
                            <span className="text-xs text-muted-foreground">{steeringSensitivity.toFixed(2)}</span>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Adjust how quickly your car turns. Higher is faster.</p>
                    </TooltipContent>
                </Tooltip>
                <Slider
                    id="steering-sensitivity"
                    min={1}
                    max={5}
                    step={0.1}
                    value={[steeringSensitivity]}
                    onValueChange={(value) => onSteeringSensitivityChange(value[0])}
                />
            </div>
            <div className="space-y-2">
                <Tooltip>
                    <TooltipTrigger className="w-full">
                        <Label htmlFor="acceleration-sensitivity" className="flex justify-between items-center">
                            <span>Acceleration</span>
                            <span className="text-xs text-muted-foreground">{accelerationSensitivity.toFixed(2)}</span>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Adjust how quickly your car accelerates. Higher is faster.</p>
                    </TooltipContent>
                </Tooltip>
                <Slider
                    id="acceleration-sensitivity"
                    min={0.05}
                    max={0.2}
                    step={0.01}
                    value={[accelerationSensitivity]}
                    onValueChange={(value) => onAccelerationSensitivityChange(value[0])}
                />
            </div>
            <div className="space-y-2">
                <Tooltip>
                    <TooltipTrigger className="w-full">
                        <Label htmlFor="brake-strength" className="flex justify-between items-center">
                            <span>Brake Strength</span>
                            <span className="text-xs text-muted-foreground">{brakeStrength.toFixed(2)}</span>
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Adjust how quickly your car brakes. Higher is stronger.</p>
                    </TooltipContent>
                </Tooltip>
                <Slider
                    id="brake-strength"
                    min={0.05}
                    max={0.2}
                    step={0.01}
                    value={[brakeStrength]}
                    onValueChange={(value) => onBrakeStrengthChange(value[0])}
                />
            </div>
            <Separator />
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                    <Label>Keybindings</Label>
                </div>
                <div className="space-y-2 pt-2">
                    {(Object.keys(keybindings) as KeyAction[]).map((action) => (
                        <KeybindingButton
                            key={action}
                            action={action}
                            keyName={keybindings[action]}
                            onSetKey={() => setBindingAction(action)}
                            isBinding={bindingAction === action}
                        />
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
