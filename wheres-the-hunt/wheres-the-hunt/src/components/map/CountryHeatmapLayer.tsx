'use client';

import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
import type { Layer, StyleFunction } from 'leaflet';

// Lightweight (~250KB) public domain country-boundary GeoJSON. Fetched
// client-side and cached for the session — no API key, no build-time cost.
const WORLD_GEOJSON_URL =
  'https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson';

interface CountryHeatmapLayerProps {
  /** ISO alpha-2 (or alpha-3, see note below) country code -> adventure count. */
  counts: Record<string, number>;
  baseColor?: string; // CSS color used for the "most active" shade
}

let cachedGeoJson: GeoJSON.FeatureCollection | null = null;

function hexToRgb(hex: string) {
  const m = hex.replace('#', '');
  return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
}

export function CountryHeatmapLayer({ counts, baseColor = '#2E3D33' }: CountryHeatmapLayerProps) {
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(cachedGeoJson);

  useEffect(() => {
    if (cachedGeoJson) return;
    fetch(WORLD_GEOJSON_URL)
      .then((res) => res.json())
      .then((data: GeoJSON.FeatureCollection) => {
        cachedGeoJson = data;
        setGeojson(data);
      })
      .catch(() => {
        /* heatmap is decorative — fail silently and just show no overlay */
      });
  }, []);

  if (!geojson) return null;

  const max = Math.max(1, ...Object.values(counts));
  const [r, g, b] = hexToRgb(baseColor);

  const style: StyleFunction<GeoJsonProperties> = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    // This particular dataset uses ISO_A3 / ISO_A2 properties depending on
    // version; we try a couple of common property names defensively.
    const props = (feature?.properties ?? {}) as Record<string, string>;
    const code: string | undefined =
      props.ISO_A2 || props.iso_a2 || props['ISO3166-1-Alpha-2'] || props.iso2;
    const count = (code && counts[code.toUpperCase()]) || 0;
    const intensity = count / max;

    return {
      fillColor: `rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.55})`,
      fillOpacity: count > 0 ? 1 : 0,
      weight: 0,
      color: 'transparent',
    };
  };

  function onEachFeature(feature: Feature<Geometry>, layer: Layer) {
    const props = (feature.properties ?? {}) as Record<string, string>;
    const code: string | undefined =
      props.ISO_A2 || props.iso_a2 || props['ISO3166-1-Alpha-2'] || props.iso2;
    const name = props.ADMIN || props.name || 'Unknown';
    const count = (code && counts[code.toUpperCase()]) || 0;
    if (count > 0) {
      layer.bindTooltip(`${name}: ${count} stor${count === 1 ? 'y' : 'ies'}`, {
        sticky: true,
      });
    }
  }

  return <GeoJSON data={geojson} style={style} onEachFeature={onEachFeature} />;
}
