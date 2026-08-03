import { StatisticsCapability } from '@/capabilities/StatisticsCapability';
import { SectionShell } from '../ui/SectionShell';
import { StatBlock } from './StatBlock';
import { GrowthVisual } from './GrowthVisual';

export async function LivingEcosystem() {
  const result = await StatisticsCapability.getLivingEcosystemStatistics();
  const stats = result.ok ? result.data : [];

  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 tablet:px-8 desktop:px-12">
      <div className="max-w-[560px] text-center tablet:text-left">
        <h2 className="font-serif text-[22px] leading-[1.25] text-text-primary tablet:text-[26px] desktop:text-[32px]">
          A growing ecosystem, not a static directory.
        </h2>
        <p className="mt-3 font-sans text-base leading-[1.5] text-text-secondary">
          Every number below reflects the platform as it actually is right now — nothing here is projected or simulated.
        </p>
      </div>
      {stats.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-8 tablet:grid-cols-4 tablet:gap-6">
          {stats.map((stat) => (
            <StatBlock key={stat.key} stat={stat} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-border bg-surface px-6 py-14 text-center">
          <GrowthVisual />
          <p className="mt-6 font-serif text-lg text-text-primary tablet:text-xl">
            We report growth as it happens — not before it&apos;s real.
          </p>
          <p className="mx-auto mt-2 max-w-[420px] font-sans text-sm text-text-muted">
            These numbers go live the moment there&apos;s real activity behind them.
          </p>
        </div>
      )}
    </SectionShell>
  );
}
