import type {
  StatisticsRepository,
  PlatformStatisticsRow,
} from '@/capabilities/interfaces/StatisticsRepository';
import { createSupabaseServerClient } from './server';

const NULL_ROW: PlatformStatisticsRow = {
  approvedBuilders: null,
  shippedProjects: null,
  postedOpportunities: null,
  confirmedOrganizations: null,
};

export class SupabaseStatisticsRepository implements StatisticsRepository {
  async getPlatformStatistics(): Promise<PlatformStatisticsRow> {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('platform_statistics')
        .select('approved_builders, shipped_projects, posted_opportunities, confirmed_organizations')
        .single();

      if (error || !data) return NULL_ROW;

      return {
        approvedBuilders: data.approved_builders ?? null,
        shippedProjects: data.shipped_projects ?? null,
        postedOpportunities: data.posted_opportunities ?? null,
        confirmedOrganizations: data.confirmed_organizations ?? null,
      };
    } catch {
      return NULL_ROW;
    }
  }
}
