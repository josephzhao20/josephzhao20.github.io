import L from 'leaflet';

/**
 * A compass-pin shape instead of Leaflet's generic red teardrop — the brief
 * is explicit that markers should feel "nature / compass themed," not like
 * a map-pin clip-art default.
 */
function compassPinSvg(fill: string, featured: boolean) {
  return `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1 C7.6 1 1 8 1 16.5 C1 27 17 43 17 43 C17 43 33 27 33 16.5 C33 8 26.4 1 17 1 Z"
            fill="${fill}" stroke="#1C1A17" stroke-width="2.5"/>
      <circle cx="17" cy="16.5" r="9.5" fill="#FAF3E7" stroke="#1C1A17" stroke-width="1.5"/>
      <path d="M17 9 L20 16 L17 24 L14 16 Z" fill="${featured ? '#E2672A' : '#1C1A17'}"/>
    </svg>
  `;
}

export function createAdventureIcon(opts: { featured?: boolean } = {}) {
  const fill = opts.featured ? '#E2672A' : '#2F5233';
  return L.divIcon({
    html: compassPinSvg(fill, !!opts.featured),
    className: 'adventure-marker-icon',
    iconSize: [34, 44],
    iconAnchor: [17, 43],
    popupAnchor: [0, -38],
  });
}

/** Single draggable pin used in the upload flow's location picker. */
export function createPickerIcon() {
  return L.divIcon({
    html: compassPinSvg('#9B72CF', false),
    className: 'adventure-marker-icon',
    iconSize: [34, 44],
    iconAnchor: [17, 43],
    popupAnchor: [0, -38],
  });
}

export function createClusterIcon(count: number) {
  const size = count < 10 ? 38 : count < 50 ? 46 : 54;
  return L.divIcon({
    html: `<div class="marker-cluster-custom" style="width:${size}px;height:${size}px;">${count}</div>`,
    className: '',
    iconSize: [size, size],
  });
}
