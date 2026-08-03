import type { Opportunity } from '@/types/domain';

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function OpportunityRow({ opportunity }: { opportunity: Opportunity }) {
  return (
    <a
      href={opportunity.href}
      aria-label={`${opportunity.title} at ${opportunity.organizationName}, posted ${relativeTime(opportunity.postedAt)}`}
      className="group flex items-center gap-4 border-b border-hairline py-4 first:pt-0 last:border-b-0 last:pb-0 tablet:py-5"
    >
      <div className="h-8 w-8 flex-shrink-0 rounded-md bg-surface-elevated" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[15px] font-semibold text-text-primary">{opportunity.title}</p>
        <p className="truncate font-sans text-xs text-text-muted">
          {opportunity.organizationName} · {opportunity.opportunityType} · {relativeTime(opportunity.postedAt)}
        </p>
      </div>
      <span aria-hidden="true" className="flex-shrink-0 text-text-muted transition-transform duration-150 group-hover:translate-x-0.5">→</span>
    </a>
  );
}
