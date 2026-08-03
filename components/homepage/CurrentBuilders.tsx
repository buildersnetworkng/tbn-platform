import { BuilderCapability } from '@/capabilities/BuilderCapability';
import { SectionShell } from '../ui/SectionShell';
import { BuilderCardGrid } from './BuilderCardGrid';

export async function CurrentBuilders() {
  const result = await BuilderCapability.getCurrentBuilders();

  if (!result.ok || result.data.length === 0) return null;

  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 tablet:px-8 desktop:px-12">
      <div className="mb-8 max-w-[560px] tablet:mb-10">
        <h2 className="font-serif text-[22px] leading-[1.25] text-text-primary tablet:text-[26px] desktop:text-[32px]">
          Current Builders
        </h2>
        <p className="mt-3 font-sans text-base leading-[1.5] text-text-secondary">
          Real people, actively building — not portfolios, proof.
        </p>
      </div>

      <BuilderCardGrid builders={result.data} />
    </SectionShell>
  );
}
