import React from 'react';
import { useCurrentFrame } from 'remotion';

export const ChromaticAberrationOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle pulsing shift on lens edges
  const shift = 2 + Math.sin(frame * 0.08) * 1.5;

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
      {/* Cyan edge fringe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${shift}px solid rgba(6, 182, 212, 0.45)`,
          mixBlendMode: 'screen',
          filter: 'blur(3px)',
        }}
      />

      {/* Red/Crimson opposite edge fringe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${shift * 0.8}px solid rgba(239, 68, 68, 0.45)`,
          transform: 'translate(1px, -1px)',
          mixBlendMode: 'screen',
          filter: 'blur(3px)',
        }}
      />

      {/* Radial soft edge dispersion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 70%, rgba(239, 68, 68, 0.15) 90%, rgba(6, 182, 212, 0.25) 100%)',
          mixBlendMode: 'color-dodge',
        }}
      />
    </div>
  );
};
