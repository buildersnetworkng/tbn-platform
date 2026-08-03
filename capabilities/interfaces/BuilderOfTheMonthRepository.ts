import type { BuilderOfTheMonthEntry } from '@/types/domain';

export interface BuilderOfTheMonthRepository {
  getCurrentSelection(): Promise<BuilderOfTheMonthEntry | null>;
}
