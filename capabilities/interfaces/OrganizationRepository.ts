import type { OrganizationLogo } from '@/types/domain';

export interface OrganizationRepository {
  findConfirmedOrganizations(options: { limit: number }): Promise<OrganizationLogo[]>;
}
