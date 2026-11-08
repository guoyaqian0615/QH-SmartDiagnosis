/**
 * 宣纸肌理：极薄纤维噪点 + 柔光叠化，削弱屏幕塑料感。
 */
export function FilmGrain() {
  return (
    <div
      className="paper-grain-stack pointer-events-none fixed inset-0 z-[140] overflow-hidden"
      aria-hidden
    >
      <div
        className="paper-grain-fiber absolute inset-0 opacity-[var(--paper-fiber-opacity,0.028)] mix-blend-multiply"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(42, 48, 44, 0.04) 2px,
            rgba(42, 48, 44, 0.04) 3px
          )`,
        }}
      />
      <div
        className="paper-grain-fiber absolute inset-0 opacity-[var(--paper-fiber-opacity,0.022)] mix-blend-multiply"
        style={{
          backgroundImage: `repeating-linear-gradient(
            88deg,
            transparent,
            transparent 3px,
            rgba(38, 44, 40, 0.03) 3px,
            rgba(38, 44, 40, 0.03) 4px
          )`,
        }}
      />
      <svg
        className="paper-grain-noise absolute inset-0 h-full w-full opacity-[var(--paper-noise-opacity,0.022)] mix-blend-normal"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="dbcnet-paper-grain-coarse"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.52"
              numOctaves="4"
              seed="42"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.88 0"
              result="mono"
            />
          </filter>
          <filter
            id="dbcnet-paper-grain-fine"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.15"
              numOctaves="3"
              seed="17"
              stitchTiles="stitch"
              result="noise2"
            />
            <feColorMatrix
              in="noise2"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
              result="mono2"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#dbcnet-paper-grain-coarse)" />
        <rect width="100%" height="100%" filter="url(#dbcnet-paper-grain-fine)" />
      </svg>
    </div>
  );
}
