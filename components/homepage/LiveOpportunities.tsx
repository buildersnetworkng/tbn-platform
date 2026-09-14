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
          Organizations come here to find builders through what they've actually shipped.
        </p>
      </div>
      {opportunities.length > 0 ? (
        <div className="mx-auto max-w-[720px]">
          {opportunities.map((opportunity) => (
            <OpportunityRow key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-[720px] rounded-xl border border-border bg-surface-elevated/90 px-6 py-12 text-center backdrop-blur-sm">
          <p className="font-serif text-lg text-text-primary">No live drops right now</p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">
            New opportunities are reviewed continuously. When one opens, it shows up here first.
          </p>
        </div>
      )}
    </SectionShell>
  );
}
