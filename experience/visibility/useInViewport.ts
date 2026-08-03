'use client';

import { useEffect, useRef, useState } from 'react';

export function useInViewport<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasEntered) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasEntered, threshold]);

  return { ref, hasEntered };
}
