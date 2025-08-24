// src/components/game/ExhaustFlame.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlameParticle = ({ i }: { i: number }) => {
  const duration = 0.2 + Math.random() * 0.3;
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: `${4 + Math.random() * 6}px`,
        height: `${4 + Math.random() * 6}px`,
        backgroundColor: `rgba(255, ${100 + Math.random() * 100}, 0, ${0.5 + Math.random() * 0.5})`,
      }}
      initial={{
        y: 0,
        x: (Math.random() - 0.5) * 10,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        y: 20 + Math.random() * 20, // Move downwards (relative to car)
        x: (Math.random() - 0.5) * 20,
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'loop',
        delay: Math.random() * 0.5, // Stagger animations
        ease: "easeOut",
      }}
    />
  );
};

export default function ExhaustFlame() {
  const numParticles = 15;

  return (
    <div
      className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-10 h-10"
      style={{ transform: 'rotate(180deg)' }}
    >
      <AnimatePresence>
        {Array.from({ length: numParticles }).map((_, i) => (
          <FlameParticle key={i} i={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
