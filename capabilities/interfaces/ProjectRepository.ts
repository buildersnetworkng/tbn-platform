import type { FeaturedProjectCard } from '@/types/domain';

export interface ProjectRepository {
  findFeaturedProjects(options: { limit: number }): Promise<FeaturedProjectCard[]>;
}
