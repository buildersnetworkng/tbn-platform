import { SectionShell } from '../ui/SectionShell';
import { Button } from '../ui/Button';

const WHY_JOIN = [
  { label: 'Visibility', description: 'Real work, seen by real people.' },
  { label: 'Opportunity', description: 'Organizations discover you through what you\u2019ve shipped.' },
  { label: 'Credibility', description: 'A track record you don\u2019t have to explain.' },
  { label: 'Collaboration', description: 'Find builders worth building alongside.' },
];

export function JoinSection() {
  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 py-20 text-center tablet:px-8 desktop:px-12">
      <div className="mx-auto grid max-w-[880px] grid-cols-1 gap-8 tablet:grid-cols-4 tablet:gap-6">
        {WHY_JOIN.map((item) => (
          <div key={item.label}>
            <p className="font-serif text-lg text-text-primary">{item.label}</p>
            <p className="mt-2 font-sans text-sm leading-[1.5] text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-20 max-w-[640px]">
        <h2 className="font-serif text-[32px] leading-[1.1] text-text-primary desktop:text-[40px]">
          If you&apos;re building something real, this is where it starts to show.
        </h2>
        <div className="mt-8 flex justify-center">
          <Button variant="primary" href="/apply" className="w-full max-w-[320px] tablet:w-auto">
            Apply to join THE BUILDERS NETWORK
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
