// src/components/game/SettingsPanel.tsx
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Switch } from "../ui/switch";

interface SettingsPanelProps {
    steeringSensitivity: number;
    onSteeringSensitivityChange: (value: number) => void;
    accelerationSensitivity: number;
    onAccelerationSensitivityChange: (value: number) => void;
    brakeStrength: number;
    onBrakeStrengthChange: (value: number) => void;
    autoAccelerate: boolean;
    onAutoAccelerateChange: (value: boolean) => void;
}

export default function SettingsPanel({ 
    steeringSensitivity, onSteeringSensitivityChange,
    accelerationSensitivity, onAccelerationSensitivityChange,
    brakeStrength, onBrakeStrengthChange,
    autoAccelerate, onAutoAccelerateChange,
}: SettingsPanelProps) {
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
        </CardContent>
    </Card>
  );
}
