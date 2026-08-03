'use client';

import { useEffect, useState } from 'react';

export function LivingBackground() {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    function handleVisibilityChange() {
      setIsPaused(document.hidden);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleVisibilityChange();
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div
      aria-hidden="true"
      data-paused={isPaused}
      className="living-background pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background-primary"
    >
      <div className="living-field living-field-1" />
      <div className="living-field living-field-2" />
      <div className="living-field living-field-3" />
      <div className="living-noise" />
    </div>
  );
}
