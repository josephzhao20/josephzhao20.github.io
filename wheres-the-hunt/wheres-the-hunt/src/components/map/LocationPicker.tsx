'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { GeocodeResult } from '@/lib/types';

const LocationPickerClient = dynamic(() => import('./LocationPickerClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ridge/40">
      <p className="font-display text-sm font-bold text-ink-soft">Loading map…</p>
    </div>
  ),
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (next: { latitude: number; longitude: number }) => void;
}

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data: GeocodeResult[] = await res.json();
      setResults(data);
    } finally {
      setSearching(false);
    }
  }

  function pickResult(r: GeocodeResult) {
    onChange({ latitude: r.latitude, longitude: r.longitude });
    setResults([]);
    setQuery(r.label);
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={runSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a place (e.g. Yosemite National Park)"
          className="flex-1 rounded-trail border-2 border-ink bg-white px-3 py-2 text-sm font-semibold placeholder:text-ink-soft/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-trail border-2 border-ink bg-forest px-4 py-2 text-sm font-bold text-cream shadow-trail disabled:opacity-60"
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <ul className="flex flex-col divide-y divide-ink/10 rounded-trail border-2 border-ink bg-white">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => pickResult(r)}
                className="w-full px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-forest/10"
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="h-72 w-full overflow-hidden rounded-trail border-2 border-ink">
        <LocationPickerClient
          latitude={latitude}
          longitude={longitude}
          onPick={(lat, lng) => onChange({ latitude: lat, longitude: lng })}
        />
      </div>

      <p className="font-mono text-xs text-ink-soft">
        {latitude.toFixed(5)}, {longitude.toFixed(5)} — click the map or drag the pin to fine-tune.
      </p>
    </div>
  );
}
