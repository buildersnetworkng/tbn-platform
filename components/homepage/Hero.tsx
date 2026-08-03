'use client';

import { Button } from '../ui/Button';
import { motion, motionTokens, useReducedMotion } from '@/experience';

export function Hero() {
  const prefersReduced = useReducedMotion();

  const revealAt = (delaySeconds: number) =>
    prefersReduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: motionTokens.DURATION.base, ease: motionTokens.EASE_SIMPLE, delay: delaySeconds } },
        }
      : {
          initial: { opacity: 0, y: 16 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { duration: motionTokens.DURATION.slow, ease: motionTokens.EASE_STANDARD, delay: delaySeconds },
          },
        };

  return (
    <section className="relative flex min-h-[640px] h-screen flex-col items-center justify-center px-5 text-center tablet:px-8 desktop:px-12">
      <div className="flex max-w-[760px] flex-col items-center">
        <motion.h1
          {...revealAt(0)}
          className="font-serif text-[40px] leading-[1.1] text-text-primary tablet:text-[56px] desktop:text-[88px]"
        >
          Where builders become visible.
        </motion.h1>

        <motion.p
          {...revealAt(0.15)}
          className="mt-6 max-w-[560px] font-sans text-base leading-[1.5] text-text-secondary tablet:text-lg desktop:text-xl"
        >
          Students, engineers, self-taught builders — ship real work and get discovered.
        </motion.p>

        <motion.div
          {...revealAt(0.3)}
          className="mt-10 flex w-full max-w-[320px] flex-col items-center gap-3 tablet:max-w-none tablet:w-auto tablet:flex-row tablet:gap-4"
        >
          <Button variant="primary" href="/apply" className="w-full tablet:w-auto">
            Apply
          </Button>
          <Button variant="secondary" href="/builders" className="w-full tablet:w-auto">
            Explore Builders
          </Button>
        </motion.div>

        <motion.div
          {...revealAt(0.45)}
          aria-hidden="true"
          className="mt-12 flex items-center gap-1.5"
        >
          <span className="hero-pulse-dot" style={{ animationDelay: '0ms' }} />
          <span className="hero-pulse-dot" style={{ animationDelay: '200ms' }} />
          <span className="hero-pulse-dot" style={{ animationDelay: '400ms' }} />
        </motion.div>
      </div>
    </section>
  );
}
