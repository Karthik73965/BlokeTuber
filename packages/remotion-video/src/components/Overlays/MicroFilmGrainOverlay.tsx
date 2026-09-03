import React from 'react';
import { useCurrentFrame } from 'remotion';

export const MicroFilmGrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic seed changes every frame to simulate moving silver halide crystals
  const seed = (frame * 7) % 100;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
        mixBlendMode: 'overlay',
        opacity: 0.25,
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <filter id={`grainFilter_${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#grainFilter_${seed})`}
        />
      </svg>
    </div>
  );
};
