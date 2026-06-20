'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { extractFirstGps, extractFirstDate } from '@/lib/exif/extractGps';
import { compressImage } from '@/lib/compressImage';
import { PrivacyModeSelector } from '@/components/adventure/PrivacyModeSelector';
import { LocationPicker } from '@/components/map/LocationPicker';
import { Button } from '@/components/ui/Button';
import type { PrivacyMode } from '@/lib/types/database.types';
import type { GeocodeResult } from '@/lib/types';

interface SelectedPhoto {
  file: File;
  previewUrl: string;
  exifLatitude: number | null;
  exifLongitude: number | null;
}

type LocationSource = 'none' | 'exif' | 'manual';

export function UploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [detecting, setDetecting] = useState(false);

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationSource, setLocationSource] = useState<LocationSource>('none');
  const [geocodeInfo, setGeocodeInfo] = useState<GeocodeResult | null>(null);
  const [resolvingGeocode, setResolvingGeocode] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateVisited, setDateVisited] = useState('');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('exact');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  // ── Priority 1 & 2: a manual pick always wins; otherwise fall back to
  // whatever GPS we pulled from EXIF. Priority 3 (geocoder) happens because
  // the LocationPicker's search box is how a "manual" pick gets made when
  // there's no EXIF to seed it. ──────────────────────────────────────────
  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    const next: SelectedPhoto[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      exifLatitude: null,
      exifLongitude: null,
    }));
    setPhotos((prev) => [...prev, ...next]);

    setDetecting(true);
    const [gps, date] = await Promise.all([extractFirstGps(files), extractFirstDate(files)]);
    setDetecting(false);

    if (gps && locationSource !== 'manual') {
      setLocation(gps);
      setLocationSource('exif');
    }
    if (date && !dateVisited) {
      setDateVisited(date);
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleManualLocationChange(next: { latitude: number; longitude: number }) {
    setLocation(next);
    setLocationSource('manual');
  }

  // Resolve country/region for whatever location is currently active.
  useEffect(() => {
    if (!location) {
      setGeocodeInfo(null);
      return;
    }
    let cancelled = false;
    setResolvingGeocode(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}`);
        if (!cancelled && res.ok) {
          setGeocodeInfo(await res.json());
        } else if (!cancelled) {
          setGeocodeInfo(null);
        }
      } finally {
        if (!cancelled) setResolvingGeocode(false);
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [location]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (photos.length === 0) {
      setError('Add at least one photo.');
      return;
    }
    if (!location) {
      setError('Set a location — search for a place or click the map below.');
      return;
    }

    setSubmitting(true);
    try {
      setProgress(`Uploading photo 1 of ${photos.length}…`);
      const uploaded: { imageUrl: string; exifLatitude: number | null; exifLongitude: number | null }[] = [];

      for (let i = 0; i < photos.length; i++) {
        setProgress(`Uploading photo ${i + 1} of ${photos.length}…`);
        const photo = photos[i];
        const compressed = await compressImage(photo.file);
        const ext = 'jpg';
        const path = `${userId}/${crypto.randomUUID()}/${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('adventure-photos')
          .upload(path, compressed, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`Couldn't upload ${photo.file.name}: ${uploadError.message}`);

        const { data: publicUrl } = supabase.storage.from('adventure-photos').getPublicUrl(path);
        uploaded.push({
          imageUrl: publicUrl.publicUrl,
          exifLatitude: photo.exifLatitude,
          exifLongitude: photo.exifLongitude,
        });
      }

      setProgress('Creating your adventure…');
      const res = await fetch('/api/adventures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          dateVisited: dateVisited || null,
          privacyMode,
          realLatitude: location.latitude,
          realLongitude: location.longitude,
          country: geocodeInfo?.country ?? null,
          countryCode: geocodeInfo?.countryCode ?? null,
          region: geocodeInfo?.region ?? null,
          photos: uploaded,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Could not create the adventure.');

      router.push(`/adventures/${body.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Photos */}
      <section>
        <h2 className="font-display text-lg font-bold text-ink">1. Add photos</h2>
        <p className="mt-1 text-sm font-semibold text-ink-soft">
          We&rsquo;ll check for GPS data in your photos automatically.
        </p>

        <div className="mt-3 grid grid-cols-3 gap-3 sm:flex sm:flex-wrap">
          {photos.map((p, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-trail border-2 border-ink sm:h-24 sm:w-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-cream"
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center rounded-trail border-2 border-dashed border-ink/40 text-xs font-bold text-ink-soft hover:border-ink hover:text-ink sm:h-24 sm:w-24"
          >
            + Add
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </div>
        {detecting && <p className="mt-2 text-xs font-bold text-ink-soft">Scanning for GPS data…</p>}
      </section>

      {/* Title / description */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-bold text-ink">2. Tell the story</h2>
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-bold text-ink">
            Title
          </label>
          <input
            id="title"
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Three days in the Tetons"
            className="w-full rounded-trail border-2 border-ink bg-white px-3 py-2 font-semibold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-bold text-ink">
            Description <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id="description"
            maxLength={2000}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-trail border-2 border-ink bg-white px-3 py-2 font-semibold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="date_visited" className="mb-1 block text-sm font-bold text-ink">
            Date visited <span className="font-normal text-ink-soft">(optional — auto-detected from photo)</span>
          </label>
          <input
            id="date_visited"
            type="date"
            value={dateVisited}
            onChange={(e) => setDateVisited(e.target.value)}
            className="w-full rounded-trail border-2 border-ink bg-white px-3 py-2 font-semibold focus:outline-none sm:w-56"
          />
        </div>
      </section>

      {/* Location */}
      <section>
        <h2 className="font-display text-lg font-bold text-ink">3. Confirm the location</h2>
        <p className="mt-1 text-sm font-semibold text-ink-soft">
          {locationSource === 'exif' && 'Detected from your photo\u2019s GPS data — drag the pin or search to fix it.'}
          {locationSource === 'manual' && 'Using the location you picked.'}
          {locationSource === 'none' && 'No GPS data found — search for the place or click the map.'}
        </p>
        <div className="mt-3">
          <LocationPicker
            latitude={location?.latitude ?? 20}
            longitude={location?.longitude ?? 0}
            onChange={handleManualLocationChange}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-ink-soft">
          {resolvingGeocode
            ? 'Looking up country/region…'
            : geocodeInfo
              ? `📍 ${[geocodeInfo.region, geocodeInfo.country].filter(Boolean).join(', ')}`
              : null}
        </p>
      </section>

      {/* Privacy */}
      <section>
        <h2 className="font-display text-lg font-bold text-ink">4. Choose a privacy mode</h2>
        <div className="mt-3">
          <PrivacyModeSelector value={privacyMode} onChange={setPrivacyMode} />
        </div>
      </section>

      {error && (
        <p role="alert" className="font-bold text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? progress ?? 'Saving…' : 'Publish adventure'}
        </Button>
      </div>
    </form>
  );
}
