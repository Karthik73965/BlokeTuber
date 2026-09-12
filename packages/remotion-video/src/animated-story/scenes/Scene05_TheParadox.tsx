import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleCross, DoodleSun, DoodleWhiteHouse, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene05_TheParadox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sequential Comic Panel Pop-ins (Inkly signature style from snap_50s.jpg)
  const panel1Spring = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const panel2Spring = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 200 } });
  const panel3Spring = spring({ frame: frame - 55, fps, config: { damping: 10, stiffness: 220 } });
  const stampSpring = spring({ frame: frame - 70, fps, config: { damping: 8, stiffness: 260 } });

  return (
    <DoodlePaper cameraZoom={[1.0, 1.05]}>
      {/* Title Header: Hand-drawn question */}
      <text
        x={960}
        y={110}
        textAnchor="middle"
        fontFamily="'Comic Sans MS', cursive"
        fontSize={42}
        fontWeight="bold"
        fill="#18181B"
      >
        WHY PAINT ENTIRE VILLAGES WHITE?
      </text>

      {/* 3 COMIC PANELS CONNECTED BY ARROWS (Exact Inkly snap_50s.jpg layout) */}
      <g transform="translate(180, 190)">
        {/* PANEL 1: SCORCHING SUN & VILLAGE */}
        <g transform={`scale(${panel1Spring})`} style={{ transformOrigin: '200px 300px' }}>
          <rect
            x={0}
            y={0}
            width={440}
            height={560}
            rx={14}
            fill="#FFFFFF"
            stroke={DOODLE_STROKE}
            strokeWidth={DOODLE_WIDTH}
          />
          {/* Desert ground */}
          <path d="M 0 430 Q 150 370 440 420 L 440 560 L 0 560 Z" fill="#FDE68A" stroke={DOODLE_STROKE} strokeWidth={6} />
          {/* Sun */}
          <DoodleSun x={130} y={150} size={110} angry={true} />
          {/* White house */}
          <DoodleWhiteHouse x={300} y={380} scale={1.1} dome={true} />
          <text x={220} y={520} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={26} fontWeight="bold" fill="#B45309">
            Hottest Regions
          </text>
        </g>

        {/* ARROW 1 -> 2 */}
        {frame > 20 && (
          <g transform="translate(465, 280)" stroke={DOODLE_STROKE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1={0} y1={0} x2={40} y2={0} />
            <path d="M 28 -14 L 42 0 L 28 14" />
          </g>
        )}

        {/* PANEL 2: ART & BEAUTY? */}
        {frame > 25 && (
          <g transform={`translate(535, 0) scale(${Math.max(0, panel2Spring)})`} style={{ transformOrigin: '200px 300px' }}>
            <rect
              x={0}
              y={0}
              width={440}
              height={560}
              rx={14}
              fill="#FFFFFF"
              stroke={DOODLE_STROKE}
              strokeWidth={DOODLE_WIDTH}
            />
            {/* Art palette & brush */}
            <g transform="translate(220, 240)">
              <ellipse cx={0} cy={0} rx={110} ry={85} fill="#F1F5F9" stroke={DOODLE_STROKE} strokeWidth={7} />
              <circle cx={-50} cy={-20} r={18} fill="#EF4444" />
              <circle cx={0} cy={-40} r={18} fill="#3B82F6" />
              <circle cx={50} cy={-20} r={18} fill="#EAB308" />
              <circle cx={40} cy={30} r={18} fill="#10B981" />
              <line x1={-30} y1={50} x2={90} y2={-70} stroke="#92400E" strokeWidth={14} strokeLinecap="round" />
            </g>
            <text x={220} y={420} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={34} fontWeight="bold" fill="#DB2777">
              BEAUTY?
            </text>
            <text x={220} y={470} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={24} fill="#64748B">
              Artistic Style?
            </text>
          </g>
        )}

        {/* ARROW 2 -> 3 */}
        {frame > 50 && (
          <g transform="translate(1000, 280)" stroke={DOODLE_STROKE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1={0} y1={0} x2={40} y2={0} />
            <path d="M 28 -14 L 42 0 L 28 14" />
          </g>
        )}

        {/* PANEL 3: NO! SLAMMING RED ? */}
        {frame > 55 && (
          <g transform={`translate(1070, 0) scale(${Math.max(0, panel3Spring)})`} style={{ transformOrigin: '200px 300px' }}>
            <rect
              x={0}
              y={0}
              width={440}
              height={560}
              rx={14}
              fill="#FFFFFF"
              stroke={DOODLE_STROKE}
              strokeWidth={DOODLE_WIDTH}
            />
            {/* Shocked stickman */}
            <DoodleStickman x={220} y={230} scale={1.7} pose="panicking" expression="shocked" pupilDirection="center" />

            {/* Slamming RED ? */}
            {frame > 70 && (
              <DoodleCross x={220} y={210} size={300} popProgress={Math.max(0, stampSpring)} />
            )}

            <text x={220} y={480} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={36} fontWeight="bold" fill="#DC2626">
              NOT FOR BEAUTY!
            </text>
          </g>
        )}
      </g>
    </DoodlePaper>
  );
};
