import type { Builder, BuilderSearchOptions, BuilderSearchResult } from '@/types/domain';
import type { BuilderRepository } from '@/capabilities/interfaces/BuilderRepository';
import { createSupabaseServerClient } from './server';

export class SupabaseBuilderRepository implements BuilderRepository {
  async findApprovedBuilders({ limit }: { limit: number }): Promise<Builder[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('builder_profiles')
      .select(
        'id, display_name, avatar_url, primary_skill, secondary_skills, top_project_name, top_project_thumbnail_url, is_active, joined_at'
      )
      .order('is_active', { ascending: false })
      .order('last_active_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map(
      (row): Builder => ({
        id: row.id,
        displayName: row.display_name,
        avatarUrl: row.avatar_url,
        role: row.primary_skill,
        skills: row.secondary_skills ?? [],
        profileHref: `/builders/${row.id}`,
        featuredProject: row.top_project_name
          ? { name: row.top_project_name, thumbnailUrl: row.top_project_thumbnail_url ?? null }
          : undefined,
        isActive: row.is_active ?? undefined,
        joinedAt: row.joined_at ?? undefined,
      })
    );
  }

  async countApprovedBuilders(): Promise<number> {
    const supabase = await createSupabaseServerClient();
    const { count } = await supabase
      .from('builder_profiles')
      .select('id', { count: 'exact', head: true });
    return count ?? 0;
  }

  async findApprovedBuildersByExternalIds(externalIds: string[]): Promise<Builder[]> {
    if (externalIds.length === 0) return [];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('builder_profiles')
      .select(
        'id, display_name, avatar_url, primary_skill, secondary_skills, top_project_name, top_project_thumbnail_url, is_active, joined_at, external_reference_id'
      )
      .in('external_reference_id', externalIds);

    if (error || !data) return [];

    return data.map(
      (row): Builder => ({
        id: row.id,
        displayName: row.display_name,
        avatarUrl: row.avatar_url,
        role: row.primary_skill,
        skills: row.secondary_skills ?? [],
        profileHref: `/builders/${row.id}`,
        featuredProject: row.top_project_name
          ? { name: row.top_project_name, thumbnailUrl: row.top_project_thumbnail_url ?? null }
          : undefined,
        isActive: row.is_active ?? undefined,
        joinedAt: row.joined_at ?? undefined,
        externalReferenceId: row.external_reference_id ?? undefined,
      })
    );
  }

  async searchBuilders(options: BuilderSearchOptions): Promise<BuilderSearchResult> {
    try {
      const supabase = await createSupabaseServerClient();

      let query = supabase
        .from('builder_profiles')
        .select(
          'id, display_name, avatar_url, primary_skill, secondary_skills, location_city, location_country, availability_status, experience_level, profile_completeness_pct, top_project_name, top_project_thumbnail_url, is_active, joined_at, last_active_at',
          { count: 'exact' }
        );

      if (options.query) {
        const term = `%${options.query}%`;
        query = query.or(
          `display_name.ilike.${term},primary_skill.ilike.${term},top_project_name.ilike.${term}`
        );
      }
      if (options.skills && options.skills.length > 0) {
        query = query.in('primary_skill', options.skills);
      }
      if (options.experienceLevel && options.experienceLevel.length > 0) {
        query = query.in('experience_level', options.experienceLevel);
      }
      if (options.country && options.country.length > 0) {
        query = query.in('location_country', options.country);
      }
      if (options.availability && options.availability.length > 0) {
        query = query.in('availability_status', options.availability);
      }

      switch (options.sort) {
        case 'recently_active':
          query = query.order('last_active_at', { ascending: false });
          break;
        case 'recently_joined':
          query = query.order('joined_at', { ascending: false });
          break;
        case 'alphabetical':
          query = query.order('display_name', { ascending: true });
          break;
        default:
          query = query.order('is_active', { ascending: false }).order('last_active_at', { ascending: false });
      }

      query = query.range(options.offset, options.offset + options.limit - 1);

      const { data, error, count } = await query;
      if (error || !data) return { builders: [], total: 0, hasMore: false };

      const builders: Builder[] = data.map((row: any) => ({
        id: row.id,
        displayName: row.display_name,
        avatarUrl: row.avatar_url,
        role: row.primary_skill,
        skills: row.secondary_skills ?? [],
        profileHref: `/builders/${row.id}`,
        featuredProject: row.top_project_name
          ? { name: row.top_project_name, thumbnailUrl: row.top_project_thumbnail_url ?? null }
          : undefined,
        isActive: row.is_active ?? undefined,
        joinedAt: row.joined_at ?? undefined,
        locationCity: row.location_city ?? undefined,
        locationCountry: row.location_country ?? undefined,
        availabilityStatus: row.availability_status ?? undefined,
        profileCompletenessPct: row.profile_completeness_pct ?? undefined,
        experienceLevel: row.experience_level ?? undefined,
      }));

      const total = count ?? builders.length;
      return { builders, total, hasMore: options.offset + builders.length < total };
    } catch {
      return { builders: [], total: 0, hasMore: false };
    }
  }
}
