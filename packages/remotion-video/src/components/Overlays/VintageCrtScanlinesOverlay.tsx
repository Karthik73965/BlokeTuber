import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const VintageCrtScanlinesOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Subtle rolling sync bar moving down screen
  const rollY = (frame * 3) % (height + 200) - 100;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      {/* 1. Repeating Horizontal CRT Scanline Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.35) 0px, rgba(0, 0, 0, 0.35) 2px, transparent 2px, transparent 4px)',
          opacity: 0.65,
          mixBlendMode: 'overlay',
        }}
      />

      {/* 2. Slow Vertical Rolling VHS / CRT Sync Bar */}
      <div
        style={{
          position: 'absolute',
          top: rollY,
          left: 0,
          right: 0,
          height: 80,
          background:
            'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.08) 50%, transparent)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. CRT Screen Edge Vignette & Phosphor Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(16, 185, 129, 0.1)',
        }}
      />
    </div>
  );
};
