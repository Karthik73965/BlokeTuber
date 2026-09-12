import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleSun, DoodleThermometer, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene07_DarkAbsorption: React.FC = () => {
  const frame = useCurrentFrame();

  // Rapid heat rise
  const tempRise = interpolate(frame, [0, 150], [60, 100], { extrapolateRight: 'clamp' });
  const rayOffset = (frame * 15) % 80;

  return (
    <DoodlePaper cameraZoom={[1.0, 1.07]} cameraPanY={[0, -15]}>
      {/* Brutal Sun overhead */}
      <DoodleSun x={960} y={150} size={150} angry={true} />

      {/* Solar Rays Shooting Downward into the Dark Roof */}
      <g stroke="#DC2626" strokeWidth={DOODLE_WIDTH * 1.3} strokeLinecap="round" fill="none">
        {[650, 800, 960, 1120, 1270].map((rx, idx) => (
          <g key={idx}>
            <line
              x1={rx}
              y1={240}
              x2={rx}
              y2={440}
              strokeDasharray="24 16"
              strokeDashoffset={-rayOffset}
            />
            {/* Arrowhead hitting roof */}
            <path
              d={`M ${rx - 16} 420 L ${rx} 445 L ${rx + 16} 420`}
              strokeWidth={DOODLE_WIDTH}
            />
          </g>
        ))}
      </g>

      {/* House with Black Roof & Hot Oven Interior */}
      <g transform="translate(960, 640)">
        {/* Pitch Black Absorption Roof */}
        <polygon
          points="-400,-180 0,-340 400,-180"
          fill="#18181B"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        {/* Heat Absorption Glow on roof */}
        <polygon
          points="-380,-185 0,-330 380,-185"
          fill="rgba(239, 68, 68, 0.4)"
        />

        {/* Oven-like Glowing Red Interior */}
        <rect
          x={-350}
          y={-180}
          width={700}
          height={380}
          fill="#FEE2E2"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Heat Waves inside room */}
        <g stroke="#EF4444" strokeWidth={6} fill="none" strokeLinecap="round">
          {[-220, -100, 40, 160].map((hx, idx) => (
            <path
              key={idx}
              d={`M ${hx} 120 Q ${hx + 25} 40 ${hx} -40 Q ${hx - 25} -120 ${hx} -160`}
              transform={`translate(0, ${Math.sin(frame * 0.2 + idx) * 8})`}
            />
          ))}
        </g>

        {/* Panicking Sweating Stickman */}
        <DoodleStickman
          x={-80}
          y={60}
          scale={1.9}
          pose="panicking"
          expression="sweating"
        />

        {/* Thermometer Inside House */}
        <DoodleThermometer
          x={230}
          y={140}
          height={260}
          tempPercent={tempRise}
          label={`${Math.round(80 + tempRise * 0.45)}F`}
          themeColor="#B91C1C"
        />
      </g>

      {/* Dark Surface Warning Banner */}
      <g transform="translate(960, 1000)">
        <rect
          x={-580}
          y={-38}
          width={1160}
          height={68}
          rx={34}
          fill="rgba(185, 28, 28, 0.95)"
        />
        <text
          textAnchor="middle"
          y={10}
          fill="#FFFFFF"
          fontSize={30}
          fontWeight="bold"
          fontFamily="'Comic Sans MS', cursive"
        >
          Dark surfaces ABSORB sunlight & turn energy into intense HEAT
        </text>
      </g>
    </DoodlePaper>
  );
};
