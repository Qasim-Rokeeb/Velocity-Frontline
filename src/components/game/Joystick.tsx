// src/components/game/Joystick.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface JoystickProps {
    onMove: (data: { angle: number, distance: number }) => void;
    size?: number;
    stickSize?: number;
}

const Joystick = ({ onMove, size = 120, stickSize = 60 }: JoystickProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const joystickRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        // Allow event to propagate for other start listeners (like in the parent)
    };

    const handleInteractionEnd = () => {
        if (isDragging.current) {
            isDragging.current = false;
            setPosition({ x: 0, y: 0 });
            onMove({ angle: 0, distance: 0 });
        }
    };

    const handleInteractionMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging.current || !joystickRef.current) return;

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let dx = clientX - centerX;
        let dy = clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = size / 2;

        if (distance > maxDistance) {
            dx = (dx / distance) * maxDistance;
            dy = (dy / distance) * maxDistance;
        }

        setPosition({ x: dx, y: dy });

        const angle = Math.atan2(dx, -dy) * (180 / Math.PI); // Angle in degrees, 0 is up
        const normalizedDistance = Math.min(distance / maxDistance, 1) * 100;

        onMove({ angle, distance: normalizedDistance });

    }, [onMove, size]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        handleInteractionMove(e.clientX, e.clientY);
    }, [handleInteractionMove]);
    
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches[0]) {
            handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [handleInteractionMove]);

    React.useEffect(() => {
        const currentRef = joystickRef.current;
        if (!currentRef) return;
        
        // Use window to capture moves and ends even if cursor leaves the element
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('touchend', handleInteractionEnd);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        return () => {
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchend', handleInteractionEnd);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handleMouseMove, handleTouchMove]);

    return (
        <div
            ref={joystickRef}
            className="relative rounded-full bg-black/30 backdrop-blur-sm"
            style={{ width: size, height: size }}
            onMouseDown={handleInteractionStart}
            onTouchStart={handleInteractionStart}
        >
            <div
                className="absolute rounded-full bg-primary/80 active:bg-primary transition-transform duration-100 ease-linear"
                style={{
                    width: stickSize,
                    height: stickSize,
                    top: `calc(50% - ${stickSize / 2}px)`,
                    left: `calc(50% - ${stickSize / 2}px)`,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
            />
        </div>
    );
};

export default Joystick;
