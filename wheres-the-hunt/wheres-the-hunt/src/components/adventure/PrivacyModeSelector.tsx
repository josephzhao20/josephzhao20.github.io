'use client';

import type { PrivacyMode } from '@/lib/types/database.types';
import { cn } from '@/lib/utils';

const OPTIONS: { value: PrivacyMode; label: string; description: string }[] = [
  {
    value: 'exact',
    label: 'Exact',
    description: 'Show the real spot on the map.',
  },
  {
    value: 'region',
    label: 'Region',
    description: 'Blur to "somewhere in [state/region]."',
  },
  {
    value: 'country',
    label: 'Country',
    description: 'Blur to "somewhere in [country]."',
  },
  {
    value: 'hidden',
    label: 'Hidden',
    description: 'No pin at all — only visible on your profile.',
  },
];

export function PrivacyModeSelector({
  value,
  onChange,
}: {
  value: PrivacyMode;
  onChange: (mode: PrivacyMode) => void;
}) {
  return (
    <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <legend className="sr-only">Privacy mode</legend>
      {OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'cursor-pointer rounded-trail border-2 border-ink p-3 transition-transform hover:-translate-y-0.5',
            value === opt.value ? 'bg-forest text-cream' : 'bg-white text-ink'
          )}
        >
          <input
            type="radio"
            name="privacy_mode"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <span className="block font-display font-bold">{opt.label}</span>
          <span
            className={cn(
              'mt-1 block text-xs font-semibold leading-snug',
              value === opt.value ? 'text-cream/85' : 'text-ink-soft'
            )}
          >
            {opt.description}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
