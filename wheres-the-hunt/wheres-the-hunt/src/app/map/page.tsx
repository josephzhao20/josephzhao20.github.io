import { WorldMap } from '@/components/map/WorldMap';
import { getMapPins, getGlobalHeatmap } from '@/lib/data/adventures';

export const metadata = {
  title: "Stories — Winning With The Hunt",
};

export default async function MapPage() {
  const [pins, heatmap] = await Promise.all([getMapPins(), getGlobalHeatmap()]);

  return (
    <div className="h-[calc(100vh-57px)] w-full">
      <WorldMap pins={pins} heatmapCounts={heatmap} />
    </div>
  );
}
