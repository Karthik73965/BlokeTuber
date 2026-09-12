import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleSun, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene02_MapJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sequential location pop-ins
  const pinGreece = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 220 } });
  const pinSpain = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 220 } });
  const pinAfrica = spring({ frame: frame - 70, fps, config: { damping: 10, stiffness: 220 } });
  const pinMidEast = spring({ frame: frame - 95, fps, config: { damping: 10, stiffness: 220 } });

  const renderPin = (x: number, y: number, name: string, scale: number, color: string) => {
    if (scale <= 0) return null;
    return (
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {/* Pin Body */}
        <path
          d="M 0 0 C -22 -35 -28 -55 0 -75 C 28 -55 22 -35 0 0 Z"
          fill={color}
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        <circle cx={0} cy={-50} r={10} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={3} />
        {/* Label Badge */}
        <rect
          x={-75}
          y={-125}
          width={150}
          height={42}
          rx={10}
          fill="#FFFFFF"
          stroke={DOODLE_STROKE}
          strokeWidth={4}
        />
        <text
          textAnchor="middle"
          y={-96}
          fontFamily="'Comic Sans MS', cursive"
          fontSize={22}
          fontWeight="bold"
          fill="#18181B"
        >
          {name}
        </text>
      </g>
    );
  };

  return (
    <DoodlePaper cameraZoom={[1.0, 1.06]} cameraPanX={[0, -30]}>
      {/* Hand-drawn Map Container */}
      <g transform="translate(180, 100)">
        {/* Europe / Med Coastline */}
        <path
          d="
            M 150 250
            Q 300 180 500 240
            Q 650 300 780 220
            Q 900 180 1100 230
            Q 1250 260 1350 380
            L 1350 750
            Q 1050 780 750 720
            Q 450 750 200 680
            Z
          "
          fill="#FEF3C7"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
          strokeLinejoin="round"
        />

        {/* Mediterranean Sea Body */}
        <path
          d="
            M 350 380
            Q 550 430 800 360
            Q 1050 320 1200 450
            Q 1050 560 750 540
            Q 500 560 350 480
            Z
          "
          fill="#BAE6FD"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Sea Ripple Waves */}
        <g stroke="#0284C7" strokeWidth={4} fill="none" strokeLinecap="round">
          <path d="M 520 440 Q 550 430 580 440 Q 610 450 640 440" />
          <path d="M 850 410 Q 880 400 910 410 Q 940 420 970 410" />
          <path d="M 680 490 Q 710 480 740 490 Q 770 500 800 490" />
        </g>

        {/* Travel Dashed Route */}
        <path
          d="M 380 340 Q 650 300 860 380 Q 760 620 620 650 Q 950 640 1220 520"
          fill="none"
          stroke="#EF4444"
          strokeWidth={6}
          strokeDasharray="14 10"
        />

        {/* Location Pins */}
        {renderPin(860, 380, 'Greece', pinGreece, '#3B82F6')}
        {renderPin(380, 340, 'S. Spain', pinSpain, '#F59E0B')}
        {renderPin(620, 650, 'N. Africa', pinAfrica, '#10B981')}
        {renderPin(1220, 520, 'Middle East', pinMidEast, '#8B5CF6')}
      </g>

      {/* Sun in Corner */}
      <DoodleSun x={1700} y={160} size={110} />

      {/* Host Stickman */}
      <DoodleStickman
        x={240}
        y={620}
        scale={1.8}
        pose="waving"
        expression="talking"
      />

      </DoodlePaper>
  );
};
