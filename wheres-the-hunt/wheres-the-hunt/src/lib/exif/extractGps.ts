'use client';

import exifr from 'exifr';

export interface ExifGps {
  latitude: number;
  longitude: number;
}

/**
 * Pulls GPS coordinates out of a photo's EXIF data, if present.
 * Returns null for screenshots, downloaded images, or anything whose EXIF
 * was stripped (e.g. by social media) — the upload flow falls back to
 * geocoding in that case (see LOCATION SYSTEM priority in the upload page).
 */
export async function extractGps(file: File): Promise<ExifGps | null> {
  try {
    const gps = await exifr.gps(file);
    if (!gps || typeof gps.latitude !== 'number' || typeof gps.longitude !== 'number') {
      return null;
    }
    return { latitude: gps.latitude, longitude: gps.longitude };
  } catch {
    // Corrupt EXIF, unsupported format, etc. — treat as "no GPS data."
    return null;
  }
}

/**
 * Extracts GPS from the first file in a batch that actually has it.
 * Used to seed the "detected location" preview in the upload flow.
 */
export async function extractFirstGps(files: File[]): Promise<ExifGps | null> {
  for (const file of files) {
    const gps = await extractGps(file);
    if (gps) return gps;
  }
  return null;
}
