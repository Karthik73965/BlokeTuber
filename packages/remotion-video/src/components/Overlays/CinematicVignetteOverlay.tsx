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
        background: `radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0, 0, 0, ${0.2 + breathing * 0.08}) 85%, rgba(0, 0, 0, 0.5) 100%)`,
        mixBlendMode: 'multiply',
      }}
    />
  );
};
