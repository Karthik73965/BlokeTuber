import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const RainLensStreaksOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Fast diagonal falling rain streaks
  const rainStreaks = useMemo(() => {
    const list = [];
    for (let i = 0; i < 40; i++) {
      const x = ((i * 47.9) % width);
      const y = ((i * 83.3) % height);
      const length = 40 + (i % 6) * 15;
      const speed = 25 + (i % 5) * 8;
      const opacity = 0.2 + (i % 4) * 0.15;
      list.push({ x, y, length, speed, opacity });
    }
    return list;
  }, [width, height]);

  // Out of focus glass droplets
  const droplets = useMemo(() => {
    const list = [];
    for (let i = 0; i < 14; i++) {
      const dx = (i * 149) % width;
      const dy = (i * 211) % height;
      const r = 4 + (i % 5) * 3;
      list.push({ dx, dy, r });
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
          <radialGradient id="dropletGlow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Diagonal Falling Rain Streaks (-15 deg angle) */}
        {rainStreaks.map((r, idx) => {
          const currentY = (r.y + frame * r.speed) % (height + 100) - 50;
          const currentX = (r.x - (frame * r.speed * 0.25)) % (width + 100);

          return (
            <line
              key={idx}
              x1={currentX}
              y1={currentY}
              x2={currentX - r.length * 0.25}
              y2={currentY + r.length}
              stroke={`rgba(224, 242, 254, ${r.opacity})`}
              strokeWidth="1.2"
            />
          );
        })}

        {/* Static Bokeh Glass Droplets */}
        {droplets.map((d, idx) => (
          <circle
            key={`drop_${idx}`}
            cx={d.dx}
            cy={d.dy}
            r={d.r}
            fill="url(#dropletGlow)"
            style={{ filter: 'blur(1px)' }}
          />
        ))}
      </svg>
    </div>
  );
};
