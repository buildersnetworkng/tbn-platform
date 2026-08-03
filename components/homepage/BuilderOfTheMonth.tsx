import Image from 'next/image';
import { BuilderOfTheMonthCapability } from '@/capabilities/BuilderOfTheMonthCapability';
import { SectionShell } from '../ui/SectionShell';
import { Button } from '../ui/Button';

export async function BuilderOfTheMonth() {
  const result = await BuilderOfTheMonthCapability.getCurrentSelection();
  const entry = result.ok ? result.data : null;

  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 tablet:px-8 desktop:px-12">
      {entry ? (
        <div className="flex flex-col items-center gap-10 tablet:flex-row tablet:gap-16">
          <div className="relative h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-[24px] bg-surface-elevated tablet:h-[280px] tablet:w-[240px]">
            {entry.builderAvatarUrl && (
              <Image
                src={entry.builderAvatarUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 240px, 200px"
                className="object-cover"
              />
            )}
          </div>
          <div className="max-w-[520px] text-center tablet:text-left">
            <p className="font-sans text-xs uppercase tracking-[0.02em] text-text-muted">{entry.monthLabel}</p>
            <h2 className="mt-2 font-serif text-[32px] leading-[1.1] text-text-primary desktop:text-[40px]">
              {entry.builderName}
            </h2>
            <p className="mt-4 font-sans text-base leading-[1.5] text-text-secondary">{entry.shortStory}</p>
            <div className="mt-6">
              <Button variant="secondary" href={entry.href}>
                View {entry.builderName}&apos;s profile
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[560px] rounded-lg border border-dashed border-border bg-surface px-6 py-14 text-center">
          <p className="font-serif text-[22px] text-text-primary">Builder of the Month</p>
          <p className="mt-2 font-sans text-sm text-text-muted">Coming soon.</p>
        </div>
      )}
    </SectionShell>
  );
}
