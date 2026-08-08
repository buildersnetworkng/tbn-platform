import { BuilderCard } from '@/components/builders/BuilderCard';
import { Marquee } from '@/components/ui/Marquee';
import type { Builder } from '@/types/domain';

export function BuilderCardGrid({ builders }: { builders: Builder[] }) {
  return (
    <Marquee durationSeconds={Math.max(28, builders.length * 6)}>
      {builders.map((builder) => (
        <div key={builder.id} className="w-[280px] flex-shrink-0 tablet:w-[320px]">
          <BuilderCard builder={builder} />
        </div>
      ))}
    </Marquee>
  );
}
