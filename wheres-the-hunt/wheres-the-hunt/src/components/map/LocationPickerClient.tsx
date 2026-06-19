'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import { createPickerIcon } from './markerIcons';

interface LocationPickerClientProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  onPick: (lat: number, lng: number) => void;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Pans the map whenever the picked coordinates change from outside (e.g. a search result). */
function Recenter({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);
  return null;
}

export default function LocationPickerClient({
  latitude,
  longitude,
  zoom = 5,
  onPick,
}: LocationPickerClientProps) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={zoom} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[latitude, longitude]}
        icon={createPickerIcon()}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const pos = e.target.getLatLng();
            onPick(pos.lat, pos.lng);
          },
        }}
      />
      <ClickHandler onPick={onPick} />
      <Recenter latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
}
