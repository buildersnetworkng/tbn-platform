'use client';

import type { ReactNode } from 'react';
import { motion, motionTokens, useReducedMotion } from '@/experience';

interface SectionShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Homepage section wrapper.
 * Content is always visible (opacity never starts at 0).
 * Optional subtle rise on enter — does not gate visibility on IntersectionObserver.
 */
export function SectionShell({ children, className = '' }: SectionShellProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 1, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01, margin: '120px 0px' }}
      transition={{
        duration: motionTokens.DURATION.slow,
        ease: motionTokens.EASE_STANDARD,
      }}
    >
      {children}
    </motion.section>
  );
}
