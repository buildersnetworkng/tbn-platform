import type { Opportunity } from '@/types/domain';
import type { OpportunityRepository } from './interfaces/OpportunityRepository';
import { SupabaseOpportunityRepository } from '@/repositories/supabase/SupabaseOpportunityRepository';
import { runCapability, type Result } from './Result';

const opportunityRepository: OpportunityRepository = new SupabaseOpportunityRepository();

export const OpportunityCapability = {
  async getLiveOpportunities(limit = 6): Promise<Result<Opportunity[]>> {
    return runCapability(() => opportunityRepository.findRecentOpportunities({ limit }));
  },
};
