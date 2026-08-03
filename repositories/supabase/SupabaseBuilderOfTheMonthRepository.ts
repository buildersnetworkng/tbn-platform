import type { BuilderOfTheMonthEntry } from '@/types/domain';
import type { BuilderOfTheMonthRepository } from '@/capabilities/interfaces/BuilderOfTheMonthRepository';
import { createSupabaseServerClient } from './server';

export class SupabaseBuilderOfTheMonthRepository implements BuilderOfTheMonthRepository {
  async getCurrentSelection(): Promise<BuilderOfTheMonthEntry | null> {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('builder_of_the_month')
        .select('month_label, short_story, builders(display_name, avatar_url), projects(name, thumbnail_url)')
        .order('selected_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;
      const row: any = data;

      return {
        builderName: row.builders?.display_name ?? '',
        builderAvatarUrl: row.builders?.avatar_url ?? null,
        monthLabel: row.month_label,
        headlineProjectName: row.projects?.name ?? '',
        headlineProjectThumbnailUrl: row.projects?.thumbnail_url ?? null,
        shortStory: row.short_story,
        href: '#',
      };
    } catch {
      return null;
    }
  }
}
