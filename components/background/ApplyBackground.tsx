'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/experience';

/**
 * Apply-page background — original apply DNA with a clear breathing vibe.
 * Whole field inhales/exhales together (~6.5s cycle): pools swell, light
 * brightens, motes pulse. Not the homepage AI-presence core.
 */
export function ApplyBackground() {
  const prefersReduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const start = performance.now();
    let paused = document.hidden;

    const blobs = Array.from({ length: 7 }, (_, i) => ({
      x: 0.12 + (i % 4) * 0.28 + ((i * 0.13) % 0.18),
      y: 0.15 + Math.floor(i / 3) * 0.32 + ((i * 0.09) % 0.2),
      rx: 0.22 + (i % 4) * 0.07,
      ry: 0.18 + (i % 3) * 0.08,
      phase: i * 1.4,
      speed: 0.06 + (i % 5) * 0.018,
      alpha: 0.11 + (i % 3) * 0.03,
      hueShift: (i % 3) * 12,
    }));

    const motes = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00016,
      size: 0.5 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() > 0.6,
    }));

    const sweeps = [
      { y: 0.22, speed: 0.035, width: 0.35, alpha: 0.055 },
      { y: 0.55, speed: 0.028, width: 0.42, alpha: 0.045 },
      { y: 0.78, speed: 0.042, width: 0.28, alpha: 0.05 },
    ];

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

    function onVisibility() {
      paused = document.hidden;
    }

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (paused) return;

      const t = (now - start) / 1000;

      // Shared breath — calm ~6.5s full cycle (inhale + exhale)
      // Primary sine + soft secondary so it never feels mechanical
      const breath = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 6.5);
      const breath2 = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 9.2 + 1.2);
      // Intensity of the whole field (darker on exhale, luminous on inhale)
      const field = 0.52 + breath * 0.48 + breath2 * 0.08;
      // Physical swell of pools and motes
      const expand = 1 + breath * 0.22 + breath2 * 0.08;

      ctx!.clearRect(0, 0, w, h);

      // Base field — grows and brightens with the breath
      const gx = 0.5 + Math.sin(t * 0.06) * 0.14;
      const gy = 0.42 + Math.cos(t * 0.045) * 0.12;
      const baseR = Math.max(w, h) * (0.72 + breath * 0.2);
      const base = ctx!.createRadialGradient(w * gx, h * gy, 0, w * gx, h * gy, baseR);
      base.addColorStop(0, `rgba(32, 44, 72, ${0.55 * field})`);
      base.addColorStop(0.4, `rgba(14, 16, 28, ${0.35 * field})`);
      base.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = base;
      ctx!.fillRect(0, 0, w, h);

      // Soft light pools — swell + brighten together
      for (const b of blobs) {
        const driftX = Math.sin(t * b.speed + b.phase) * 0.07;
        const driftY = Math.cos(t * b.speed * 0.82 + b.phase * 1.25) * 0.055;
        // Slight phase offset so pools aren't perfectly locked, still feel shared
        const localBreath = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 6.5 + b.phase * 0.35);
        const breathScale = expand * (0.9 + localBreath * 0.18);
        const squash = 1 + Math.sin(t * b.speed * 0.4 + b.phase * 0.7) * 0.08;

        const bx = w * (b.x + driftX);
        const by = h * (b.y + driftY);
        const brx = Math.max(w, h) * b.rx * breathScale;
        const bry = Math.max(w, h) * b.ry * squash * breathScale;

        ctx!.save();
        ctx!.translate(bx, by);
        ctx!.scale(1, bry / Math.max(brx, 1));
        const g = ctx!.createRadialGradient(0, 0, 0, 0, 0, brx);
        const a = b.alpha * (0.42 + localBreath * 0.65) * field;
        const r = 170 + b.hueShift;
        const green = 200 + Math.floor(b.hueShift * 0.4);
        g.addColorStop(0, `rgba(${r}, ${green}, 255, ${a})`);
        g.addColorStop(0.28, `rgba(${Math.floor(r * 0.75)}, ${Math.floor(green * 0.85)}, 235, ${a * 0.48})`);
        g.addColorStop(0.6, `rgba(70, 110, 200, ${a * 0.14})`);
        g.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = g;
        ctx!.fillRect(-brx, -brx, brx * 2, brx * 2);
        ctx!.restore();
      }

      // Light sweeps — wider and brighter on inhale
      for (let i = 0; i < sweeps.length; i++) {
        const s = sweeps[i]!;
        const progress = (t * s.speed + i * 0.33) % 1;
        const sx = w * (progress * 1.4 - 0.2);
        const sy = h * (s.y + Math.sin(t * 0.08 + i) * 0.03);
        const sw = w * s.width * (0.85 + breath * 0.22);

        const sg = ctx!.createLinearGradient(sx - sw * 0.5, sy, sx + sw * 0.5, sy);
        const sa = s.alpha * (0.4 + 0.6 * Math.sin(progress * Math.PI)) * field;
        sg.addColorStop(0, 'rgba(180, 210, 255, 0)');
        sg.addColorStop(0.5, `rgba(198, 217, 255, ${sa})`);
        sg.addColorStop(1, 'rgba(180, 210, 255, 0)');
        ctx!.fillStyle = sg;
        ctx!.fillRect(sx - sw * 0.5, sy - h * 0.1, sw, h * 0.2);
      }

      // Corner depth — swell with breath
      const corners = [
        { x: 0.06, y: 0.1, a: 0.1 },
        { x: 0.94, y: 0.16, a: 0.07 },
        { x: 0.18, y: 0.9, a: 0.08 },
        { x: 0.88, y: 0.85, a: 0.05 },
      ];
      for (let i = 0; i < corners.length; i++) {
        const c = corners[i]!;
        const cx = w * (c.x + Math.sin(t * 0.05 + i * 1.1) * 0.025);
        const cy = h * (c.y + Math.cos(t * 0.045 + i * 1.3) * 0.02);
        const cr = Math.max(w, h) * (0.26 + breath * 0.1);
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, cr);
        g.addColorStop(0, `rgba(90, 140, 220, ${c.a * field})`);
        g.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, w, h);
      }

      // Motes — size and brightness follow shared breath
      for (const m of motes) {
        m.x += m.vx + Math.sin(t * 0.14 + m.phase) * 0.00006;
        m.y += m.vy + Math.cos(t * 0.11 + m.phase) * 0.00005;
        if (m.x < -0.03) m.x = 1.03;
        if (m.x > 1.03) m.x = -0.03;
        if (m.y < -0.03) m.y = 1.03;
        if (m.y > 1.03) m.y = -0.03;

        const localPulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.65 + m.phase));
        const pulse = localPulse * (0.45 + breath * 0.55);
        const mx = m.x * w;
        const my = m.y * h;
        const size = m.size * (0.8 + breath * 0.35);

        if (m.glow) {
          const glowR = size * 5.5;
          const pg = ctx!.createRadialGradient(mx, my, 0, mx, my, glowR);
          pg.addColorStop(0, `rgba(210, 225, 255, ${0.2 * pulse})`);
          pg.addColorStop(1, 'rgba(5, 6, 8, 0)');
          ctx!.fillStyle = pg;
          ctx!.beginPath();
          ctx!.arc(mx, my, glowR, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(mx, my, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(198, 217, 255, ${0.22 * pulse})`;
        ctx!.fill();
      }
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [prefersReduced]);

  return (
    <div
      aria-hidden="true"
      className="apply-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="apply-gradient-mesh" />
      {!prefersReduced && <canvas ref={canvasRef} className="apply-canvas" />}
      <div className="apply-noise" />
    </div>
  );
}
