'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '@/experience';

const PARTICLE_COUNT = 48;

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
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2.5,
    opacity: 0.15 + Math.random() * 0.45,
    duration: 14 + Math.random() * 22,
    delay: Math.random() * -20,
    driftX: (Math.random() - 0.5) * 40,
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

  // Scroll-linked parallax: shift fields + particle layer as the page slides
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
        el.style.setProperty('--scroll-y', String(y));
        el.style.setProperty('--parallax-slow', `${y * 0.08}px`);
        el.style.setProperty('--parallax-mid', `${y * 0.14}px`);
        el.style.setProperty('--parallax-fast', `${y * 0.22}px`);
        el.style.setProperty('--parallax-particles', `${y * 0.12}px`);
        // Subtle hue shift through the page (0 → ~25deg)
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(y / max, 1);
        el.style.setProperty('--scroll-progress', String(progress));
        el.style.setProperty('--hue-shift', `${progress * 28}deg`);
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
      className="living-background pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background-primary"
      style={
        {
          '--scroll-y': '0',
          '--parallax-slow': '0px',
          '--parallax-mid': '0px',
          '--parallax-fast': '0px',
          '--parallax-particles': '0px',
          '--scroll-progress': '0',
          '--hue-shift': '0deg',
        } as React.CSSProperties
      }
    >
      {/* Soft full-bleed color mesh that shifts with scroll */}
      <div className="living-mesh" />

      {/* Large drifting color fields */}
      <div className="living-field living-field-1" />
      <div className="living-field living-field-2" />
      <div className="living-field living-field-3" />
      <div className="living-field living-field-4" />

      {/* Flying particles */}
      {!prefersReduced && (
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
      )}

      <div className="living-noise" />
      <div className="living-vignette" />
    </div>
  );
}
