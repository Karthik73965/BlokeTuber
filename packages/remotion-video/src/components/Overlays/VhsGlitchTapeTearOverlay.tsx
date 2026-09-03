import React from 'react';
import { useCurrentFrame } from 'remotion';

export const VhsGlitchTapeTearOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Glitch fires in short bursts every 40-50 frames
  const isGlitchBurst = frame % 45 < 8;
  const jitterOffset = isGlitchBurst ? Math.sin(frame * 2.5) * 8 : 0;
  const barY = (frame * 14) % 1080;

  if (!isGlitchBurst) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
        mixBlendMode: 'screen',
      }}
    >
      {/* 1. Horizontal Tracking Disruption Tear Bar */}
      <div
        style={{
          position: 'absolute',
          top: barY,
          left: 0,
          right: 0,
          height: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          transform: `translateX(${jitterOffset * 2}px)`,
          filter: 'blur(1px)',
        }}
      />

      {/* 2. Secondary Static Noise Band */}
      <div
        style={{
          position: 'absolute',
          top: (barY + 40) % 1080,
          left: 0,
          right: 0,
          height: 8,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 4px, transparent 4px, transparent 8px)',
          opacity: 0.6,
        }}
      />

      {/* 3. RGB Separation Flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          transform: `translateX(${jitterOffset}px)`,
        }}
      />
    </div>
  );
};
