'use client';

import { useState, useTransition, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { BuilderCard } from '@/components/builders/BuilderCard';
import { Button } from '@/components/ui/Button';
import type { Builder, BuilderSearchOptions } from '@/types/domain';

interface BuilderDirectoryProps {
  initialBuilders: Builder[];
  initialTotal: number;
  initialHasMore: boolean;
  initialQuery: string;
  initialSort: NonNullable<BuilderSearchOptions['sort']>;
}

const SORT_OPTIONS: { value: NonNullable<BuilderSearchOptions['sort']>; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'recently_active', label: 'Recently active' },
  { value: 'recently_joined', label: 'Recently joined' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

export function BuilderDirectory({
  initialBuilders,
  initialTotal,
  initialHasMore,
  initialQuery,
  initialSort,
}: BuilderDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [builders, setBuilders] = useState(initialBuilders);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [queryInput, setQueryInput] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setBuilders(initialBuilders);
    setTotal(initialTotal);
    setHasMore(initialHasMore);
  }, [initialBuilders, initialTotal, initialHasMore]);

  const updateUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const handleQueryChange = (value: string) => {
    setQueryInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateUrl({ q: value || undefined });
    }, 300);
  };

  const handleSortChange = (value: string) => {
    updateUrl({ sort: value === 'default' ? undefined : value });
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('offset', String(builders.length));
    try {
      const response = await fetch(`/api/builders/search?${params.toString()}`);
      const data: { builders: Builder[]; total: number; hasMore: boolean } = await response.json();
      setBuilders((prev) => [...prev, ...data.builders]);
      setTotal(data.total);
      setHasMore(data.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <input
          type="text"
          value={queryInput}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Search builders by name or skill"
          aria-label="Search builders"
          className="h-10 w-full max-w-[360px] rounded-md border border-border bg-surface px-4 font-sans text-sm text-text-primary placeholder:text-text-muted focus-visible:border-accent"
        />
        <select
          value={initialSort}
          onChange={(event) => handleSortChange(event.target.value)}
          aria-label="Sort builders"
          className="h-10 rounded-md border border-border bg-surface px-3 font-sans text-sm text-text-primary"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p aria-live="polite" className="font-sans text-xs text-text-muted">
          {total} builder{total === 1 ? '' : 's'} found
        </p>
      </div>

      <div
        aria-label="Builder directory results"
        className="mt-4 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-4"
        style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 250ms' }}
      >
        {builders.length > 0 ? (
          builders.map((builder) => <BuilderCard key={builder.id} builder={builder} variant="directory" />)
        ) : (
          <div className="col-span-full rounded-lg border border-border bg-surface px-6 py-16 text-center">
            <p className="font-sans text-sm text-text-muted">
              {queryInput ? `No builders match "${queryInput}"` : 'No builders match these filters'}
            </p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button variant="secondary" onClick={handleLoadMore} loading={isLoadingMore}>
            Load More
          </Button>
        </div>
      )}
      {!hasMore && builders.length > 0 && (
        <p className="mt-10 text-center font-sans text-xs text-text-muted">You&apos;ve reached the end.</p>
      )}
    </div>
  );
}
