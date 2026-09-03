import React from 'react';

export const ArchivalHalftonePaperOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
        mixBlendMode: 'multiply',
        opacity: 0.35,
      }}
    >
      {/* 1. Fine Halftone Rosette Dot Grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern
            id="halftoneDots"
            x="0"
            y="0"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <circle cx="2" cy="2" r="1" fill="#4B382A" />
            <circle cx="5" cy="5" r="0.75" fill="#3F3F46" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#halftoneDots)" />
      </svg>

      {/* 2. Warm Aged Pulp Paper Fibers */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#F5EFEB',
          opacity: 0.15,
        }}
      />
    </div>
  );
};
