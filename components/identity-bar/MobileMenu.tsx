'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { motion, AnimatePresence, motionTokens } from '@/experience';

const NAV_ITEMS = [
  { label: 'Builders', href: '/builders' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'About', href: '/about' },
] as const;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-0 z-[60] bg-background-primary/90 backdrop-blur-2xl" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: motionTokens.DURATION.moderate, ease: motionTokens.EASE_STANDARD } }} exit={{ opacity: 0, transition: { duration: motionTokens.DURATION.base, ease: motionTokens.EASE_STANDARD } }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
          <motion.div className="flex h-full flex-col items-center justify-center gap-8 px-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: motionTokens.DURATION.moderate, ease: motionTokens.EASE_STANDARD, delay: 0.05 } }} exit={{ opacity: 0, y: 14, transition: { duration: motionTokens.DURATION.base, ease: motionTokens.EASE_STANDARD } }}>
            <nav aria-label="Primary" className="flex flex-col items-center gap-6">
              {NAV_ITEMS.map((item, index) => (
                <Link key={item.href} href={item.href} ref={index === 0 ? firstLinkRef : undefined} onClick={onClose} className="text-2xl font-serif text-text-primary transition-opacity duration-150 hover:opacity-80">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col items-center gap-3 pt-4">
              <Button variant="secondary" href="/builders" className="w-full max-w-[280px]">Explore Builders</Button>
              <Button variant="primary" href="/apply" className="w-full max-w-[280px]">Apply</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
