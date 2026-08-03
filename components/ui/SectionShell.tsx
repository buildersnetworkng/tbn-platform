'use client';

import type { ReactNode } from 'react';
import { motion, useEntranceAnimation } from '@/experience';

interface SectionShellProps {
  children: ReactNode;
  className?: string;
}

export function SectionShell({ children, className = '' }: SectionShellProps) {
  const { ref, animate, initial, variants } = useEntranceAnimation<HTMLDivElement>();

  return (
    <motion.div ref={ref} initial={initial} animate={animate} variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
