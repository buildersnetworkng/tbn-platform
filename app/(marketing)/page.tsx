import { Background } from '@/experience';
import { Hero } from '@/components/homepage/Hero';
import { BuilderIdentity } from '@/components/homepage/BuilderIdentity';
import { CurrentBuilders } from '@/components/homepage/CurrentBuilders';
import { LivingEcosystem } from '@/components/homepage/LivingEcosystem';
import { LiveOpportunities } from '@/components/homepage/LiveOpportunities';
import { FeaturedWork } from '@/components/homepage/FeaturedWork';
import { OrganizationsPartners } from '@/components/homepage/OrganizationsPartners';
import { BuilderOfTheMonth } from '@/components/homepage/BuilderOfTheMonth';
import { JoinSection } from '@/components/homepage/JoinSection';

export default function HomePage() {
  return (
    <>
      <Background mode="living" />
      <div className="relative z-10 min-h-screen space-y-16 tablet:space-y-24 desktop:space-y-32">
        <Hero />
        <BuilderIdentity />
        <CurrentBuilders />
        <LivingEcosystem />
        <LiveOpportunities />
        <FeaturedWork />
        <OrganizationsPartners />
        <BuilderOfTheMonth />
        <JoinSection />
      </div>
    </>
  );
}
