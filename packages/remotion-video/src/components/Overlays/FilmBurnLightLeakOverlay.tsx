import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const FilmBurnLightLeakOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Cycle a burn every 60 frames or at cut entry/exit
  const cycleFrame = frame % 75;
  const burnIntensity = interpolate(
    cycleFrame,
    [0, 10, 22, 35, 75],
    [0.1, 0.85, 0.4, 0.05, 0.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const leakX = interpolate(cycleFrame, [0, 75], [-10, 40]);
  const leakY = interpolate(cycleFrame, [0, 75], [10, -20]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
        mixBlendMode: 'screen',
        opacity: burnIntensity,
      }}
    >
      {/* Primary Warm Amber / Crimson Edge Light Leak */}
      <div
        style={{
          position: 'absolute',
          top: `${leakY}%`,
          left: `${leakX}%`,
          width: '70%',
          height: '110%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(255, 180, 50, 0.9) 0%, rgba(239, 68, 68, 0.6) 40%, rgba(185, 28, 28, 0.2) 70%, transparent 100%)',
          filter: 'blur(60px)',
          transform: `scale(${1 + burnIntensity * 0.3}) rotate(-12deg)`,
        }}
      />

      {/* Secondary Orange Corner Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50%',
          height: '60%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.7) 0%, rgba(217, 119, 6, 0.4) 50%, transparent 100%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
};
