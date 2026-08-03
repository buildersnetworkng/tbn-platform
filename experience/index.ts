'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useReducedMotion } from './reduced-motion/useReducedMotion';
import { useInViewport } from './visibility/useInViewport';
import { getStaggerDelay } from './timing/stagger';
import { DURATION, EASE_STANDARD, EASE_SIMPLE } from './motion/tokens';

export const motionTokens = { DURATION, EASE_STANDARD, EASE_SIMPLE };

export function useEntranceAnimation<T extends HTMLElement>(index = 0, itemCount = 1) {
  const { ref, hasEntered } = useInViewport<T>(0.2);
  const prefersReduced = useReducedMotion();
  const delay = getStaggerDelay(index, itemCount);

  const variants: Variants = prefersReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_SIMPLE, delay } } }
    : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_STANDARD, delay } } };

  return { ref, animate: hasEntered ? 'visible' : 'hidden', initial: 'hidden', variants };
}

export function useHoverElevate() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return {};
  return { whileHover: { y: -2, transition: { duration: DURATION.fast, ease: EASE_STANDARD } } };
}

export { motion, AnimatePresence };
export { useReducedMotion };
export { Background } from './background/Background';
export type { BackgroundMode } from './background/Background';
export { AnimatedNumber } from './AnimatedNumber';
