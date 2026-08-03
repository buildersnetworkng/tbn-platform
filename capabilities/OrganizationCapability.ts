import type { OrganizationLogo } from '@/types/domain';
import type { OrganizationRepository } from './interfaces/OrganizationRepository';
import { SupabaseOrganizationRepository } from '@/repositories/supabase/SupabaseOrganizationRepository';
import { runCapability, type Result } from './Result';

const organizationRepository: OrganizationRepository = new SupabaseOrganizationRepository();

export const OrganizationCapability = {
  async getPartnerOrganizations(limit = 12): Promise<Result<OrganizationLogo[]>> {
    return runCapability(() => organizationRepository.findConfirmedOrganizations({ limit }));
  },
};
