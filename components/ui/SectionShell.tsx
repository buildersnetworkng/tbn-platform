import type { ReactNode } from 'react';

interface SectionShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Static section wrapper. No entrance animation, no opacity gating.
 * Content is always fully visible the moment it is in the DOM.
 */
export function SectionShell({ children, className = '' }: SectionShellProps) {
  return <section className={`relative z-10 ${className}`.trim()}>{children}</section>;
}
