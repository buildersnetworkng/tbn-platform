import Image from 'next/image';
import { OrganizationCapability } from '@/capabilities/OrganizationCapability';
import { SectionShell } from '../ui/SectionShell';
import { Button } from '../ui/Button';
import { OrganizationSlotsVisual } from './OrganizationSlotsVisual';

export async function OrganizationsPartners() {
  const result = await OrganizationCapability.getPartnerOrganizations();
  const organizations = result.ok ? result.data : [];

  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 tablet:px-8 desktop:px-12">
      <div className="mb-8 max-w-[560px] text-center tablet:mb-10 tablet:text-left">
        <h2 className="font-serif text-[22px] leading-[1.25] text-text-primary tablet:text-[26px] desktop:text-[32px]">
          Organizations & Partners
        </h2>
      </div>
      {organizations.length > 0 ? (
        <div className="grid grid-cols-3 items-center gap-8 tablet:grid-cols-4 desktop:grid-cols-6">
          {organizations.map((org) => (
            <div key={org.id} className="flex h-[60px] items-center justify-center grayscale transition-all duration-200 hover:grayscale-0">
              {org.logoUrl && (<Image src={org.logoUrl} alt={org.name} width={120} height={60} className="max-h-[40px] w-auto object-contain" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-[560px] rounded-lg border border-border bg-surface px-6 py-14 text-center">
          <OrganizationSlotsVisual />
          <p className="mt-6 font-sans text-sm leading-[1.5] text-text-secondary">
            Partnership announcements appear here the moment they&apos;re official — not before.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" href="/partner">Partner With THE BUILDERS NETWORK</Button>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
