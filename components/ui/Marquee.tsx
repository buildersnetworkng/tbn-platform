'use client';

import type { ReactNode } from 'react';

export function Marquee({ children, durationSeconds = 40 }: { children: ReactNode[]; durationSeconds?: number }) {
  return (
    <div className="marquee-viewport">
      <div className="marquee-track" style={{ animationDuration: `${durationSeconds}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}
