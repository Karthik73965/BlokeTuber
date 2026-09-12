import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleCross, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene11_AncientAC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const crossPop = spring({ frame: frame - 45, fps, config: { damping: 9, stiffness: 240 } });

  return (
    <DoodlePaper cameraZoom={[1.0, 1.06]} cameraPanX={[0, 0]}>
      {/* LEFT: MODERN AIR CONDITIONER (ELECTRICITY REQUIRED) */}
      <g transform="translate(540, 480)">
        {/* AC Unit Box */}
        <rect
          x={-240}
          y={-140}
          width={480}
          height={240}
          rx={16}
          fill="#F4F4F5"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        {/* Louver Slits */}
        {[-40, 0, 40].map((ly) => (
          <line
            key={ly}
            x1={-200}
            y1={ly}
            x2={200}
            y2={ly}
            stroke={DOODLE_STROKE}
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
        {/* Power Cord severed */}
        <path
          d="M 240 40 Q 310 80 280 160"
          fill="none"
          stroke="#18181B"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Sparks on cord */}
        <text x={290} y={170} fontSize={32}>?</text>

        {/* AC Label */}
        <text
          x={0}
          y={-80}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', cursive"
          fontSize={30}
          fontWeight="bold"
          fill="#52525B"
        >
          MODERN A/C UNIT
        </text>

        {/* Slamming RED ? on Modern AC */}
        {frame > 45 && (
          <g transform={`scale(${Math.max(0, crossPop)})`}>
            <DoodleCross x={0} y={0} size={280} />
            {/* "NOT INVENTED YET" badge */}
            <rect
              x={-180}
              y={130}
              width={360}
              height={50}
              rx={10}
              fill="#DC2626"
            />
            <text
              x={0}
              y={165}
              textAnchor="middle"
              fontFamily="'Comic Sans MS', cursive"
              fontSize={24}
              fontWeight="bold"
              fill="#FFFFFF"
            >
              NOT INVENTED YET!
            </text>
          </g>
        )}
      </g>

      {/* RIGHT: ANCIENT LIMEWHITE CLIMATE TECH */}
      <g transform="translate(1420, 480)">
        {/* White Stone Building Facade */}
        <rect
          x={-240}
          y={-140}
          width={480}
          height={320}
          rx={16}
          fill="#FFFFFF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        {/* Wooden bucket of white lime wash */}
        <g transform="translate(-120, 90)">
          <polygon points="-50,-50 50,-50 40,60 -40,60" fill="#B45309" stroke={DOODLE_STROKE} strokeWidth={5} />
          {/* White paint pool */}
          <ellipse cx={0} cy={-50} rx={45} ry={14} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
          <text x={-40} y={15} fontSize={18} fontWeight="bold" fill="#FFF">LIME</text>
        </g>

        {/* White Paint Brush */}
        <g transform="translate(60, 40) rotate(-25)">
          <rect x={-20} y={-60} width={40} height={70} fill="#D97706" stroke={DOODLE_STROKE} strokeWidth={4} />
          <path d="M -22 10 L 22 10 L 26 50 L -26 50 Z" fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
        </g>

        {/* Green Badge: "0 ELECTRICITY  PASSIVE COOLING" */}
        <g transform="translate(0, -80)">
          <rect
            x={-210}
            y={-28}
            width={420}
            height={56}
            rx={12}
            fill="#10B981"
          />
          <text
            textAnchor="middle"
            y={10}
            fontFamily="'Comic Sans MS', cursive"
            fontSize={22}
            fontWeight="bold"
            fill="#FFFFFF"
          >
            0 WATT PASSIVE TECH 
          </text>
        </g>
      </g>

      {/* Host Stickman in Center */}
      <DoodleStickman
        x={960}
        y={540}
        scale={2.0}
        pose="waving"
        expression="talking"
      />

      </DoodlePaper>
  );
};
