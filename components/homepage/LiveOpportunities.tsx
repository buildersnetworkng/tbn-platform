import { OpportunityCapability } from '@/capabilities/OpportunityCapability';
import { SectionShell } from '../ui/SectionShell';
import { OpportunityRow } from './OpportunityRow';

export async function LiveOpportunities() {
  const result = await OpportunityCapability.getLiveOpportunities();
  const opportunities = result.ok ? result.data : [];

  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 tablet:px-8 desktop:px-12">
      <div className="mb-8 max-w-[560px] tablet:mb-10">
        <h2 className="font-serif text-[22px] leading-[1.25] text-text-primary tablet:text-[26px] desktop:text-[32px]">
          Live Opportunities
        </h2>
        <p className="mt-3 font-sans text-base leading-[1.5] text-text-secondary">
          Organizations come here to find builders through what they&apos;ve actually shipped.
        </p>
      </div>
      {opportunities.length > 0 ? (
        <div className="mx-auto max-w-[720px]">
          {opportunities.map((opportunity) => (
            <OpportunityRow key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-[720px] rounded-lg border border-border bg-surface px-6 py-10 text-center">
          <p className="font-sans text-sm text-text-muted">
            New opportunities are reviewed continuously — check back soon.
          </p>
        </div>
      )}
    </SectionShell>
  );
}
