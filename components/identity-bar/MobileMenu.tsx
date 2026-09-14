'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, motionTokens } from '@/experience';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Builders', href: '/builders' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'About', href: '/about' },
] as const;

const CTA_CLASS =
  'inline-flex h-11 w-full max-w-[280px] items-center justify-center rounded-md px-5 text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // Close automatically whenever the route changes (covers all link taps)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (isOpen) onClose();
    }
  }, [pathname, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[60] flex flex-col bg-background-primary/95 backdrop-blur-2xl"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: motionTokens.DURATION.moderate,
              ease: motionTokens.EASE_STANDARD,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: motionTokens.DURATION.base,
              ease: motionTokens.EASE_STANDARD,
            },
          }}
          onClick={onClose}
        >
          <motion.div
            className="flex h-full flex-col items-center justify-center gap-8 px-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: motionTokens.DURATION.moderate,
                ease: motionTokens.EASE_STANDARD,
                delay: 0.05,
              },
            }}
            exit={{
              opacity: 0,
              y: 14,
              transition: {
                duration: motionTokens.DURATION.base,
                ease: motionTokens.EASE_STANDARD,
              },
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <nav aria-label="Primary" className="flex flex-col items-center gap-6">
              {NAV_ITEMS.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    ref={index === 0 ? firstLinkRef : undefined}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`text-2xl font-serif transition-opacity duration-150 hover:opacity-80 ${
                      isActive ? 'text-accent' : 'text-text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col items-center gap-3 pt-4">
              <Link
                href="/builders"
                onClick={onClose}
                className={`${CTA_CLASS} border border-border bg-transparent text-text-primary hover:border-border-hover hover:bg-white/[0.06]`}
              >
                Explore Builders
              </Link>
              <Link
                href="/apply"
                onClick={onClose}
                className={`${CTA_CLASS} bg-accent text-background-primary hover:bg-accent-hover`}
              >
                Apply
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
