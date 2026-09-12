import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleSun, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene06_TheShield: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shieldPulse = 1 + Math.sin(frame * 0.15) * 0.04;
  const rayOffset = (frame * 12) % 60;

  return (
    <DoodlePaper cameraZoom={[1.0, 1.05]} cameraPanX={[0, 15]}>
      {/* Outside: Angry Blazing Sun */}
      <DoodleSun x={300} y={220} size={150} angry={true} />

      {/* Sun Ray Beams hitting the shield */}
      <g stroke="#DC2626" strokeWidth={DOODLE_WIDTH} strokeLinecap="round" fill="none">
        <line x1={420} y1={280} x2={780} y2={450} strokeDasharray="20 15" strokeDashoffset={-rayOffset} />
        <line x1={380} y1={350} x2={740} y2={560} strokeDasharray="20 15" strokeDashoffset={-rayOffset} />
        <line x1={320} y1={410} x2={700} y2={680} strokeDasharray="20 15" strokeDashoffset={-rayOffset} />
      </g>

      {/* Cross-Section House Container */}
      <g transform="translate(1220, 520)">
        {/* Protective Blue Forcefield Dome Shield */}
        <path
          d="M -380 360 C -380 -80 -180 -280 0 -280 C 180 -280 380 -80 380 360"
          fill="rgba(186, 230, 253, 0.25)"
          stroke="#0284C7"
          strokeWidth={DOODLE_WIDTH * 1.5}
          strokeDasharray="18 12"
          transform={`scale(${shieldPulse})`}
          style={{ transformOrigin: '0px 200px' }}
        />

        {/* Shield Icon Badge */}
        <g transform="translate(0, -290)">
          <polygon
            points="0,-40 35,-20 35,20 0,45 -35,20 -35,-20"
            fill="#38BDF8"
            stroke={DOODLE_STROKE}
            strokeWidth={5}
          />
          <text
            x={0}
            y={12}
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
            fontSize={28}
            fontWeight="bold"
            fill="#FFFFFF"
          >
            ?
          </text>
        </g>

        {/* White House Walls & Blue Dome */}
        {/* Thick White Roof */}
        <rect
          x={-280}
          y={-140}
          width={560}
          height={60}
          fill="#FFFFFF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
          rx={8}
        />
        {/* White House Interior Chamber (Cool Light Cyan Fill) */}
        <rect
          x={-260}
          y={-80}
          width={520}
          height={420}
          fill="#F0F9FF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Cool interior AC snowflake decals */}
        <text x={-200} y={0} fontSize={40}></text>
        <text x={180} y={-20} fontSize={36}></text>
        <text x={190} y={160} fontSize={32}></text>

        {/* Relaxed Stickman inside sipping drink */}
        <DoodleStickman
          x={-20}
          y={110}
          scale={2.0}
          hat="sunglasses"
          pose="sipping_drink"
          expression="smile"
        />

        {/* Recliner chair */}
        <path
          d="M -120 280 L -60 280 L 40 290 L 80 230"
          fill="none"
          stroke="#047857"
          strokeWidth={14}
          strokeLinecap="round"
        />
      </g>

      </DoodlePaper>
  );
};
