import type { FeaturedProjectCard } from '@/types/domain';
import type { ProjectRepository } from './interfaces/ProjectRepository';
import { SupabaseProjectRepository } from '@/repositories/supabase/SupabaseProjectRepository';
import {
  FOUNDING_FEATURED_WORK_LAUNCH_STATE,
  ILLUSTRATIVE_FEATURED_WORK_LAUNCH_STATE,
} from './launch-state/featuredWorkLaunchState';
import { runCapability, type Result } from './Result';

const projectRepository: ProjectRepository = new SupabaseProjectRepository();

export const ProjectCapability = {
  async getFeaturedWork(limit = 6): Promise<Result<FeaturedProjectCard[]>> {
    return runCapability(async () => {
      const realProjects = await projectRepository
        .findFeaturedProjects({ limit })
        .catch(() => []);

      const composed: FeaturedProjectCard[] = [...realProjects];

      for (const project of FOUNDING_FEATURED_WORK_LAUNCH_STATE) {
        if (composed.length >= limit) break;
        composed.push(project);
      }

      for (const project of ILLUSTRATIVE_FEATURED_WORK_LAUNCH_STATE) {
        if (composed.length >= limit) break;
        composed.push(project);
      }

      return composed;
    });
  },
};
