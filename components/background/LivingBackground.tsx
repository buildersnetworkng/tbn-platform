'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '@/experience';

const STREAM_COUNT = 28;
const NODE_COUNT = 18;

type Stream = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  length: number;
  opacity: number;
};

type GraphNode = {
  id: number;
  x: number;
  y: number;
  r: number;
  pulse: number;
};

function createStreams(count: number): Stream[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: 4 + Math.random() * 92,
    delay: Math.random() * -12,
    duration: 4 + Math.random() * 7,
    length: 40 + Math.random() * 90,
    opacity: 0.25 + Math.random() * 0.55,
  }));
}

function createNodes(count: number): GraphNode[] {
  return Array.from({ length: count }, (_, id) => {
    const col = id % 6;
    const row = Math.floor(id / 6);
    return {
      id,
      x: 8 + col * 16 + (row % 2) * 6 + (Math.random() - 0.5) * 4,
      y: 12 + row * 28 + (Math.random() - 0.5) * 8,
      r: 2 + (id % 3),
      pulse: 2.5 + (id % 5) * 0.7,
    };
  });
}

function buildEdges(nodes: GraphNode[]): Array<[GraphNode, GraphNode]> {
  const edges: Array<[GraphNode, GraphNode]> = [];
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    if (!a) continue;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (!b) continue;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 28) edges.push([a, b]);
    }
  }
  return edges;
}

export function LivingBackground() {
  const prefersReduced = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const streams = useMemo(() => createStreams(STREAM_COUNT), []);
  const nodes = useMemo(() => createNodes(NODE_COUNT), []);
  const edges = useMemo(() => buildEdges(nodes), [nodes]);

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
        el.style.setProperty('--parallax-slow', `${y * 0.1}px`);
        el.style.setProperty('--parallax-mid', `${y * 0.18}px`);
        el.style.setProperty('--parallax-fast', `${y * 0.28}px`);
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        el.style.setProperty('--scroll-progress', String(Math.min(y / max, 1)));
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
      <div className="tech-ambient" />

      <div className="living-parallax living-parallax-slow">
        <div className="tech-grid" />
      </div>

      {!prefersReduced && <div className="tech-scan" />}

      <div className="living-parallax living-parallax-mid">
        <svg className="tech-graph" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map(([a, b], i) => (
            <line
              key={`e-${i}`}
              className="tech-edge"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={{ animationDelay: `${(i % 8) * 0.35}s` }}
            />
          ))}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle
                className="tech-node-ring"
                cx={n.x}
                cy={n.y}
                r={n.r + 1.2}
                style={{ animationDuration: `${n.pulse}s`, animationDelay: `${n.id * 0.15}s` }}
              />
              <circle className="tech-node" cx={n.x} cy={n.y} r={n.r * 0.35} />
            </g>
          ))}
        </svg>
      </div>

      {!prefersReduced && (
        <div className="living-parallax living-parallax-fast">
          <div className="tech-streams">
            {streams.map((s) => (
              <span
                key={s.id}
                className="tech-stream"
                style={
                  {
                    left: `${s.x}%`,
                    height: s.length,
                    opacity: s.opacity,
                    animationDuration: `${s.duration}s`,
                    animationDelay: `${s.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className="tech-circuit tech-circuit-tl" />
      <div className="tech-circuit tech-circuit-br" />

      <div className="tech-vignette" />
    </div>
  );
}
