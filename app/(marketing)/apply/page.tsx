import type { Metadata } from 'next';
import { Background } from '@/experience';
import { ApplyForm } from '@/components/apply/ApplyForm';

export const metadata: Metadata = {
  title: 'Apply — THE BUILDERS NETWORK',
  description: 'Create your builder profile and join THE BUILDERS NETWORK.',
};

export default function ApplyPage() {
  return (
    <>
      <Background mode="apply" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-content grid-cols-1 gap-12 px-5 py-12 tablet:px-8 desktop:grid-cols-2 desktop:gap-16 desktop:px-12 desktop:py-16">
        <aside className="hidden flex-col justify-between desktop:flex">
          <div className="max-w-[420px] pt-8">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
              Apply
            </p>
            <h1 className="mt-4 font-serif text-[40px] leading-[1.1] text-text-primary desktop:text-[52px]">
              Where builders<br />become <em className="italic text-accent">visible.</em>
            </h1>
            <p className="mt-5 font-sans text-base leading-relaxed text-text-secondary">
              A structured ecosystem for builders who ship real work. Your profile becomes a public track record — not a bio, proof.
            </p>

            <ul className="mt-10 space-y-4">
              {['Builder Directory', 'Weekly Builder Features', 'Opportunity Drops', 'Builder of the Month'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-sans text-sm text-text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="pb-4 font-serif text-sm italic text-text-muted">Learn. Build. Collaborate.</p>
        </aside>

        <section className="flex items-start justify-center desktop:items-center desktop:justify-start">
          <ApplyForm />
        </section>
      </div>
    </>
  );
}
