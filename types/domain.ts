export interface BuilderSocialLink {
  label: string;
  url: string;
}

export interface BuilderFeaturedProject {
  name: string;
  thumbnailUrl: string | null;
}

export interface Builder {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  skills: string[];
  profileHref?: string;
  profileSummary?: string;
  featuredProject?: BuilderFeaturedProject;
  socialLinks?: BuilderSocialLink[];
  isActive?: boolean;
  joinedAt?: string;
  profileCompletenessPct?: number;
  builderScore?: number;
  externalReferenceId?: string;
  locationCity?: string;
  locationCountry?: string;
  availabilityStatus?: 'available' | 'open_to_offers' | 'not_available';
  experienceLevel?: 'student' | 'junior' | 'mid' | 'senior';
}

export interface BuilderSearchOptions {
  query?: string;
  skills?: string[];
  experienceLevel?: string[];
  country?: string[];
  availability?: string[];
  sort?: 'default' | 'recently_active' | 'recently_joined' | 'alphabetical';
  limit: number;
  offset: number;
}

export interface BuilderSearchResult {
  builders: Builder[];
  total: number;
  hasMore: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organizationName: string;
  organizationLogoUrl: string | null;
  opportunityType: string;
  postedAt: string;
  locationOrRemote: string;
  href: string;
}

export interface FeaturedProjectCard {
  id: string;
  projectName: string;
  description: string;
  thumbnailUrl: string | null;
  builderName: string;
  builderAvatarUrl: string | null;
  tags: string[];
  href?: string;
}

export interface OrganizationLogo {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface BuilderOfTheMonthEntry {
  builderName: string;
  builderAvatarUrl: string | null;
  monthLabel: string;
  headlineProjectName: string;
  headlineProjectThumbnailUrl: string | null;
  shortStory: string;
  href: string;
}
