import type { Builder, BuilderSearchOptions } from '@/types/domain';

export function filterLaunchStateBuilders(
  builders: Builder[],
  options: Pick<BuilderSearchOptions, 'query' | 'skills'>
): Builder[] {
  return builders.filter((builder) => {
    if (options.query) {
      const term = options.query.toLowerCase();
      const matchesQuery =
        builder.displayName.toLowerCase().includes(term) ||
        builder.role.toLowerCase().includes(term) ||
        builder.skills.some((skill) => skill.toLowerCase().includes(term));
      if (!matchesQuery) return false;
    }
    if (options.skills && options.skills.length > 0) {
      const matchesSkill = options.skills.some(
        (skill) => builder.role === skill || builder.skills.includes(skill)
      );
      if (!matchesSkill) return false;
    }
    return true;
  });
}
