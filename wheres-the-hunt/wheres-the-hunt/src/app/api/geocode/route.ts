import { NextResponse, type NextRequest } from 'next/server';
import { searchLocation } from '@/lib/geo/geocode';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) return NextResponse.json([]);

  const results = await searchLocation(q);
  return NextResponse.json(results);
}
