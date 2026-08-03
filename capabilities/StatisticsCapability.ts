import { SupabaseStatisticsRepository } from '@/repositories/supabase/SupabaseStatisticsRepository';
import type { StatisticsRepository } from './interfaces/StatisticsRepository';
import { runCapability, type Result } from './Result';

export interface PlatformStatistic {
  key: string;
  label: string;
  value: number;
}

const statisticsRepository: StatisticsRepository = new SupabaseStatisticsRepository();

export const StatisticsCapability = {
  async getLivingEcosystemStatistics(): Promise<Result<PlatformStatistic[]>> {
    return runCapability(async () => {
      const row = await statisticsRepository.getPlatformStatistics();

      const candidates: PlatformStatistic[] = [
        { key: 'approvedBuilders', label: 'Builders', value: row.approvedBuilders ?? -1 },
        { key: 'shippedProjects', label: 'Projects Shipped', value: row.shippedProjects ?? -1 },
        { key: 'postedOpportunities', label: 'Opportunities Posted', value: row.postedOpportunities ?? -1 },
        { key: 'confirmedOrganizations', label: 'Organizations', value: row.confirmedOrganizations ?? -1 },
      ];

      return candidates.filter((stat) => stat.value >= 0);
    });
  },
};
