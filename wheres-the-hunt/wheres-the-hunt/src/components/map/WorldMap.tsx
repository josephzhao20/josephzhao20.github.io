'use client';

import dynamic from 'next/dynamic';
import type { MapPin } from '@/lib/types';

const WorldMapClient = dynamic(() => import('./WorldMapClient'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-stone/40" />
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
