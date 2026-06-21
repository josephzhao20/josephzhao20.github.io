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

function parseExifDate(value: unknown): string | null {
  if (!value) return null;

  // exifr may return a real Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    // Use local date parts to avoid UTC offset shifting the day
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // exifr may return the raw EXIF string: "2023:06:15 14:30:00"
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4}):(\d{2}):(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return null;
}

export async function extractExif(file: File): Promise<ExifData> {
  try {
    // Parse all standard EXIF blocks so DateTimeOriginal / CreateDate are reachable
    const data = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
    }).catch(() => null);

    const dateVisited =
      parseExifDate(data?.DateTimeOriginal) ??
      parseExifDate(data?.CreateDate) ??
      parseExifDate(data?.DateTime) ??
      null;

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

/** Extracts the date from the first file in a batch that has it. */
export async function extractFirstDate(files: File[]): Promise<string | null> {
  for (const file of files) {
    const { dateVisited } = await extractExif(file);
    if (dateVisited) return dateVisited;
  }
  return null;
}
