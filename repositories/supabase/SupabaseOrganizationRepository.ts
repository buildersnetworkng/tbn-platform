import type { OrganizationLogo } from '@/types/domain';
import type { OrganizationRepository } from '@/capabilities/interfaces/OrganizationRepository';
import { createSupabaseServerClient } from './server';

export class SupabaseOrganizationRepository implements OrganizationRepository {
  async findConfirmedOrganizations({ limit }: { limit: number }): Promise<OrganizationLogo[]> {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('organization_profiles')
        .select('id, organization_name, logo_url')
        .limit(limit);

      if (error || !data) return [];

      return data.map((row): OrganizationLogo => ({
        id: row.id,
        name: row.organization_name,
        logoUrl: row.logo_url ?? null,
      }));
    } catch {
      return [];
    }
  }
}
