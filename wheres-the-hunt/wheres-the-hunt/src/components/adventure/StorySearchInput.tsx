'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function StorySearchInput({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSearch() {
    const q = query.trim();
    if (q) {
      router.push(`/map?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/map');
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        placeholder="Search stories by keyword…"
        className="flex-1 rounded-trail border-2 border-ink bg-white px-4 py-2.5 font-semibold text-ink placeholder:text-ink-soft/50 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="rounded-trail border-2 border-ink bg-forest px-5 py-2.5 text-sm font-bold text-cream shadow-trail transition-transform hover:-translate-y-0.5"
      >
        Search
      </button>
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); router.push('/map'); }}
          className="rounded-trail border-2 border-ink bg-cream px-4 py-2.5 text-sm font-bold text-ink-soft hover:text-ink"
        >
          Clear
        </button>
      )}
    </div>
  );
}
