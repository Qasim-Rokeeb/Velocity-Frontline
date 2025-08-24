// src/components/game/PitStopUI.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Fuel, ShieldCheck } from 'lucide-react';
import { Progress } from '../ui/progress';

interface CarState {
    x: number;
    y: number;
    speed: number;
    angle: number;
    isSkidding: boolean;
}

interface PitStopUIProps {
    progress: number;
    carState: CarState;
}

const pitActions = [
    { name: 'Refueling', icon: <Fuel className="h-5 w-5" />, duration: 1000 },
    { name: 'Repairing Damage', icon: <Wrench className="h-5 w-5" />, duration: 1500 },
    { name: 'Final Checks', icon: <ShieldCheck className="h-5 w-5" />, duration: 500 },
];

export default function PitStopUI({ progress, carState }: PitStopUIProps) {
    const [currentAction, setCurrentAction] = useState(0);

    useEffect(() => {
        if (progress > 33 && progress < 66) {
            setCurrentAction(1);
        } else if (progress >= 66) {
            setCurrentAction(2);
        } else {
            setCurrentAction(0);
        }
    }, [progress]);

    return (
        <div
            className="absolute z-30"
            style={{
                left: `${carState.x}px`,
                top: `${carState.y}px`,
                transform: 'translate(-50%, -150%)', // Position above the car
            }}
        >
            <motion.div
                className="w-48 bg-background/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-primary/50"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={currentAction}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2"
                            >
                                {pitActions[currentAction].icon}
                                <span>{pitActions[currentAction].name}...</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </motion.div>
        </div>
    );
}
