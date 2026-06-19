'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { CountryHeatmapLayer } from './CountryHeatmapLayer';

export default function HeatmapOnlyMapClient({
  counts,
  baseColor,
}: {
  counts: Record<string, number>;
  baseColor?: string;
}) {
  return (
    <MapContainer center={[20, 0]} zoom={1} minZoom={1} className="h-full w-full" worldCopyJump>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CountryHeatmapLayer counts={counts} baseColor={baseColor} />
    </MapContainer>
  );
}
