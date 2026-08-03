import type { Builder, BuilderSearchOptions, BuilderSearchResult } from '@/types/domain';

export interface BuilderRepository {
  findApprovedBuilders(options: { limit: number }): Promise<Builder[]>;
  countApprovedBuilders(): Promise<number>;
  findApprovedBuildersByExternalIds(externalIds: string[]): Promise<Builder[]>;
  searchBuilders(options: BuilderSearchOptions): Promise<BuilderSearchResult>;
}
