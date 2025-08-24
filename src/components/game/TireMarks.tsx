// src/components/game/TireMarks.tsx
'use client';

import React from 'react';

export interface TireMark {
    x: number;
    y: number;
}

interface TireMarksProps {
  marks: TireMark[];
}

// We memoize the component to prevent re-rendering every frame if the marks haven't changed.
const TireMarks = React.memo(({ marks }: TireMarksProps) => {
  if (!marks || marks.length === 0) {
    return null;
  }

  // To optimize, we can create a single path element instead of many circles.
  // However, for simplicity and to ensure marks fade individually if we add that later,
  // we'll use circles for now.
  return (
    <g>
      {marks.map((mark, index) => (
        <circle
          key={index}
          cx={mark.x}
          cy={mark.y}
          r="2" // Radius of the tire mark
          fill="rgba(0, 0, 0, 0.3)" // Semi-transparent black for the marks
          // We could add a fade-out effect here with CSS or framer-motion in the future
        />
      ))}
    </g>
  );
});

TireMarks.displayName = 'TireMarks';

export default TireMarks;
