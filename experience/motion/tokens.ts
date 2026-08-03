export const DURATION = {
  instant: 0.1,
  fast: 0.175,
  base: 0.275,
  moderate: 0.35,
  slow: 0.55,
} as const;

export const EASE_STANDARD = [0.16, 1, 0.3, 1] as const;
export const EASE_SIMPLE = [0.4, 0, 0.2, 1] as const;

export const STAGGER = {
  perItemSeconds: 0.06,
  maxTotalSeconds: 0.32,
} as const;

export const COUNTER_DURATION_SECONDS = 1.5;

export type MotionDuration = keyof typeof DURATION;
