'use client';

import dynamic from 'next/dynamic';

const HeatmapOnlyMapClient = dynamic(() => import('./HeatmapOnlyMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-stone/40">
      <p className="font-display text-sm font-bold text-ink-soft">Loading heatmap…</p>
    </div>
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
