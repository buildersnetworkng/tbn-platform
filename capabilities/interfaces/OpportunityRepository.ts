import type { Opportunity } from '@/types/domain';

export interface OpportunityRepository {
  findRecentOpportunities(options: { limit: number }): Promise<Opportunity[]>;
}
