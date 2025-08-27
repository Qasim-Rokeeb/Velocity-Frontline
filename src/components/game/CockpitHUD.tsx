// src/components/game/CockpitHUD.tsx
'use client';

import React from 'react';
import ThrottleSlider from './ThrottleSlider';

export default function CockpitHUD() {
  const [throttle, setThrottle] = React.useState(0);

  React.useEffect(() => {
    // Simulate throttle changes for demonstration
    const interval = setInterval(() => {
      setThrottle(Math.random());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative grid grid-cols-3 items-end gap-8 text-white">
        <div />
        <div />
        <div className="flex justify-end">
            <ThrottleSlider value={throttle} />
        </div>
      </div>
    </div>
  );
}
