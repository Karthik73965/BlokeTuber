import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const FilmDustScratchesOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Pseudo-random deterministic noise based on frame
  const seed = (frame * 17 + 23) % 1000;

  // Generate 12 animated dust particles that jump every 2 frames
  const particles = useMemo(() => {
    const cycle = Math.floor(frame / 2);
    const list = [];
    for (let i = 0; i < 16; i++) {
      const pSeed = (cycle * 13 + i * 37) % 1000;
      const x = (pSeed * 19.3) % width;
      const y = (pSeed * 47.7) % height;
      const size = 1.2 + (pSeed % 3.5);
      const opacity = 0.25 + ((pSeed % 60) / 100);
      const isHair = i % 5 === 0;
      list.push({ x, y, size, opacity, isHair, angle: (pSeed * 11) % 360 });
    }
    return list;
  }, [frame, width, height]);

  // Occasional vertical scratch lines that flash for 1-2 frames
  const scratchActive = seed % 7 === 0;
  const scratchX = (seed * 83) % width;

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
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Dust specks and hairs */}
        {particles.map((p, idx) =>
          p.isHair ? (
            <path
              key={idx}
              d={`M ${p.x} ${p.y} Q ${p.x + 8} ${p.y + 12}, ${p.x + 16} ${p.y + 4}`}
              stroke={`rgba(255, 255, 255, ${p.opacity * 0.7})`}
              strokeWidth="0.8"
              fill="none"
              transform={`rotate(${p.angle} ${p.x} ${p.y})`}
            />
          ) : (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill={`rgba(255, 255, 255, ${p.opacity})`}
            />
          )
        )}

        {/* Vertical scratch line */}
        {scratchActive && (
          <line
            x1={scratchX}
            y1={0}
            x2={scratchX + 1}
            y2={height}
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="0.6"
            strokeDasharray="40 10 90 20"
          />
        )}
      </svg>
    </div>
  );
};
