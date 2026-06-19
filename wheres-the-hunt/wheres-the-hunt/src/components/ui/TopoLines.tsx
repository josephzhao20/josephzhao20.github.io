/**
 * The site's one signature visual motif: nested topographic contour lines,
 * the way a USGS quad map renders a hill. Used sparingly — once big and
 * quiet behind the hero, once as a thin divider between sections — so it
 * reads as "this is a map-of-real-places product" without turning into
 * generic decoration.
 */
export function TopoLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M300 40
           C 420 40, 520 110, 540 220
           C 558 318, 500 410, 420 470
           C 340 528, 220 540, 140 480
           C 60 420, 40 300, 80 200
           C 118 106, 198 40, 300 40 Z"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="2.5"
      />
      <path
        d="M300 95
           C 400 95, 480 155, 495 240
           C 510 320, 462 392, 396 438
           C 330 484, 232 492, 168 444
           C 104 396, 90 300, 120 218
           C 150 138, 212 95, 300 95 Z"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2.5"
      />
      <path
        d="M298 150
           C 374 150, 436 198, 448 262
           C 460 324, 422 380, 368 414
           C 314 448, 240 454, 190 416
           C 140 378, 130 304, 154 240
           C 178 178, 230 150, 298 150 Z"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="2.5"
      />
      <path
        d="M296 206
           C 350 206, 394 240, 402 286
           C 410 330, 382 368, 342 390
           C 302 412, 250 416, 214 388
           C 178 360, 172 308, 190 264
           C 208 220, 248 206, 296 206 Z"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="2.5"
      />
      <circle cx="298" cy="296" r="6" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/** A single contour line used as a section divider instead of a plain <hr>. */
export function TopoDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 20 C 80 4, 160 36, 240 20 S 400 4, 480 20
           S 640 36, 720 20 S 880 4, 960 20 S 1120 36, 1200 20"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  );
}
