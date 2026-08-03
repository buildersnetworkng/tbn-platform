import type { FeaturedProjectCard } from '@/types/domain';
import type { ProjectRepository } from '@/capabilities/interfaces/ProjectRepository';
import { createSupabaseServerClient } from './server';

export class SupabaseProjectRepository implements ProjectRepository {
  async findFeaturedProjects({ limit }: { limit: number }): Promise<FeaturedProjectCard[]> {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, short_description, thumbnail_url, tags, builders(display_name, avatar_url)')
        .eq('is_featured', true)
        .limit(limit);

      if (error || !data) return [];

      return data.map((row: any): FeaturedProjectCard => ({
        id: row.id,
        projectName: row.name,
        description: row.short_description ?? '',
        thumbnailUrl: row.thumbnail_url ?? null,
        builderName: row.builders?.display_name ?? '',
        builderAvatarUrl: row.builders?.avatar_url ?? null,
        tags: row.tags ?? [],
        href: `/projects/${row.id}`,
      }));
    } catch {
      return [];
    }
  }
}
