'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { useReducedMotion } from './reduced-motion/useReducedMotion';
import { COUNTER_DURATION_SECONDS } from './motion/tokens';

interface AnimatedNumberProps {
  value: number;
  formatter?: (n: number) => string;
}

export function AnimatedNumber({ value, formatter }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const render = (n: number) => (formatter ? formatter(Math.round(n)) : String(Math.round(n)));
    if (prefersReduced) {
      node.textContent = render(value);
      return;
    }
    const controls = animate(0, value, {
      duration: COUNTER_DURATION_SECONDS,
      ease: 'easeOut',
      onUpdate(latest) { node.textContent = render(latest); },
    });
    return () => controls.stop();
  }, [value, formatter, prefersReduced]);

  return <span ref={ref}>0</span>;
}
