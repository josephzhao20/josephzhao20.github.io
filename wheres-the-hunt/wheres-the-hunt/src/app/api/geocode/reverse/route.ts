import { NextResponse, type NextRequest } from 'next/server';
import { reverseGeocode } from '@/lib/geo/geocode';

export async function GET(request: NextRequest) {
  const lat = parseFloat(request.nextUrl.searchParams.get('lat') ?? '');
  const lon = parseFloat(request.nextUrl.searchParams.get('lon') ?? '');

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: 'lat and lon are required.' }, { status: 422 });
  }

  const result = await reverseGeocode(lat, lon);
  if (!result) return NextResponse.json({ error: 'Could not resolve that location.' }, { status: 404 });

  return NextResponse.json(result);
}
