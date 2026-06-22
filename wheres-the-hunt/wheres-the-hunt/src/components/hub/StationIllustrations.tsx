// Station SVG illustrations — continuous-line / topographic linework style,
// consistent with TopoLines.tsx. Ink on parchment, no flat fills.

const STROKE = { stroke: 'currentColor', strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const STROKE_THIN = { ...STROKE, strokeWidth: 1.5, strokeOpacity: 0.5 };
const FILL_PARCHMENT = { fill: '#F6F1E7', stroke: 'currentColor', strokeWidth: 2 };

export function SignpostIllustration() {
  return (
    <svg viewBox="0 0 180 260" aria-hidden="true" className="w-full h-full">
      {/* Post */}
      <line x1="90" y1="20" x2="90" y2="230" {...STROKE} />
      {/* Ground mound */}
      <path d="M55,230 C65,220 80,218 90,220 C100,218 115,220 125,230" {...STROKE} />
      {/* Upper sign board */}
      <rect x="16" y="38" width="110" height="32" rx="3" {...FILL_PARCHMENT} />
      <path d="M126,38 L140,54 L126,70" {...STROKE} />
      {/* Sign text rule lines */}
      <line x1="26" y1="52" x2="116" y2="52" {...STROKE_THIN} />
      {/* Lower sign board */}
      <rect x="22" y="88" width="100" height="28" rx="3" {...FILL_PARCHMENT} />
      <path d="M14,88 L22,102 L14,116" {...{ ...STROKE, strokeWidth: 1.5 }} />
      <line x1="30" y1="102" x2="112" y2="102" {...STROKE_THIN} />
      {/* Third sign */}
      <rect x="20" y="132" width="105" height="26" rx="3" {...FILL_PARCHMENT} />
      <path d="M125,132 L138,145 L125,158" {...STROKE} />
      <line x1="30" y1="145" x2="115" y2="145" {...STROKE_THIN} />
      {/* Wood grain on post */}
      <line x1="87" y1="180" x2="93" y2="190" {...STROKE_THIN} />
      <line x1="87" y1="195" x2="93" y2="205" {...STROKE_THIN} />
      {/* Label */}
      <text x="90" y="255" textAnchor="middle" className="font-display" fontSize="11" fill="currentColor" fontFamily="serif" letterSpacing="2" opacity={0.7}>MISSION</text>
    </svg>
  );
}

export function TelescopeIllustration() {
  return (
    <svg viewBox="0 0 180 260" aria-hidden="true" className="w-full h-full">
      {/* Telescope barrel — angled upward-left */}
      <path d="M110,60 L60,90 L55,100 L115,70 Z" {...FILL_PARCHMENT} />
      {/* Eyepiece end */}
      <ellipse cx="110" cy="65" rx="6" ry="9" transform="rotate(-20,110,65)" {...FILL_PARCHMENT} />
      {/* Objective lens end */}
      <ellipse cx="57" cy="95" rx="9" ry="6" transform="rotate(-20,57,95)" {...FILL_PARCHMENT} />
      {/* Tripod pivot */}
      <circle cx="88" cy="83" r="4" {...FILL_PARCHMENT} />
      {/* Tripod legs */}
      <line x1="88" y1="87" x2="65" y2="180" {...STROKE} />
      <line x1="88" y1="87" x2="90" y2="182" {...STROKE} />
      <line x1="88" y1="87" x2="113" y2="178" {...STROKE} />
      {/* Tripod foot spreader */}
      <path d="M68,175 C80,172 100,172 111,175" {...STROKE} />
      {/* Camp table */}
      <rect x="100" y="155" width="60" height="7" rx="2" {...FILL_PARCHMENT} />
      <line x1="105" y1="162" x2="102" y2="190" {...STROKE} />
      <line x1="155" y1="162" x2="158" y2="190" {...STROKE} />
      {/* Table cross-brace */}
      <line x1="104" y1="180" x2="157" y2="165" {...STROKE_THIN} />
      {/* Stacked journals on table */}
      <rect x="108" y="140" width="44" height="9" rx="2" {...FILL_PARCHMENT} />
      <rect x="110" y="131" width="40" height="9" rx="2" {...FILL_PARCHMENT} />
      <rect x="112" y="123" width="36" height="8" rx="2" {...FILL_PARCHMENT} />
      {/* Journal spine lines */}
      <line x1="108" y1="144" x2="152" y2="144" {...STROKE_THIN} />
      <line x1="110" y1="135" x2="150" y2="135" {...STROKE_THIN} />
      {/* Ground */}
      <path d="M40,230 C70,222 120,222 150,230" {...STROKE} />
      {/* Label */}
      <text x="90" y="255" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="serif" letterSpacing="1.5" opacity={0.7}>EXPLORE STORIES</text>
    </svg>
  );
}

export function MapStandIllustration() {
  return (
    <svg viewBox="0 0 180 260" aria-hidden="true" className="w-full h-full">
      {/* Easel vertical post */}
      <line x1="90" y1="15" x2="90" y2="190" {...STROKE} />
      {/* Easel side legs */}
      <line x1="88" y1="40" x2="55" y2="190" {...STROKE} />
      <line x1="92" y1="40" x2="125" y2="190" {...STROKE} />
      {/* Leg spreader */}
      <line x1="62" y1="160" x2="118" y2="160" {...STROKE} />
      {/* Map frame */}
      <rect x="32" y="20" width="116" height="145" rx="4" {...FILL_PARCHMENT} />
      {/* Map topo contours inside */}
      <path d="M50,80 C65,70 80,75 100,72 C118,69 132,76 148,80" {...STROKE_THIN} />
      <path d="M45,100 C60,88 78,94 98,90 C118,86 136,95 148,100" {...STROKE_THIN} />
      <path d="M42,120 C58,108 76,114 96,110 C116,106 134,116 148,122" {...STROKE_THIN} />
      <path d="M44,140 C62,130 80,136 100,132 C120,128 136,136 145,142" {...STROKE_THIN} />
      {/* Ridge line */}
      <path d="M55,95 C70,78 90,72 110,78 C126,84 136,95 140,108" {...{ ...STROKE, strokeWidth: 1.8, strokeOpacity: 0.7 }} />
      {/* Map pins */}
      <circle cx="72" cy="92" r="4" fill="#C9602E" stroke="currentColor" strokeWidth={1.5} />
      <line x1="72" y1="96" x2="72" y2="106" {...{ ...STROKE, strokeWidth: 1.5 }} />
      <circle cx="105" cy="78" r="4" fill="#3D5445" stroke="currentColor" strokeWidth={1.5} />
      <line x1="105" y1="82" x2="105" y2="92" {...{ ...STROKE, strokeWidth: 1.5 }} />
      <circle cx="128" cy="100" r="3" fill="#7A5C3E" stroke="currentColor" strokeWidth={1.5} />
      <line x1="128" y1="103" x2="128" y2="112" {...{ ...STROKE, strokeWidth: 1.5 }} />
      {/* Compass rose on map */}
      <circle cx="140" cy="40" r="10" {...STROKE_THIN} />
      <line x1="140" y1="30" x2="140" y2="50" {...STROKE_THIN} />
      <line x1="130" y1="40" x2="150" y2="40" {...STROKE_THIN} />
      <text x="140" y="29" textAnchor="middle" fontSize="6" fill="currentColor" opacity={0.6}>N</text>
      {/* Ground */}
      <path d="M40,228 C65,220 115,220 140,228" {...STROKE} />
      {/* Label */}
      <text x="90" y="255" textAnchor="middle" fontSize="11" fill="currentColor" fontFamily="serif" letterSpacing="2" opacity={0.7}>THE MAP</text>
    </svg>
  );
}

export function LodgeIllustration() {
  return (
    <svg viewBox="0 0 180 260" aria-hidden="true" className="w-full h-full">
      {/* Cabin walls */}
      <rect x="20" y="130" width="140" height="90" {...FILL_PARCHMENT} />
      {/* Roof */}
      <path d="M10,130 L90,55 L170,130 Z" {...FILL_PARCHMENT} />
      {/* Roof shingles */}
      <line x1="30" y1="110" x2="150" y2="110" {...STROKE_THIN} />
      <line x1="20" y1="123" x2="160" y2="123" {...STROKE_THIN} />
      <line x1="38" y1="97" x2="142" y2="97" {...STROKE_THIN} />
      <line x1="50" y1="85" x2="130" y2="85" {...STROKE_THIN} />
      <line x1="63" y1="73" x2="117" y2="73" {...STROKE_THIN} />
      {/* Ridge cap */}
      <line x1="90" y1="55" x2="90" y2="75" {...STROKE} />
      {/* Left window */}
      <rect x="30" y="148" width="36" height="32" rx="2" {...FILL_PARCHMENT} />
      <line x1="48" y1="148" x2="48" y2="180" {...STROKE} />
      <line x1="30" y1="164" x2="66" y2="164" {...STROKE} />
      {/* Right window */}
      <rect x="114" y="148" width="36" height="32" rx="2" {...FILL_PARCHMENT} />
      <line x1="132" y1="148" x2="132" y2="180" {...STROKE} />
      <line x1="114" y1="164" x2="150" y2="164" {...STROKE} />
      {/* Door */}
      <rect x="72" y="168" width="36" height="52" rx="3" {...FILL_PARCHMENT} />
      <circle cx="103" cy="194" r="2.5" fill="currentColor" opacity={0.6} />
      {/* Shop sign hanging from roof eave */}
      <line x1="55" y1="130" x2="55" y2="118" {...STROKE_THIN} />
      <line x1="125" y1="130" x2="125" y2="118" {...STROKE_THIN} />
      <rect x="45" y="105" width="90" height="20" rx="3" {...FILL_PARCHMENT} />
      <text x="90" y="119" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="serif" letterSpacing="1" opacity={0.8}>THE LODGE</text>
      {/* Chimney */}
      <rect x="115" y="58" width="16" height="28" {...FILL_PARCHMENT} />
      {/* Smoke wisps */}
      <path d="M123,58 C120,50 126,44 122,36" {...STROKE_THIN} />
      <path d="M119,56 C116,48 122,42 118,34" {...STROKE_THIN} />
      {/* Ground */}
      <path d="M10,228 C50,220 130,220 170,228" {...STROKE} />
      {/* Label */}
      <text x="90" y="255" textAnchor="middle" fontSize="11" fill="currentColor" fontFamily="serif" letterSpacing="2" opacity={0.7}>THE LODGE</text>
    </svg>
  );
}
