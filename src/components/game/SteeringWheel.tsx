// src/components/game/SteeringWheel.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SteeringWheelProps {
    onAngleChange: (angle: number) => void;
    size?: number;
}

const SteeringWheel = ({ onAngleChange, size = 120 }: SteeringWheelProps) => {
    const [angle, setAngle] = useState(0);
    const wheelRef = useRef<SVGSVGElement>(null);
    const isDragging = useRef(false);

    const handleInteractionStart = () => {
        isDragging.current = true;
    };

    const handleInteractionEnd = () => {
        if (isDragging.current) {
            isDragging.current = false;
            // Return to center
            setAngle(0);
            onAngleChange(0);
        }
    };

    const handleInteractionMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging.current || !wheelRef.current) return;

        const wheelBounds = wheelRef.current.getBoundingClientRect();
        const centerX = wheelBounds.left + wheelBounds.width / 2;
        const centerY = wheelBounds.top + wheelBounds.height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        newAngle -= 90; // Offset to make 'up' 0 degrees

        // Clamp angle to a reasonable range, e.g., -90 to 90 degrees
        const clampedAngle = Math.max(-90, Math.min(90, newAngle));
        
        setAngle(clampedAngle);
        onAngleChange(clampedAngle);
    }, [onAngleChange]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        handleInteractionMove(event.clientX, event.clientY);
    }, [handleInteractionMove]);

    const handleTouchMove = useCallback((event: TouchEvent) => {
        if (event.touches.length > 0) {
            handleInteractionMove(event.touches[0].clientX, event.touches[0].clientY);
        }
    }, [handleInteractionMove]);


    React.useEffect(() => {
        const wheelElement = wheelRef.current;
        if (wheelElement) {
            wheelElement.addEventListener('mousedown', handleInteractionStart);
            wheelElement.addEventListener('touchstart', handleInteractionStart);

            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('touchend', handleInteractionEnd);
            
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
        }

        return () => {
            if (wheelElement) {
                wheelElement.removeEventListener('mousedown', handleInteractionStart);
                wheelElement.removeEventListener('touchstart', handleInteractionStart);
            }
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchend', handleInteractionEnd);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handleMouseMove, handleTouchMove]);


    return (
        <div 
            className="relative select-none"
            style={{ width: size, height: size }}
        >
            <svg
                ref={wheelRef}
                viewBox="0 0 100 100"
                className={cn(
                    "w-full h-full transition-transform duration-100 ease-linear cursor-pointer active:cursor-grabbing",
                    isDragging.current && "scale-105"
                )}
                style={{ transform: `rotate(${angle}deg)` }}
            >
                {/* Wheel shape */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--foreground))" strokeWidth="10" opacity="0.4" />
                
                {/* Spokes */}
                <line x1="50" y1="15" x2="50" y2="85" stroke="hsl(var(--foreground))" strokeWidth="8" opacity="0.3" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="hsl(var(--foreground))" strokeWidth="8" opacity="0.3" />
                
                {/* Center hub */}
                <circle cx="50" cy="50" r="15" fill="hsl(var(--primary))" />
                <circle cx="50" cy="50" r="12" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
            </svg>
        </div>
    );
};

export default SteeringWheel;
