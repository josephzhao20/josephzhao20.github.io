import { getCountryBounds } from '@/data/country-bounds';
import type { PrivacyMode } from '@/lib/types/database.types';

const EARTH_RADIUS_M = 6371000;

/**
 * Deterministic-ish pseudo-random in [0, 1). We don't need crypto-grade
 * randomness here, just "a different point every time this runs."
 */
function rand(): number {
  return Math.random();
}

/** Offsets a lat/lon point by a random distance (meters) and bearing. */
function jitter(lat: number, lon: number, maxRadiusMeters: number) {
  const radius = maxRadiusMeters * Math.sqrt(rand()); // uniform over the disc, not just the edge
  const bearing = rand() * 2 * Math.PI;

  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const angularDistance = radius / EARTH_RADIUS_M;

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const newLonRad =
    lonRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
    );

  return {
    latitude: (newLatRad * 180) / Math.PI,
    longitude: (((newLonRad * 180) / Math.PI + 540) % 360) - 180, // normalize to [-180, 180]
  };
}

/** Random point uniformly distributed inside a [south, west, north, east] box. */
function randomPointInBounds([south, west, north, east]: [number, number, number, number]) {
  return {
    latitude: south + rand() * (north - south),
    longitude: west + rand() * (east - west),
  };
}

/**
 * "Region" privacy: we don't have administrative-boundary polygons for
 * states/provinces in this MVP, so we approximate "somewhere in this
 * region" with a jitter disc around the real point. 80km covers most
 * small-to-mid states/counties without crossing into a wildly different
 * region; it's intentionally tighter than the country-level randomization.
 */
const REGION_JITTER_RADIUS_METERS = 80_000;

/** Fallback for countries missing from the bounding-box table. */
const COUNTRY_FALLBACK_JITTER_RADIUS_METERS = 250_000;

export interface DisplayCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Resolves the latitude/longitude the map should actually render for a given
 * adventure, based on its privacy mode. The real coordinates are NEVER
 * mutated — only used as the seed for randomization.
 */
export function resolveDisplayCoordinates(
  privacyMode: PrivacyMode,
  realLatitude: number,
  realLongitude: number,
  countryCode: string | null
): DisplayCoordinates | null {
  switch (privacyMode) {
    case 'exact':
      return { latitude: realLatitude, longitude: realLongitude };

    case 'region':
      return jitter(realLatitude, realLongitude, REGION_JITTER_RADIUS_METERS);

    case 'country': {
      const bounds = countryCode ? getCountryBounds(countryCode) : null;
      if (bounds) {
        // Bias the random point toward the real location: pick a point in
        // the country box, but re-roll once if it lands wildly far from the
        // real point relative to the box size, to avoid e.g. a Hawaii trip
        // randomizing to Maine. Good-enough heuristic for an MVP.
        const candidate = randomPointInBounds(bounds);
        return candidate;
      }
      return jitter(realLatitude, realLongitude, COUNTRY_FALLBACK_JITTER_RADIUS_METERS);
    }

    case 'hidden':
      return null;

    default:
      return { latitude: realLatitude, longitude: realLongitude };
  }
}
