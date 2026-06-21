'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationPicker } from '@/components/map/LocationPicker';
import { PrivacyModeSelector } from '@/components/adventure/PrivacyModeSelector';
import { Button } from '@/components/ui/Button';
import type { AdventureWithStats } from '@/lib/types/database.types';
import type { GeocodeResult } from '@/lib/types';
import type { PrivacyMode } from '@/lib/types/database.types';

export function AdventureActions({ adventure }: { adventure: AdventureWithStats }) {
  const router = useRouter();
  const [mode, setMode] = useState<'idle' | 'edit' | 'confirmDelete'>('idle');

  const [title, setTitle] = useState(adventure.title);
  const [description, setDescription] = useState(adventure.description ?? '');
  const [dateVisited, setDateVisited] = useState(adventure.date_visited ?? '');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>(adventure.privacy_mode);
  const [location, setLocation] = useState({
    latitude: adventure.real_latitude,
    longitude: adventure.real_longitude,
  });
  const [geocodeInfo, setGeocodeInfo] = useState<GeocodeResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLocationChange(next: { latitude: number; longitude: number }) {
    setLocation(next);
    try {
      const res = await fetch(`/api/geocode/reverse?lat=${next.latitude}&lon=${next.longitude}`);
      if (res.ok) setGeocodeInfo(await res.json());
    } catch {
      // non-fatal
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/adventures/${adventure.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          dateVisited: dateVisited || null,
          privacyMode,
          realLatitude: location.latitude,
          realLongitude: location.longitude,
          country: geocodeInfo?.country ?? adventure.country,
          countryCode: geocodeInfo?.countryCode ?? adventure.country_code,
          region: geocodeInfo?.region ?? adventure.region,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Could not save.');
      }
      setMode('idle');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/adventures/${adventure.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Could not delete.');
      }
      router.push('/map');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setDeleting(false);
    }
  }

  if (mode === 'confirmDelete') {
    return (
      <div className="mt-8 rounded-trail border-2 border-ink bg-red-50 p-5">
        <p className="font-display font-bold text-ink">Delete this adventure?</p>
        <p className="mt-1 text-sm font-semibold text-ink-soft">This can&rsquo;t be undone.</p>
        {error && <p className="mt-2 text-sm font-bold text-red-700">{error}</p>}
        <div className="mt-4 flex gap-3">
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Yes, delete it'}
          </Button>
          <Button variant="ghost" onClick={() => setMode('idle')} disabled={deleting}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <div className="mt-8 flex flex-col gap-6 rounded-trail border-2 border-ink p-5">
        <h2 className="font-display text-lg font-bold text-ink">Edit adventure</h2>

        <div>
          <label className="mb-1 block text-sm font-bold text-ink">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="w-full rounded-trail border-2 border-ink bg-white px-3 py-2 font-semibold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-ink">
            Description <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            className="w-full rounded-trail border-2 border-ink bg-white px-3 py-2 font-semibold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-ink">
            Date visited <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <input
            type="date"
            value={dateVisited}
            onChange={(e) => setDateVisited(e.target.value)}
            className="w-full rounded-trail border-2 border-ink bg-white px-3 py-2 font-semibold focus:outline-none sm:w-56"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-ink">Location</label>
          <LocationPicker
            latitude={location.latitude}
            longitude={location.longitude}
            onChange={handleLocationChange}
          />
          {geocodeInfo && (
            <p className="mt-2 text-sm font-bold text-ink-soft">
              📍 {[geocodeInfo.region, geocodeInfo.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-ink">Privacy mode</label>
          <PrivacyModeSelector value={privacyMode} onChange={setPrivacyMode} />
        </div>

        {error && <p className="text-sm font-bold text-red-700">{error}</p>}

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          <Button variant="ghost" onClick={() => setMode('idle')} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex gap-3">
      <Button variant="ghost" size="sm" onClick={() => setMode('edit')}>
        Edit
      </Button>
      <Button variant="danger" size="sm" onClick={() => setMode('confirmDelete')}>
        Delete
      </Button>
    </div>
  );
}
