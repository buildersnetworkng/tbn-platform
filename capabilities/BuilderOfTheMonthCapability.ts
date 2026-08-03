import type { BuilderOfTheMonthEntry } from '@/types/domain';
import type { BuilderOfTheMonthRepository } from './interfaces/BuilderOfTheMonthRepository';
import { SupabaseBuilderOfTheMonthRepository } from '@/repositories/supabase/SupabaseBuilderOfTheMonthRepository';
import { runCapability, type Result } from './Result';

const repository: BuilderOfTheMonthRepository = new SupabaseBuilderOfTheMonthRepository();

export const BuilderOfTheMonthCapability = {
  async getCurrentSelection(): Promise<Result<BuilderOfTheMonthEntry | null>> {
    return runCapability(() => repository.getCurrentSelection());
  },
};
