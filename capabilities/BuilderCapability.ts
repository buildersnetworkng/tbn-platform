import type { Builder, BuilderSearchOptions, BuilderSearchResult } from '@/types/domain';
import type { BuilderRepository } from './interfaces/BuilderRepository';
import { SupabaseBuilderRepository } from '@/repositories/supabase/SupabaseBuilderRepository';
import { FOUNDING_BUILDERS_LAUNCH_STATE } from './launch-state/foundingBuildersLaunchState';
import { CURRENT_BUILDERS_LAUNCH_STATE as ILLUSTRATIVE_BUILDERS_LAUNCH_STATE } from './launch-state/currentBuildersLaunchState';
import { filterLaunchStateBuilders } from './launch-state/filterLaunchStateBuilders';
import { runCapability, type Result } from './Result';

const builderRepository: BuilderRepository = new SupabaseBuilderRepository();

async function getCompletedFoundingExternalIds(): Promise<Set<string | undefined>> {
  const foundingExternalIds = FOUNDING_BUILDERS_LAUNCH_STATE.map((b) => b.externalReferenceId).filter(
    (id): id is string => Boolean(id)
  );
  const completed = await builderRepository
    .findApprovedBuildersByExternalIds(foundingExternalIds)
    .catch(() => []);
  return new Set(completed.map((b) => b.externalReferenceId));
}

export const BuilderCapability = {
  async getCurrentBuilders(limit = 9): Promise<Result<Builder[]>> {
    return runCapability(async () => {
      const realBuilders = await builderRepository.findApprovedBuilders({ limit }).catch(() => []);
      const completedExternalIds = await getCompletedFoundingExternalIds();

      const activeFoundingEntries = FOUNDING_BUILDERS_LAUNCH_STATE.filter(
        (b) => !completedExternalIds.has(b.externalReferenceId)
      );

      const composed: Builder[] = [...realBuilders];
      for (const entry of [...activeFoundingEntries, ...ILLUSTRATIVE_BUILDERS_LAUNCH_STATE]) {
        if (composed.length >= limit) break;
        composed.push(entry);
      }

      return composed;
    });
  },

  async searchBuilders(options: BuilderSearchOptions): Promise<Result<BuilderSearchResult>> {
    return runCapability(async () => {
      const realResult = await builderRepository
        .searchBuilders(options)
        .catch((): BuilderSearchResult => ({ builders: [], total: 0, hasMore: false }));

      if (options.offset > 0 || realResult.builders.length >= options.limit) {
        return realResult;
      }

      const completedExternalIds = await getCompletedFoundingExternalIds();
      const activeFoundingEntries = filterLaunchStateBuilders(
        FOUNDING_BUILDERS_LAUNCH_STATE.filter((b) => !completedExternalIds.has(b.externalReferenceId)),
        options
      );
      const illustrativeEntries = filterLaunchStateBuilders(ILLUSTRATIVE_BUILDERS_LAUNCH_STATE, options);

      const composed = [...realResult.builders];
      for (const entry of [...activeFoundingEntries, ...illustrativeEntries]) {
        if (composed.length >= options.limit) break;
        composed.push(entry);
      }

      return {
        builders: composed,
        total: Math.max(realResult.total, composed.length),
        hasMore: realResult.hasMore,
      };
    });
  },
};
