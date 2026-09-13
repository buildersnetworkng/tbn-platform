'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '@/experience';

const PARTICLE_COUNT = 56;

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
};

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 110 - 5,
    size: 2.5 + Math.random() * 4.5,
    opacity: 0.45 + Math.random() * 0.55,
    duration: 10 + Math.random() * 16,
    delay: Math.random() * -18,
    driftX: (Math.random() - 0.5) * 50,
  }));
}

export function LivingBackground() {
  const prefersReduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => createParticles(PARTICLE_COUNT), []);

  useEffect(() => {
    function handleVisibilityChange() {
      setIsPaused(document.hidden);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleVisibilityChange();
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    let raf = 0;
    let latestY = 0;

    function onScroll() {
      latestY = window.scrollY || 0;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = rootRef.current;
        if (!el) return;
        const y = latestY;
        el.style.setProperty('--parallax-slow', `${y * 0.12}px`);
        el.style.setProperty('--parallax-mid', `${y * 0.22}px`);
        el.style.setProperty('--parallax-fast', `${y * 0.35}px`);
        el.style.setProperty('--parallax-particles', `${y * 0.18}px`);
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(y / max, 1);
        el.style.setProperty('--hue-shift', `${progress * 40}deg`);
      });
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-paused={isPaused || prefersReduced}
      data-reduced={prefersReduced ? 'true' : 'false'}
      className="living-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="living-parallax living-parallax-slow">
        <div className="living-mesh" />
      </div>

      <div className="living-parallax living-parallax-mid">
        <div className="living-field living-field-1" />
        <div className="living-field living-field-4" />
      </div>
      <div className="living-parallax living-parallax-fast">
        <div className="living-field living-field-2" />
      </div>
      <div className="living-parallax living-parallax-slow">
        <div className="living-field living-field-3" />
      </div>

      {!prefersReduced && (
        <div className="living-parallax living-parallax-particles">
          <div className="living-particles">
            {particles.map((p) => (
              <span
                key={p.id}
                className="living-particle"
                style={
                  {
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size,
                    height: p.size,
                    opacity: p.opacity,
                    animationDuration: `${p.duration}s`,
                    animationDelay: `${p.delay}s`,
                    ['--drift-x' as string]: `${p.driftX}vw`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className="living-noise" />
      <div className="living-vignette" />
    </div>
  );
}
