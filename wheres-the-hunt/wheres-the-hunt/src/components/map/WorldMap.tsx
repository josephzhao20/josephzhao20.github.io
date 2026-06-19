'use client';

import dynamic from 'next/dynamic';
import type { MapPin } from '@/lib/types';

const WorldMapClient = dynamic(() => import('./WorldMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ridge/40">
      <p className="font-display font-bold text-ink-soft">Loading map…</p>
    </div>
  ),
});

export interface WorldMapProps {
  pins: MapPin[];
  heatmapCounts?: Record<string, number> | null;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export function WorldMap(props: WorldMapProps) {
  return <WorldMapClient {...props} />;
}
