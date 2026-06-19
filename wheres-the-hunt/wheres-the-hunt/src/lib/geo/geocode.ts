import type { GeocodeResult } from '@/lib/types';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

function userAgentHeaders() {
  const contact = process.env.NOMINATIM_CONTACT_EMAIL || 'contact@wheresthehunt.app';
  return {
    // Nominatim's usage policy requires an identifying User-Agent or
    // Referer: https://operations.osmfoundation.org/policies/nominatim/
    'User-Agent': `WheresTheHunt/1.0 (${contact})`,
    'Accept-Language': 'en',
  };
}

interface NominatimAddress {
  country?: string;
  country_code?: string;
  state?: string;
  region?: string;
  province?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

/** Forward geocode: free-text query -> candidate locations. Server-only. */
export async function searchLocation(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];

  const url = new URL(`${NOMINATIM_BASE}/search`);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '6');

  const res = await fetch(url, { headers: userAgentHeaders() });
  if (!res.ok) return [];

  const results: NominatimResult[] = await res.json();

  return results.map((r) => ({
    label: r.display_name,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
    country: r.address?.country ?? 'Unknown',
    countryCode: (r.address?.country_code ?? '').toUpperCase(),
    region: r.address?.state ?? r.address?.region ?? r.address?.province ?? null,
  }));
}

/** Reverse geocode: coordinates -> country/region. Used for EXIF GPS. Server-only. */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodeResult | null> {
  const url = new URL(`${NOMINATIM_BASE}/reverse`);
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url, { headers: userAgentHeaders() });
  if (!res.ok) return null;

  const r: NominatimResult = await res.json();
  if (!r.address) return null;

  return {
    label: r.display_name,
    latitude,
    longitude,
    country: r.address.country ?? 'Unknown',
    countryCode: (r.address.country_code ?? '').toUpperCase(),
    region: r.address.state ?? r.address.region ?? r.address.province ?? null,
  };
}
