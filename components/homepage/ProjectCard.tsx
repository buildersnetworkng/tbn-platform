import Image from 'next/image';
import type { FeaturedProjectCard } from '@/types/domain';

export function ProjectCard({ project }: { project: FeaturedProjectCard }) {
  const isLinkable = Boolean(project.href);
  const cardClassName = 'group block overflow-hidden rounded-lg border border-border bg-surface transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-hover hover:-translate-y-0.5';

  const cardContent = (
    <>
      <div className="relative aspect-[16/10] bg-surface-elevated">
        {project.thumbnailUrl && (
          <Image src={project.thumbnailUrl} alt="" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
        )}
      </div>
      <div className="p-5">
        <p className="font-sans text-[15px] font-semibold text-text-primary">{project.projectName}</p>
        {project.description && (<p className="mt-2 line-clamp-2 font-sans text-sm leading-[1.5] text-text-secondary">{project.description}</p>)}
        <p className="mt-3 font-sans text-xs text-text-muted">{project.builderName}</p>
        {project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (<span key={tag} className="rounded-full bg-white/[0.05] px-2 py-0.5 font-sans text-[11px] text-text-muted">{tag}</span>))}
          </div>
        )}
      </div>
    </>
  );

  if (isLinkable) {
    return (<a href={project.href} aria-label={`${project.projectName} by ${project.builderName}`} className={cardClassName}>{cardContent}</a>);
  }
  return <div className={cardClassName}>{cardContent}</div>;
}
