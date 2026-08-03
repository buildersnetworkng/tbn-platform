import { ProjectCapability } from '@/capabilities/ProjectCapability';
import { SectionShell } from '../ui/SectionShell';
import { ProjectCard } from './ProjectCard';

export async function FeaturedWork() {
  const result = await ProjectCapability.getFeaturedWork();
  if (!result.ok || result.data.length === 0) return null;

  return (
    <SectionShell className="mx-auto w-full max-w-content px-5 tablet:px-8 desktop:px-12">
      <div className="mb-8 max-w-[560px] tablet:mb-10">
        <h2 className="font-serif text-[22px] leading-[1.25] text-text-primary tablet:text-[26px] desktop:text-[32px]">
          Featured Work
        </h2>
        <p className="mt-3 font-sans text-base leading-[1.5] text-text-secondary">
          Shipped, not slideshow. Every project here came from someone building.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3" style={{ rowGap: '32px' }}>
        {result.data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionShell>
  );
}
