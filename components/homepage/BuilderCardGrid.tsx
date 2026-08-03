'use client';

import { BuilderCard } from '@/components/builders/BuilderCard';
import type { Builder } from '@/types/domain';
import { motion, useEntranceAnimation } from '@/experience';

function AnimatedBuilderCard({ builder, index, total }: { builder: Builder; index: number; total: number }) {
  const { ref, animate, initial, variants } = useEntranceAnimation<HTMLDivElement>(index, total);
  return (
    <motion.div ref={ref} initial={initial} animate={animate} variants={variants}>
      <BuilderCard builder={builder} />
    </motion.div>
  );
}

export function BuilderCardGrid({ builders }: { builders: Builder[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3" style={{ rowGap: '32px' }}>
      {builders.map((builder, index) => (
        <AnimatedBuilderCard key={builder.id} builder={builder} index={index} total={builders.length} />
      ))}
    </div>
  );
}
