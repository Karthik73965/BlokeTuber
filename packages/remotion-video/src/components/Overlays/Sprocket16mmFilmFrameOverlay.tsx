import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const Sprocket16mmFilmFrameOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Subtle film jitter (vertical weave)
  const jitterY = Math.sin(frame * 0.4) * 1.5;

  const sprockets = [0.1, 0.3, 0.5, 0.7, 0.9];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
        transform: `translateY(${jitterY}px)`,
      }}
    >
      {/* ── LEFT SPROCKET FILM BORDER ────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 70,
          backgroundColor: '#0D0D11',
          borderRight: '2px solid #1E1E24',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '10px 0',
        }}
      >
        {sprockets.map((pos, idx) => (
          <div
            key={idx}
            style={{
              width: 32,
              height: 24,
              backgroundColor: '#000000',
              border: '1px solid #27272A',
              borderRadius: 4,
              boxShadow: 'inset 0 0 6px rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>

      {/* ── RIGHT SPROCKET FILM BORDER ───────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 70,
          backgroundColor: '#0D0D11',
          borderLeft: '2px solid #1E1E24',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '10px 0',
        }}
      >
        {sprockets.map((pos, idx) => (
          <div
            key={idx}
            style={{
              width: 32,
              height: 24,
              backgroundColor: '#000000',
              border: '1px solid #27272A',
              borderRadius: 4,
              boxShadow: 'inset 0 0 6px rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>

      {/* Film Strip Kodak Edge Stamp */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 12,
          transform: 'rotate(-90deg) translateX(-50%)',
          transformOrigin: 'left top',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: '0.25em',
          color: '#EAB308',
          whiteSpace: 'nowrap',
          opacity: 0.8,
        }}
      >
        EASTMAN 5219 • 35MM SAFETY FILM • [24A]
      </div>
    </div>
  );
};
