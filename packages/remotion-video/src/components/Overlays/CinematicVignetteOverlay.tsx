import React from 'react';
import { useCurrentFrame } from 'remotion';

export const CinematicVignetteOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle organic lens breathing (oscillation)
  const breathing = 0.5 + 0.05 * Math.sin(frame * 0.05);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
        background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0, 0, 0, ${0.55 + breathing * 0.15}) 80%, rgba(0, 0, 0, 0.95) 100%)`,
        mixBlendMode: 'multiply',
      }}
    />
  );
};
