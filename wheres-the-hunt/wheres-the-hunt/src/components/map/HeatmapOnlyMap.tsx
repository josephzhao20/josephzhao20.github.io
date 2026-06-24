'use client';

import dynamic from 'next/dynamic';

const HeatmapOnlyMapClient = dynamic(() => import('./HeatmapOnlyMapClient'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-stone/40" />
  ),
});

export function HeatmapOnlyMap({
  counts,
  baseColor,
}: {
  counts: Record<string, number>;
  baseColor?: string;
}) {
  return <HeatmapOnlyMapClient counts={counts} baseColor={baseColor} />;
}
