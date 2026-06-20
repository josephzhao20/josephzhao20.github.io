'use client';

import exifr from 'exifr';

export interface ExifGps {
  latitude: number;
  longitude: number;
}

export interface ExifData {
  gps: ExifGps | null;
  /** ISO date string (YYYY-MM-DD) from DateTimeOriginal, or null if missing. */
  dateVisited: string | null;
}

export async function extractExif(file: File): Promise<ExifData> {
  try {
    const data = await exifr.parse(file, { gps: true, pick: ['DateTimeOriginal', 'CreateDate'] });
    const raw: Date | undefined = data?.DateTimeOriginal ?? data?.CreateDate;
    const dateVisited = raw instanceof Date && !isNaN(raw.getTime())
      ? raw.toISOString().slice(0, 10)
      : null;

    const gpsData = await exifr.gps(file).catch(() => null);
    const gps =
      gpsData && typeof gpsData.latitude === 'number' && typeof gpsData.longitude === 'number'
        ? { latitude: gpsData.latitude, longitude: gpsData.longitude }
        : null;

    return { gps, dateVisited };
  } catch {
    return { gps: null, dateVisited: null };
  }
}

/** Extracts GPS from the first file in a batch that has it. */
export async function extractFirstGps(files: File[]): Promise<ExifGps | null> {
  for (const file of files) {
    const { gps } = await extractExif(file);
    if (gps) return gps;
  }
  return null;
}

/** Extracts the earliest date across a batch of files. */
export async function extractFirstDate(files: File[]): Promise<string | null> {
  for (const file of files) {
    const { dateVisited } = await extractExif(file);
    if (dateVisited) return dateVisited;
  }
  return null;
}
