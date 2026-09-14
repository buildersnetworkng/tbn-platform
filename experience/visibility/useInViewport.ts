'use client';

import { useEffect, useRef, useState } from 'react';

function isElementInView(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
}

export function useInViewport<T extends HTMLElement>(threshold = 0.05) {
  const ref = useRef<T | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasEntered) return;

    // Sections already on screen should show immediately (no stuck opacity:0)
    if (isElementInView(node)) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '80px 0px 80px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasEntered, threshold]);

  return { ref, hasEntered };
}
