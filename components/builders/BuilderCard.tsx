import Image from 'next/image';
import type { Builder } from '@/types/domain';

export type BuilderCardVariant = 'homepage' | 'directory' | 'compact';

const VARIANT_CONFIG: Record<
  BuilderCardVariant,
  { padding: string; avatarSize: number; showSummary: boolean; showProject: boolean; showMeta: boolean; summaryClamp: string }
> = {
  homepage: { padding: 'p-5', avatarSize: 56, showSummary: true, showProject: true, showMeta: false, summaryClamp: 'line-clamp-3' },
  directory: { padding: 'p-4', avatarSize: 48, showSummary: true, showProject: true, showMeta: true, summaryClamp: 'line-clamp-2' },
  compact: { padding: 'p-3', avatarSize: 36, showSummary: false, showProject: false, showMeta: false, summaryClamp: 'line-clamp-2' },
};

function isRecentlyJoined(joinedAt?: string): boolean {
  if (!joinedAt) return false;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(joinedAt).getTime() < sevenDaysMs;
}

function Initials({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-surface-elevated font-sans text-sm font-medium text-text-secondary"
    >
      {initials}
    </div>
  );
}

const AVAILABILITY_LABEL: Record<NonNullable<Builder['availabilityStatus']>, string> = {
  available: 'Available',
  open_to_offers: 'Open to offers',
  not_available: 'Not available',
};

export function BuilderCard({ builder, variant = 'homepage' }: { builder: Builder; variant?: BuilderCardVariant }) {
  const config = VARIANT_CONFIG[variant];
  const showNewTag = isRecentlyJoined(builder.joinedAt);
  const isLinkable = Boolean(builder.profileHref && builder.profileHref !== '#');

  const cardClassName = `group block rounded-lg border border-border bg-surface ${config.padding} transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-hover hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]`;

  const location = [builder.locationCity, builder.locationCountry].filter(Boolean).join(', ');

  const cardContent = (
    <>
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {builder.avatarUrl ? (
            <Image
              src={builder.avatarUrl}
              alt=""
              width={config.avatarSize}
              height={config.avatarSize}
              className="rounded-full object-cover"
              style={{ width: config.avatarSize, height: config.avatarSize }}
            />
          ) : (
            <Initials name={builder.displayName} size={config.avatarSize} />
          )}
          {builder.isActive === true && (
            <span
              className="pulse-dot absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent"
              aria-label="Active now"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[15px] font-semibold text-text-primary">{builder.displayName}</p>
          <p className="truncate font-sans text-xs text-text-muted">
            {builder.role}
            {config.showMeta && location ? ` · ${location}` : ''}
          </p>
        </div>

        {showNewTag && (
          <span aria-label="New" className="flex-shrink-0 rounded-full border border-border px-2 py-0.5 font-sans text-[11px] text-text-muted">
            New
          </span>
        )}
      </div>

      {config.showMeta && builder.availabilityStatus && (
        <p className="mt-2 font-sans text-[11px] text-text-muted">
          {AVAILABILITY_LABEL[builder.availabilityStatus]}
        </p>
      )}

      {builder.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {builder.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="rounded-full bg-white/[0.05] px-2 py-0.5 font-sans text-[11px] text-text-muted">
              {skill}
            </span>
          ))}
        </div>
      )}

      {config.showSummary && builder.profileSummary && (
        <p className={`mt-3 ${config.summaryClamp} font-sans text-sm leading-[1.5] text-text-secondary`}>
          {builder.profileSummary}
        </p>
      )}

      {config.showProject && builder.featuredProject && (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-md bg-surface-elevated">
          {builder.featuredProject.thumbnailUrl && (
            <Image
              src={builder.featuredProject.thumbnailUrl}
              alt=""
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background-primary/90 to-transparent px-3 py-2">
            <p className="truncate font-sans text-xs text-text-primary">{builder.featuredProject.name}</p>
          </div>
        </div>
      )}

      {config.showMeta && typeof builder.profileCompletenessPct === 'number' && builder.profileCompletenessPct < 100 && (
        <div className="mt-3 h-0.5 w-full rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${builder.profileCompletenessPct}%` }}
            aria-label={`Profile ${builder.profileCompletenessPct}% complete`}
          />
        </div>
      )}

      {builder.socialLinks && builder.socialLinks.length > 0 && (
        <div className="mt-3 flex gap-3">
          {builder.socialLinks.map((link) => (
            <span key={link.label} className="font-sans text-[11px] text-text-muted">
              {link.label}
            </span>
          ))}
        </div>
      )}
    </>
  );

  if (isLinkable) {
    return (
      <a
        href={builder.profileHref}
        aria-label={`View ${builder.displayName}'s profile — ${builder.role}`}
        className={cardClassName}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}
