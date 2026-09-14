'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/experience';

/**
 * Apply-page background.
 * Same family as the original apply/index.html field:
 * slow moving gradient mesh + soft drifting light pools.
 * More advanced motion — not the homepage AI-presence core.
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

    const blobs = Array.from({ length: 5 }, (_, i) => ({
      // Normalized positions — soft ambient pools, not a center "eye"
      x: 0.15 + (i % 3) * 0.35 + (i * 0.07) % 0.2,
      y: 0.2 + Math.floor(i / 2) * 0.35 + (i * 0.11) % 0.15,
      rx: 0.28 + (i % 3) * 0.08,
      ry: 0.22 + (i % 2) * 0.1,
      phase: i * 1.7,
      speed: 0.08 + i * 0.02,
      alpha: 0.1 + (i % 3) * 0.03,
    }));

    const motes = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00014,
      size: 0.6 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
    }));

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
      ctx!.clearRect(0, 0, w, h);

      // Base — slow shifting cool gradient (original apply DNA)
      const gx = 0.5 + Math.sin(t * 0.07) * 0.12;
      const gy = 0.45 + Math.cos(t * 0.05) * 0.1;
      const base = ctx!.createRadialGradient(
        w * gx,
        h * gy,
        0,
        w * gx,
        h * gy,
        Math.max(w, h) * 0.85
      );
      base.addColorStop(0, 'rgba(20, 28, 48, 0.55)');
      base.addColorStop(0.45, 'rgba(10, 12, 20, 0.35)');
      base.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx!.fillStyle = base;
      ctx!.fillRect(0, 0, w, h);

      // Soft drifting light pools (advanced blob field)
      for (const b of blobs) {
        const driftX = Math.sin(t * b.speed + b.phase) * 0.06;
        const driftY = Math.cos(t * b.speed * 0.85 + b.phase * 1.3) * 0.05;
        const scale = 1 + Math.sin(t * b.speed * 0.6 + b.phase) * 0.08;

        const bx = w * (b.x + driftX);
        const by = h * (b.y + driftY);
        const br = Math.max(w, h) * b.rx * scale;

        const g = ctx!.createRadialGradient(bx, by, 0, bx, by, br);
        const a = b.alpha * (0.75 + 0.25 * Math.sin(t * 0.4 + b.phase));
        g.addColorStop(0, `rgba(198, 217, 255, ${a})`);
        g.addColorStop(0.35, `rgba(140, 175, 230, ${a * 0.35})`);
        g.addColorStop(0.7, `rgba(80, 120, 200, ${a * 0.08})`);
        g.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, w, h);
      }

      // Corner accent pools — keeps depth without a single “core”
      const corners = [
        { x: 0.08, y: 0.12, a: 0.07 },
        { x: 0.92, y: 0.18, a: 0.05 },
        { x: 0.2, y: 0.88, a: 0.06 },
      ];
      for (let i = 0; i < corners.length; i++) {
        const c = corners[i]!;
        const cx = w * (c.x + Math.sin(t * 0.06 + i) * 0.02);
        const cy = h * (c.y + Math.cos(t * 0.05 + i * 1.4) * 0.02);
        const cr = Math.max(w, h) * 0.35;
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, cr);
        g.addColorStop(0, `rgba(100, 150, 230, ${c.a})`);
        g.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, w, h);
      }

      // Fine ambient motes — float, do not orbit a center
      for (const m of motes) {
        m.x += m.vx + Math.sin(t * 0.15 + m.phase) * 0.00005;
        m.y += m.vy + Math.cos(t * 0.12 + m.phase) * 0.00005;
        if (m.x < -0.02) m.x = 1.02;
        if (m.x > 1.02) m.x = -0.02;
        if (m.y < -0.02) m.y = 1.02;
        if (m.y > 1.02) m.y = -0.02;

        const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.7 + m.phase));
        ctx!.beginPath();
        ctx!.arc(m.x * w, m.y * h, m.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(198, 217, 255, ${0.14 * pulse})`;
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
      {/* CSS gradient mesh — original apply DNA, always on */}
      <div className="apply-gradient-mesh" />
      {!prefersReduced && <canvas ref={canvasRef} className="apply-canvas" />}
      <div className="apply-noise" />
    </div>
  );
}
