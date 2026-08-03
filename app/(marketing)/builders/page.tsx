import { BuilderCapability } from '@/capabilities/BuilderCapability';
import { Background } from '@/experience';
import { BuilderDirectory } from '@/components/directory/BuilderDirectory';
import type { BuilderSearchOptions } from '@/types/domain';

type SearchParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}

function parseOptions(params: SearchParams): BuilderSearchOptions {
  const query = typeof params.q === 'string' ? params.q : undefined;
  return {
    query,
    skills: toArray(params.skill),
    experienceLevel: toArray(params.level),
    country: toArray(params.country),
    availability: toArray(params.availability),
    sort: (typeof params.sort === 'string' ? params.sort : 'default') as BuilderSearchOptions['sort'],
    limit: 24,
    offset: 0,
  };
}

export default async function BuildersDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const options = parseOptions(resolvedParams);
  const result = await BuilderCapability.searchBuilders(options);
  const initialData = result.ok ? result.data : { builders: [], total: 0, hasMore: false };

  return (
    <>
      <Background mode="calm" />
      <div className="mx-auto w-full max-w-content px-5 pb-24 pt-16 tablet:px-8 tablet:pt-20 desktop:px-12">
        <div className="max-w-[640px]">
          <h1 className="font-serif text-[32px] leading-[1.1] text-text-primary desktop:text-[40px]">
            Builder Directory
          </h1>
          <p className="mt-3 font-sans text-base leading-[1.5] text-text-secondary">
            Every builder here is discoverable through what they&apos;ve actually shipped.
          </p>
        </div>

        <BuilderDirectory
          initialBuilders={initialData.builders}
          initialTotal={initialData.total}
          initialHasMore={initialData.hasMore}
          initialQuery={options.query ?? ''}
          initialSort={options.sort ?? 'default'}
        />
      </div>
    </>
  );
}
