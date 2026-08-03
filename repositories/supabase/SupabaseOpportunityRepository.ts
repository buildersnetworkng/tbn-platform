import type { Opportunity } from '@/types/domain';
import type { OpportunityRepository } from '@/capabilities/interfaces/OpportunityRepository';
import { createSupabaseServerClient } from './server';

export class SupabaseOpportunityRepository implements OpportunityRepository {
  async findRecentOpportunities({ limit }: { limit: number }): Promise<Opportunity[]> {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('opportunity_feed')
        .select('id, title, organization_name, organization_logo_url, opportunity_type, posted_at, location_or_remote')
        .eq('status', 'open')
        .order('posted_at', { ascending: false })
        .limit(limit);

      if (error || !data) return [];

      return data.map(
        (row): Opportunity => ({
          id: row.id,
          title: row.title,
          organizationName: row.organization_name,
          organizationLogoUrl: row.organization_logo_url ?? null,
          opportunityType: row.opportunity_type,
          postedAt: row.posted_at,
          locationOrRemote: row.location_or_remote,
          href: `/opportunities/${row.id}`,
        })
      );
    } catch {
      return [];
    }
  }
}
