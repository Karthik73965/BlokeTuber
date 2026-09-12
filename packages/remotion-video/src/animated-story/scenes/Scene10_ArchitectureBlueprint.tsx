import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleCross, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene10_ArchitectureBlueprint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stampPop = spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 220 } });

  return (
    <DoodlePaper cameraZoom={[1.0, 1.06]} cameraPanX={[0, -20]}>
      {/* Blueprint Grid Paper Container */}
      <g transform="translate(480, 180)">
        {/* Blue Drafting Grid Sheet */}
        <rect
          x={0}
          y={0}
          width={1100}
          height={680}
          rx={16}
          fill="#1E3A8A"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        {/* Grid Lines */}
        <g stroke="rgba(147, 197, 253, 0.25)" strokeWidth={2}>
          {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((gx) => (
            <line key={gx} x1={gx} y1={0} x2={gx} y2={680} />
          ))}
          {[100, 200, 300, 400, 500, 600].map((gy) => (
            <line key={gy} x1={0} y1={gy} x2={1100} y2={gy} />
          ))}
        </g>

        {/* Blueprint House Schematic in White Ink */}
        <g stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Main House Box */}
          <rect x={350} y={240} width={400} height={300} />
          {/* Blue Dome Arc */}
          <path d="M 420 240 A 130 130 0 0 1 680 240" />
          {/* Arched Door */}
          <path d="M 500 540 L 500 420 A 50 50 0 0 1 600 420 L 600 540" />
          {/* Dimension Measurement Lines with Arrows */}
          <line x1={320} y1={240} x2={320} y2={540} strokeDasharray="6 6" />
          <line x1={300} y1={240} x2={340} y2={240} />
          <line x1={300} y1={540} x2={340} y2={540} />
          {/* Solar Angle Rays */}
          <line x1={780} y1={80} x2={620} y2={240} stroke="#FDE047" strokeWidth={6} />
          <text x={800} y={90} fill="#FDE047" fontSize={24} fontWeight="bold">? = 65</text>
        </g>

        {/* Title on blueprint */}
        <text
          x={550}
          y={80}
          textAnchor="middle"
          fill="#93C5FD"
          fontFamily="'Comic Sans MS', cursive"
          fontSize={34}
          fontWeight="bold"
        >
          ARCHITECTURAL STYLE?
        </text>

        {/* Red ? on "JUST STYLE" */}
        {frame > 25 && (
          <g transform={`translate(550, 70) scale(${Math.max(0, stampPop)})`}>
            <DoodleCross x={0} y={0} size={160} />
          </g>
        )}

        {/* Gold Stamp: "ENGINEERED CLIMATE SHIELD" */}
        {frame > 40 && (
          <g transform="translate(550, 600) rotate(-6)">
            <rect
              x={-240}
              y={-35}
              width={480}
              height={70}
              rx={10}
              fill="#FEF08A"
              stroke="#B45309"
              strokeWidth={5}
            />
            <text
              textAnchor="middle"
              y={12}
              fill="#B45309"
              fontFamily="'Comic Sans MS', cursive"
              fontSize={28}
              fontWeight="bold"
            >
              THERMAL ENGINEERING ?
            </text>
          </g>
        )}
      </g>

      {/* Architect Stickman pointing with wooden ruler */}
      <DoodleStickman
        x={280}
        y={580}
        scale={2.0}
        pose="pointing_board"
        expression="talking"
      />

      </DoodlePaper>
  );
};
