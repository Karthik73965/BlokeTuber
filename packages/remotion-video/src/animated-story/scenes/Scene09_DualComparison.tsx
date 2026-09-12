import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleThermometer, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene09_DualComparison: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <DoodlePaper cameraZoom={[1.0, 1.05]} cameraPanX={[0, 0]}>
      {/* Center Dividing Line */}
      <line
        x1={960}
        y1={120}
        x2={960}
        y2={920}
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
        strokeDasharray="18 12"
      />

      {/* Center "VS" Badge */}
      <g transform="translate(960, 480)">
        <circle cx={0} cy={0} r={55} fill="#FEF08A" stroke={DOODLE_STROKE} strokeWidth={6} />
        <text
          textAnchor="middle"
          y={16}
          fontFamily="'Comic Sans MS', cursive"
          fontSize={44}
          fontWeight="bold"
          fill="#DC2626"
        >
          VS
        </text>
      </g>

      {/* LEFT SIDE: DARK SURFACE OVEN */}
      <g transform="translate(480, 200)">
        {/* Title */}
        <text
          textAnchor="middle"
          y={40}
          fontFamily="'Comic Sans MS', cursive"
          fontSize={40}
          fontWeight="bold"
          fill="#DC2626"
        >
          DARK SURFACE
        </text>
        {/* Sun blazing overhead */}
        <text textAnchor="middle" y={100} fontSize={48}>HEAT TRAP</text>

        {/* Dark Building Box */}
        <rect
          x={-280}
          y={140}
          width={560}
          height={380}
          rx={12}
          fill="#FEE2E2"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        <rect
          x={-300}
          y={120}
          width={600}
          height={40}
          rx={6}
          fill="#18181B"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Sweating Stickman */}
        <DoodleStickman x={-80} y={320} scale={1.7} pose="panicking" expression="sweating" />

        {/* Extreme Red Thermometer */}
        <DoodleThermometer x={140} y={440} height={240} tempPercent={95} label="115F" themeColor="#B91C1C" />
      </g>

      {/* RIGHT SIDE: WHITE SURFACE OASIS */}
      <g transform="translate(1440, 200)">
        {/* Title */}
        <text
          textAnchor="middle"
          y={40}
          fontFamily="'Comic Sans MS', cursive"
          fontSize={40}
          fontWeight="bold"
          fill="#0284C7"
        >
          WHITE SURFACE
        </text>
        {/* Sun reflected away */}
        <text textAnchor="middle" y={100} fontSize={48}>HEAT DEFLECTED</text>

        {/* White Building Box */}
        <rect
          x={-280}
          y={140}
          width={560}
          height={380}
          rx={12}
          fill="#F0F9FF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        <rect
          x={-300}
          y={120}
          width={600}
          height={40}
          rx={6}
          fill="#FFFFFF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Relaxed Stickman */}
        <DoodleStickman x={-80} y={320} scale={1.7} pose="waving" expression="smile" />

        {/* Cool Blue Thermometer */}
        <DoodleThermometer x={140} y={440} height={240} tempPercent={38} label="74F" themeColor="#0284C7" />
      </g>

      </DoodlePaper>
  );
};
