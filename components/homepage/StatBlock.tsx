'use client';

import { AnimatedNumber } from '@/experience';
import type { PlatformStatistic } from '@/capabilities/StatisticsCapability';

export function StatBlock({ stat }: { stat: PlatformStatistic }) {
  return (
    <div className="text-center tablet:text-left">
      <p className="font-serif text-[48px] leading-none text-text-primary tablet:text-[64px]">
        <AnimatedNumber value={stat.value} formatter={(n) => n.toLocaleString()} />
      </p>
      <p className="mt-2 font-sans text-sm text-text-muted">{stat.label}</p>
    </div>
  );
}
