'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useEffect, useState } from 'react';
import type { MapPin } from '@/lib/types';
import { createAdventureIcon, createClusterIcon } from './markerIcons';
import { AdventurePopupCard } from './AdventurePopupCard';
import { CountryHeatmapLayer } from './CountryHeatmapLayer';

interface WorldMapClientProps {
  pins: MapPin[];
  heatmapCounts?: Record<string, number> | null;
  initialCenter?: [number, number];
  initialZoom?: number;
}

function FitToPins({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    const bounds = pins.map((p) => [p.latitude, p.longitude] as [number, number]);
    if (bounds.length === 1) {
      map.setView(bounds[0], 6);
    } else {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    }
    // Only run once on mount — we don't want every pin update to yank the
    // viewport away from someone who's already panned around.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function WorldMapClient({
  pins,
  heatmapCounts,
  initialCenter = [20, 0],
  initialZoom = 2,
}: WorldMapClientProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);

  return (
    <div className="relative h-full w-full">
      {heatmapCounts && (
        <button
          onClick={() => setShowHeatmap((v) => !v)}
          className="absolute right-3 top-3 z-[1000] rounded-trail border-2 border-ink bg-cream px-3 py-1.5 text-sm font-bold shadow-trail"
        >
          {showHeatmap ? 'Hide heatmap' : 'Show heatmap'}
        </button>
      )}

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        minZoom={2}
        worldCopyJump
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showHeatmap && heatmapCounts && <CountryHeatmapLayer counts={heatmapCounts} />}

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster: { getChildCount: () => number }) =>
            createClusterIcon(cluster.getChildCount())
          }
        >
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.latitude, pin.longitude]}
              icon={createAdventureIcon({ featured: pin.isFeatured })}
            >
              <Popup>
                <AdventurePopupCard pin={pin} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <FitToPins pins={pins} />
      </MapContainer>
    </div>
  );
}
