'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/experience';

type Orbiter = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
  trail: Array<{ x: number; y: number }>;
};

type Drift = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
};

function createOrbiters(count: number): Orbiter[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.2,
    radius: 0.16 + (i % 6) * 0.055 + Math.random() * 0.03,
    speed: 0.12 + (i % 5) * 0.06 + Math.random() * 0.04,
    size: 1.1 + (i % 4) * 0.55,
    phase: Math.random() * Math.PI * 2,
    trail: [],
  }));
}

function createDrift(count: number): Drift[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00025,
    vy: (Math.random() - 0.5) * 0.00025,
    size: 0.6 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function LivingBackground() {
  const prefersReduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const orbitersRef = useRef<Orbiter[]>(createOrbiters(20));
  const driftRef = useRef<Drift[]>(createDrift(36));
  const pausedRef = useRef(false);

  useEffect(() => {
    function handleVisibilityChange() {
      const hidden = document.hidden;
      setIsPaused(hidden);
      pausedRef.current = hidden;
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

    const ctx = canvas.getContext('2d', { alpha: true });
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
      const cy = h * 0.4;
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      g.addColorStop(0, 'rgba(180, 210, 255, 0.28)');
      g.addColorStop(0.3, 'rgba(90, 150, 255, 0.12)');
      g.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);
    }

    if (prefersReduced) {
      drawStaticPresence();
      return () => window.removeEventListener('resize', resize);
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (pausedRef.current) return;

      const t = (now - start) / 1000;
      const scroll = scrollRef.current;

      // Presence center — slow organic drift + gentle scroll response
      const cx =
        w * 0.5 +
        Math.sin(t * 0.11) * w * 0.025 +
        Math.sin(t * 0.07 + 1) * w * 0.012;
      const cy =
        h * (0.36 + scroll * 0.1) +
        Math.cos(t * 0.09) * h * 0.02 +
        Math.sin(t * 0.13 + 0.5) * h * 0.01;

      ctx!.clearRect(0, 0, w, h);

      // ── Far ambient pools (depth, not beauty blobs) ──────────
      const pools = [
        { x: 0.12, y: 0.18, r: 0.55, a: 0.07, hue: 210 },
        { x: 0.88, y: 0.22, r: 0.5, a: 0.055, hue: 200 },
        { x: 0.5, y: 0.85, r: 0.6, a: 0.05, hue: 220 },
      ];
      for (const p of pools) {
        const px = w * (p.x + Math.sin(t * 0.08 + p.hue) * 0.02);
        const py = h * (p.y + Math.cos(t * 0.07 + p.hue) * 0.02);
        const pr = Math.max(w, h) * p.r;
        const g = ctx!.createRadialGradient(px, py, 0, px, py, pr);
        g.addColorStop(0, `rgba(70, 130, 230, ${p.a})`);
        g.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, w, h);
      }

      // ── Breath signals ───────────────────────────────────────
      const breath = 0.5 + 0.5 * Math.sin(t * 0.85);
      const breath2 = 0.5 + 0.5 * Math.sin(t * 0.48 + 1.4);
      const breath3 = 0.5 + 0.5 * Math.sin(t * 0.31 + 2.1);
      const minDim = Math.min(w, h);
      const coreR = minDim * (0.2 + breath * 0.035 + breath2 * 0.02);

      // ── Multi-lobe organic volume (the living body) ──────────
      // Main body
      const main = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.4);
      main.addColorStop(0, `rgba(230, 240, 255, ${0.34 + breath * 0.12})`);
      main.addColorStop(0.12, `rgba(170, 210, 255, ${0.22 + breath * 0.08})`);
      main.addColorStop(0.32, `rgba(100, 160, 250, ${0.12 + breath2 * 0.05})`);
      main.addColorStop(0.55, `rgba(50, 100, 210, ${0.05 + breath3 * 0.03})`);
      main.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = main;
      ctx!.fillRect(0, 0, w, h);

      // Morph lobes — asymmetric so it never reads as a fixed circle
      const lobes = [
        { ang: t * 0.32, dist: 0.38, scale: 1.15, a: 0.14 },
        { ang: t * 0.27 + 2.1, dist: 0.32, scale: 0.95, a: 0.11 },
        { ang: t * 0.21 + 4.0, dist: 0.42, scale: 1.05, a: 0.09 },
      ];
      for (const lobe of lobes) {
        const lx = cx + Math.cos(lobe.ang) * coreR * lobe.dist;
        const ly = cy + Math.sin(lobe.ang) * coreR * lobe.dist * 0.85;
        const lr = coreR * lobe.scale;
        const g = ctx!.createRadialGradient(lx, ly, 0, lx, ly, lr);
        const la = lobe.a * (0.7 + breath2 * 0.5);
        g.addColorStop(0, `rgba(140, 200, 255, ${la})`);
        g.addColorStop(0.45, `rgba(80, 150, 255, ${la * 0.35})`);
        g.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, w, h);
      }

      // Dense hot center — the “eye” of the presence
      const hot = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR * 0.35);
      hot.addColorStop(0, `rgba(245, 250, 255, ${0.45 + breath * 0.2})`);
      hot.addColorStop(0.4, `rgba(180, 215, 255, ${0.2 + breath * 0.08})`);
      hot.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = hot;
      ctx!.fillRect(0, 0, w, h);

      // ── Intelligence rings ───────────────────────────────────
      for (let i = 0; i < 4; i++) {
        const cycle = (t * 0.14 + i * 0.25) % 1;
        const ringR = coreR * (0.5 + cycle * 2.1);
        const alpha = (1 - cycle) * (1 - cycle) * 0.28;
        ctx!.beginPath();
        ctx!.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(170, 215, 255, ${alpha})`;
        ctx!.lineWidth = 1.4 * (1 - cycle * 0.7);
        ctx!.stroke();
      }

      // Breathing halo ring (tight, always near core)
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR * (0.48 + breath * 0.08), 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(210, 230, 255, ${0.18 + breath * 0.14})`;
      ctx!.lineWidth = 1.6;
      ctx!.stroke();

      // Soft outer glow ring
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR * (1.05 + breath2 * 0.06), 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(120, 180, 255, ${0.08 + breath2 * 0.06})`;
      ctx!.lineWidth = 2.2;
      ctx!.stroke();

      // ── Orbiting attention points + short trails ─────────────
      const baseR = minDim * 0.44;
      for (const o of orbitersRef.current) {
        o.angle += o.speed * 0.0075;
        const wobble = Math.sin(t * 0.65 + o.phase) * 0.045;
        const r = baseR * (o.radius + wobble);
        const x = cx + Math.cos(o.angle) * r;
        const y = cy + Math.sin(o.angle) * r * 0.7;

        o.trail.push({ x, y });
        if (o.trail.length > 10) o.trail.shift();

        // Trail
        if (o.trail.length > 1) {
          ctx!.beginPath();
          for (let i = 0; i < o.trail.length; i++) {
            const p = o.trail[i]!;
            if (i === 0) ctx!.moveTo(p.x, p.y);
            else ctx!.lineTo(p.x, p.y);
          }
          ctx!.strokeStyle = `rgba(160, 200, 255, 0.12)`;
          ctx!.lineWidth = 1;
          ctx!.lineCap = 'round';
          ctx!.stroke();
        }

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.3 + o.phase);
        const glowR = o.size * 5;
        const pg = ctx!.createRadialGradient(x, y, 0, x, y, glowR);
        pg.addColorStop(0, `rgba(230, 240, 255, ${0.65 * pulse})`);
        pg.addColorStop(0.35, `rgba(150, 200, 255, ${0.22 * pulse})`);
        pg.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = pg;
        ctx!.beginPath();
        ctx!.arc(x, y, glowR, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(x, y, o.size * 0.55, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(240, 248, 255, ${0.75 * pulse})`;
        ctx!.fill();
      }

      // ── Ambient field dust ───────────────────────────────────
      for (const d of driftRef.current) {
        d.x += d.vx + Math.sin(t * 0.2 + d.phase) * 0.00008;
        d.y += d.vy + Math.cos(t * 0.18 + d.phase) * 0.00008;
        if (d.x < -0.05) d.x = 1.05;
        if (d.x > 1.05) d.x = -0.05;
        if (d.y < -0.05) d.y = 1.05;
        if (d.y > 1.05) d.y = -0.05;

        const dx = d.x * w;
        const dy = d.y * h;
        const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9 + d.phase));
        const a = 0.18 * pulse;

        // Fade near edges of presence so dust doesn’t compete with core
        const dist = Math.hypot(dx - cx, dy - cy) / (minDim * 0.5);
        const edgeFade = Math.min(1, Math.max(0.2, dist));

        ctx!.beginPath();
        ctx!.arc(dx, dy, d.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180, 210, 255, ${a * edgeFade})`;
        ctx!.fill();
      }
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReduced]);

  return (
    <div
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
