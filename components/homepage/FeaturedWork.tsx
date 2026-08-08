import { ProjectCapability } from '@/capabilities/ProjectCapability';
import { SectionShell } from '../ui/SectionShell';
import { Marquee } from '../ui/Marquee';
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

      <Marquee durationSeconds={Math.max(30, result.data.length * 7)}>
        {result.data.map((project) => (
          <div key={project.id} className="w-[300px] flex-shrink-0 tablet:w-[340px]">
            <ProjectCard project={project} />
          </div>
        ))}
      </Marquee>
    </SectionShell>
  );
}
