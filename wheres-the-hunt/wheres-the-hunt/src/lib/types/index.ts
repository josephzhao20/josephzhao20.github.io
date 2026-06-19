import type { AdventureWithStats } from './database.types';

/** What's actually safe to send to the client for map rendering. */
export interface MapPin {
  id: string;
  title: string;
  coverImageUrl: string | null;
  latitude: number;
  longitude: number;
  locationLabel: string;
  username: string;
  userAvatarUrl: string | null;
  likeCount: number;
  isFeatured: boolean;
}

export function toMapPin(row: AdventureWithStats): MapPin | null {
  // Hidden adventures never produce a pin.
  if (row.privacy_mode === 'hidden') return null;
  if (row.display_latitude == null || row.display_longitude == null) return null;

  return {
    id: row.id,
    title: row.title,
    coverImageUrl: row.cover_image_url,
    latitude: row.display_latitude,
    longitude: row.display_longitude,
    locationLabel: locationLabel(row),
    username: row.username,
    userAvatarUrl: row.user_avatar_url,
    likeCount: row.like_count,
    isFeatured: row.is_featured,
  };
}

export function locationLabel(row: {
  privacy_mode: string;
  country: string | null;
  region: string | null;
}): string {
  switch (row.privacy_mode) {
    case 'exact':
      return [row.region, row.country].filter(Boolean).join(', ') || 'Unknown location';
    case 'region':
      return `Somewhere in ${row.region ?? row.country ?? 'this region'}`;
    case 'country':
      return `Somewhere in ${row.country ?? 'this country'}`;
    case 'hidden':
      return 'Hidden location';
    default:
      return 'Unknown location';
  }
}

export interface GeocodeResult {
  label: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  region: string | null;
}
