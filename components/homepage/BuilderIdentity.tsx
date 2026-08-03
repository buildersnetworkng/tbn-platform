import { SectionShell } from '../ui/SectionShell';
import { BuilderIdentityVisual } from './BuilderIdentityVisual';

export function BuilderIdentity() {
  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 tablet:px-8 desktop:px-12">
      <div className="flex flex-col items-center gap-10 tablet:flex-row tablet:items-center tablet:gap-16">
        <div className="flex max-w-[560px] flex-col tablet:w-[55%]">
          <h2 className="font-serif text-[22px] leading-[1.25] text-text-primary tablet:text-[26px] desktop:text-[32px]">
            Visibility isn&apos;t given here. It&apos;s built.
          </h2>
          <p className="mt-4 font-sans text-base leading-[1.5] text-text-secondary">
            A builder on this platform isn&apos;t a title or a bio — it&apos;s a track
            record. Every project you ship becomes part of a public record anyone can
            verify. There&apos;s no follower count to inflate and no algorithm to game.
            If you&apos;re building something real, this is where it starts to show.
          </p>
        </div>

        <div className="flex w-full justify-center tablet:w-[45%]">
          <BuilderIdentityVisual />
        </div>
      </div>
    </SectionShell>
  );
}
