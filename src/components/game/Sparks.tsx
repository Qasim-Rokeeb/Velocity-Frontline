// src/components/game/Sparks.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SparksProps {
  x: number;
  y: number;
  onAnimationComplete: () => void;
}

const Spark = ({ x, y, rotate, scale, onAnimationComplete }: { x: number, y: number, rotate: number, scale: number, onAnimationComplete?: () => void }) => {
  return (
    <motion.div
      className="absolute bg-yellow-400 w-1 h-1 rounded-full"
      style={{
        originX: '50%',
        originY: '50%',
      }}
      initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
      animate={{
        x: x,
        y: y,
        scale: scale,
        rotate: rotate,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        duration: 0.5,
      }}
      onAnimationComplete={onAnimationComplete}
    />
  );
};

export default function Sparks({ x, y, onAnimationComplete }: SparksProps) {
  const numSparks = 8;

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      {Array.from({ length: numSparks }).map((_, i) => {
        const angle = (i / numSparks) * 360;
        const distance = 30 + Math.random() * 20;
        const sparkX = Math.cos(angle * (Math.PI / 180)) * distance;
        const sparkY = Math.sin(angle * (Math.PI / 180)) * distance;
        
        return (
          <Spark
            key={i}
            x={sparkX}
            y={sparkY}
            rotate={Math.random() * 360}
            scale={0.5 + Math.random() * 0.8}
            onAnimationComplete={i === numSparks - 1 ? onAnimationComplete : undefined}
          />
        );
      })}
    </div>
  );
}
