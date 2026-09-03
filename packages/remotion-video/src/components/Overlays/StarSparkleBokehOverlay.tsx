import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const StarSparkleBokehOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Floating star particles that drift upward
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 28; i++) {
      const baseX = ((i * 137.5) % width);
      const baseY = ((i * 243.7) % height);
      const speed = 0.6 + (i % 5) * 0.4;
      const size = 3 + (i % 7) * 2.5;
      const isStar = i % 3 === 0;
      list.push({ baseX, baseY, speed, size, isStar, phase: i * 0.4 });
    }
    return list;
  }, [width, height]);

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
        <defs>
          <radialGradient id="bokehGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D0" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {particles.map((p, idx) => {
          const currentY = (p.baseY - frame * p.speed + height * 5) % height;
          const currentX = p.baseX + Math.sin(frame * 0.04 + p.phase) * 12;
          const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08 + p.phase);

          return p.isStar ? (
            <g
              key={idx}
              transform={`translate(${currentX}, ${currentY}) scale(${0.7 + pulse * 0.5})`}
            >
              {/* 4-point star sparkle */}
              <path
                d="M 0 -8 Q 0 0 -8 0 Q 0 0 0 8 Q 0 0 8 0 Q 0 0 0 -8 Z"
                fill="rgba(254, 240, 138, 0.85)"
              />
              <circle cx={0} cy={0} r={2} fill="#FFFFFF" />
            </g>
          ) : (
            <circle
              key={idx}
              cx={currentX}
              cy={currentY}
              r={p.size * (0.8 + pulse * 0.4)}
              fill="url(#bokehGlow)"
            />
          );
        })}
      </svg>
    </div>
  );
};
