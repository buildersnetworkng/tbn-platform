export interface PlatformStatisticsRow {
  approvedBuilders: number | null;
  shippedProjects: number | null;
  postedOpportunities: number | null;
  confirmedOrganizations: number | null;
}

export interface StatisticsRepository {
  getPlatformStatistics(): Promise<PlatformStatisticsRow>;
}
