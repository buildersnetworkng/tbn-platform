import { NextRequest, NextResponse } from 'next/server';
import { BuilderCapability } from '@/capabilities/BuilderCapability';
import type { BuilderSearchOptions } from '@/types/domain';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const options: BuilderSearchOptions = {
    query: params.get('q') ?? undefined,
    skills: params.getAll('skill').length > 0 ? params.getAll('skill') : undefined,
    experienceLevel: params.getAll('level').length > 0 ? params.getAll('level') : undefined,
    country: params.getAll('country').length > 0 ? params.getAll('country') : undefined,
    availability: params.getAll('availability').length > 0 ? params.getAll('availability') : undefined,
    sort: (params.get('sort') as BuilderSearchOptions['sort']) ?? 'default',
    limit: 24,
    offset: Number(params.get('offset') ?? 0),
  };

  const result = await BuilderCapability.searchBuilders(options);

  if (!result.ok) {
    return NextResponse.json({ builders: [], total: 0, hasMore: false }, { status: 200 });
  }

  return NextResponse.json(result.data);
}
