'use client';

import { useEffect, useState } from 'react';

export type IdentityBarScrollState = 'top' | 'scrolled';

export function useScrollState(threshold = 100): IdentityBarScrollState {
  const [state, setState] = useState<IdentityBarScrollState>('top');

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setState((prev) => {
        if (y <= 0) return 'top';
        if (y > threshold) return 'scrolled';
        return prev;
      });
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return state;
}
