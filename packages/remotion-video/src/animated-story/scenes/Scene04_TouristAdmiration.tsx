import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleWhiteHouse, DoodleSparkle, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene04_TouristAdmiration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating heart pulses
  const heartFloat = (offset: number) => Math.sin((frame + offset) * 0.12) * 14;

  return (
    <DoodlePaper cameraZoom={[1.0, 1.06]} cameraPanX={[0, 25]}>
      {/* Background White Villa */}
      <DoodleWhiteHouse x={1350} y={550} scale={2.4} dome={true} />

      {/* Pink Bougainvillea Flower Vine hanging on the wall */}
      <g transform="translate(1080, 280)">
        {/* Vine Stem */}
        <path
          d="M 0 0 Q 80 120 180 80 Q 280 40 380 140"
          fill="none"
          stroke="#15803D"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Pink Flower Clusters */}
        {[
          [30, 20],
          [90, 80],
          [140, 110],
          [200, 75],
          [270, 60],
          [320, 100],
          [370, 135],
        ].map(([fx, fy], idx) => (
          <g key={idx} transform={`translate(${fx}, ${fy})`}>
            <circle cx={-8} cy={-5} r={12} fill="#EC4899" />
            <circle cx={8} cy={-5} r={12} fill="#F43F5E" />
            <circle cx={0} cy={8} r={12} fill="#FB7185" />
            <circle cx={0} cy={0} r={5} fill="#FDE047" />
          </g>
        ))}
      </g>

      {/* Ground Line */}
      <line x1={-100} y1={880} x2={2100} y2={880} stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />

      {/* Tourist Stickman with Smartphone & Heart Eyes */}
      <DoodleStickman
        x={520}
        y={540}
        scale={2.2}
        pose="holding_phone"
        expression="heart_eyes"
      />

      {/* Floating Animated Hearts */}
      {([
        [420, 320, 0, 1.0],
        [580, 280, 25, 1.3],
        [680, 340, 50, 0.9],
      ] as const).map(([hx, hy, offset, scale], idx) => (
        <g
          key={idx}
          transform={`translate(${hx}, ${hy + heartFloat(offset)}) scale(${scale})`}
        >
          <path
            d="M 0 -10 C -15 -25 -30 -15 -30 0 C -30 20 0 35 0 35 C 0 35 30 20 30 0 C 30 -15 15 -25 0 -10 Z"
            fill="#EF4444"
            stroke={DOODLE_STROKE}
            strokeWidth={4}
          />
        </g>
      ))}

      {/* Sparkles on the pristine wall */}
      <DoodleSparkle x={1150} y={480} size={40} delayFrame={5} />
      <DoodleSparkle x={1480} y={380} size={36} delayFrame={15} />

      </DoodlePaper>
  );
};
