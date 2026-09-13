'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/experience';

type Orbiter = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
};

function createOrbiters(count: number): Orbiter[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    radius: 0.18 + (i % 5) * 0.06 + Math.random() * 0.04,
    speed: 0.15 + (i % 4) * 0.08 + Math.random() * 0.05,
    size: 1.2 + (i % 3) * 0.8,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function LivingBackground() {
  const prefersReduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const orbitersRef = useRef<Orbiter[]>(createOrbiters(24));

  useEffect(() => {
    function handleVisibilityChange() {
      setIsPaused(document.hidden);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleVisibilityChange();
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    function onScroll() {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollRef.current = Math.min((window.scrollY || 0) / max, 1);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const start = performance.now();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    function drawStaticPresence() {
      ctx!.clearRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.42;
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      g.addColorStop(0, 'rgba(160, 200, 255, 0.22)');
      g.addColorStop(0.35, 'rgba(80, 140, 255, 0.1)');
      g.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);
    }

    if (prefersReduced) {
      drawStaticPresence();
      return () => window.removeEventListener('resize', resize);
    }

    function frame(now: number) {
      if (isPaused) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const t = (now - start) / 1000;
      const scroll = scrollRef.current;
      const cx = w * 0.5 + Math.sin(t * 0.12) * w * 0.02;
      const cy = h * (0.38 + scroll * 0.08) + Math.cos(t * 0.1) * h * 0.015;

      ctx!.clearRect(0, 0, w, h);

      // Soft ambient wash — restrained, cool only
      const wash = ctx!.createRadialGradient(
        w * 0.2,
        h * 0.15,
        0,
        w * 0.2,
        h * 0.15,
        w * 0.7
      );
      wash.addColorStop(0, 'rgba(60, 110, 220, 0.08)');
      wash.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = wash;
      ctx!.fillRect(0, 0, w, h);

      // Breathing core — the living presence
      const breath = 0.5 + 0.5 * Math.sin(t * 0.9);
      const breath2 = 0.5 + 0.5 * Math.sin(t * 0.55 + 1.2);
      const coreR = Math.min(w, h) * (0.22 + breath * 0.04 + breath2 * 0.02);

      const core = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.2);
      core.addColorStop(0, `rgba(210, 230, 255, ${0.28 + breath * 0.1})`);
      core.addColorStop(0.18, `rgba(140, 190, 255, ${0.18 + breath * 0.06})`);
      core.addColorStop(0.42, `rgba(70, 130, 240, ${0.1 + breath2 * 0.04})`);
      core.addColorStop(0.7, 'rgba(40, 80, 180, 0.04)');
      core.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = core;
      ctx!.fillRect(0, 0, w, h);

      // Secondary morph lobe — makes the presence feel organic, not a perfect circle
      const lx = cx + Math.cos(t * 0.35) * coreR * 0.35;
      const ly = cy + Math.sin(t * 0.28) * coreR * 0.28;
      const lobe = ctx!.createRadialGradient(lx, ly, 0, lx, ly, coreR * 1.1);
      lobe.addColorStop(0, `rgba(120, 200, 255, ${0.12 + breath2 * 0.06})`);
      lobe.addColorStop(0.5, 'rgba(80, 150, 255, 0.05)');
      lobe.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = lobe;
      ctx!.fillRect(0, 0, w, h);

      // Expanding intelligence rings
      for (let i = 0; i < 3; i++) {
        const cycle = ((t * 0.18 + i * 0.33) % 1);
        const ringR = coreR * (0.55 + cycle * 1.8);
        const alpha = (1 - cycle) * 0.22;
        ctx!.beginPath();
        ctx!.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(160, 210, 255, ${alpha})`;
        ctx!.lineWidth = 1.2 - cycle * 0.6;
        ctx!.stroke();
      }

      // Soft inner ring that breathes with the core
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR * (0.42 + breath * 0.06), 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(200, 225, 255, ${0.15 + breath * 0.1})`;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // Orbiting energy points — like attention / tokens in motion
      const baseR = Math.min(w, h) * 0.42;
      for (const o of orbitersRef.current) {
        o.angle += o.speed * 0.008;
        const wobble = Math.sin(t * 0.7 + o.phase) * 0.04;
        const r = baseR * (o.radius + wobble);
        const x = cx + Math.cos(o.angle) * r;
        const y = cy + Math.sin(o.angle) * r * 0.72; // slight ellipse
        const pulse = 0.55 + 0.45 * Math.sin(t * 1.4 + o.phase);

        const pg = ctx!.createRadialGradient(x, y, 0, x, y, o.size * 4);
        pg.addColorStop(0, `rgba(220, 235, 255, ${0.55 * pulse})`);
        pg.addColorStop(0.4, `rgba(140, 190, 255, ${0.2 * pulse})`);
        pg.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = pg;
        ctx!.beginPath();
        ctx!.arc(x, y, o.size * 4, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(x, y, o.size * 0.6, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(230, 240, 255, ${0.7 * pulse})`;
        ctx!.fill();
      }

      // Very subtle vertical energy threads near the core
      for (let i = 0; i < 6; i++) {
        const a = t * 0.25 + i * 1.05;
        const tx = cx + Math.cos(a) * coreR * 0.9;
        const ty0 = cy - coreR * 0.8;
        const ty1 = cy + coreR * 0.8;
        const grad = ctx!.createLinearGradient(tx, ty0, tx, ty1);
        const ta = 0.04 + 0.04 * Math.sin(t + i);
        grad.addColorStop(0, 'rgba(140, 190, 255, 0)');
        grad.addColorStop(0.5, `rgba(160, 210, 255, ${ta})`);
        grad.addColorStop(1, 'rgba(140, 190, 255, 0)');
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(tx, ty0);
        ctx!.lineTo(tx, ty1);
        ctx!.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReduced, isPaused]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-paused={isPaused || prefersReduced}
      data-reduced={prefersReduced ? 'true' : 'false'}
      className="living-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <canvas ref={canvasRef} className="presence-canvas" />
      <div className="presence-vignette" />
      <div className="presence-noise" />
    </div>
  );
}
