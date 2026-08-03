import { STAGGER } from '../motion/tokens';

export function getStaggerDelay(index: number, itemCount: number): number {
  const uncappedDelay = index * STAGGER.perItemSeconds;
  if (itemCount <= 1) return 0;
  const uncappedTotal = (itemCount - 1) * STAGGER.perItemSeconds;
  if (uncappedTotal <= STAGGER.maxTotalSeconds) return uncappedDelay;
  const scale = STAGGER.maxTotalSeconds / uncappedTotal;
  return uncappedDelay * scale;
}
