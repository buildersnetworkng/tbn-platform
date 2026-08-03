import type { FeaturedProjectCard } from '@/types/domain';
import { FOUNDING_BUILDERS_LAUNCH_STATE } from './foundingBuildersLaunchState';
import { CURRENT_BUILDERS_LAUNCH_STATE as ILLUSTRATIVE_BUILDERS_LAUNCH_STATE } from './currentBuildersLaunchState';

const FOUNDING_PROJECT_DESCRIPTIONS: Record<string, string> = {
  Profyl: 'One link that becomes a bio page or a full portfolio, with custom domain mapping.',
  'WhatsApp Bot': 'A command-based WhatsApp bot handling device pairing, now adding AI-powered commands.',
  Uniqcreative: 'A brand built on how design shapes the way people perceive a brand.',
  Bookflix: 'Stream books, manga, and manhwa with AI-generated chapter summaries.',
};

export const FOUNDING_FEATURED_WORK_LAUNCH_STATE: FeaturedProjectCard[] = FOUNDING_BUILDERS_LAUNCH_STATE
  .filter((builder) => builder.featuredProject)
  .map((builder) => ({
    id: `founding-project-${builder.id}`,
    projectName: builder.featuredProject!.name,
    description: FOUNDING_PROJECT_DESCRIPTIONS[builder.featuredProject!.name] ?? '',
    thumbnailUrl: builder.featuredProject!.thumbnailUrl,
    builderName: builder.displayName,
    builderAvatarUrl: builder.avatarUrl,
    tags: builder.skills,
    href: undefined,
  }));

export const ILLUSTRATIVE_FEATURED_WORK_LAUNCH_STATE: FeaturedProjectCard[] = ILLUSTRATIVE_BUILDERS_LAUNCH_STATE
  .filter((builder) => builder.featuredProject)
  .map((builder) => ({
    id: `illustrative-project-${builder.id}`,
    projectName: builder.featuredProject!.name,
    description: builder.profileSummary ?? '',
    thumbnailUrl: builder.featuredProject!.thumbnailUrl,
    builderName: builder.displayName,
    builderAvatarUrl: builder.avatarUrl,
    tags: builder.skills,
    href: undefined,
  }));
