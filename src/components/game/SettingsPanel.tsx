// src/components/game/SettingsPanel.tsx
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SettingsPanelProps {
    steeringSensitivity: number;
    onSteeringSensitivityChange: (value: number) => void;
}

export default function SettingsPanel({ steeringSensitivity, onSteeringSensitivityChange }: SettingsPanelProps) {
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
        <CardContent className="space-y-4">
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
        </CardContent>
    </Card>
  );
}
